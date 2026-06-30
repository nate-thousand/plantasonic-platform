import type {
  AudioFeature,
  AudioFeaturesSnapshot,
  AudioReactiveBridge,
  AudioReactiveBridgeConfig,
  AudioReactiveBridgeStatus,
  AudioReactiveMapping,
  PlatformEventBus,
  SoundEngineAdapter,
  VisualEngineAdapter,
  VisualTarget,
} from '@plantasonic/platform-types';

import {
  resolveVisualControlName,
  VISUAL_TARGET_DEFAULTS,
} from './visualTargetMap.js';

/** Options for creating the audio reactive bridge */
export interface CreateAudioReactiveBridgeOptions {
  eventBus: PlatformEventBus;
  source?: string;
}

export const DEFAULT_AUDIO_REACTIVE_MAPPINGS: AudioReactiveMapping[] = [
  { feature: 'bass', target: 'density', amount: 0.45, enabled: true },
  { feature: 'mids', target: 'motion', amount: 0.4, enabled: true },
  { feature: 'highs', target: 'brightness', amount: 0.35, enabled: true },
  { feature: 'amplitude', target: 'scale', amount: 0.3, enabled: true },
  { feature: 'transient', target: 'glitch', amount: 0.25, enabled: true },
];

const DEFAULT_CONFIG: AudioReactiveBridgeConfig = {
  enabled: false,
  sensitivity: 0.75,
  smoothing: 0.65,
  mappings: DEFAULT_AUDIO_REACTIVE_MAPPINGS,
};

/**
 * Platform-level bridge connecting Sound and Visual adapters through analysis
 * and parameter mapping. Engines never reference each other directly.
 */
export function createAudioReactiveBridge(
  options: CreateAudioReactiveBridgeOptions,
): AudioReactiveBridge {
  const { eventBus, source = 'audio-reactive-bridge' } = options;

  let initialized = false;
  let connected = false;
  let running = false;
  let config: AudioReactiveBridgeConfig = {
    ...DEFAULT_CONFIG,
    mappings: DEFAULT_AUDIO_REACTIVE_MAPPINGS.map((mapping) => ({ ...mapping })),
  };

  let sound: SoundEngineAdapter | null = null;
  let visual: VisualEngineAdapter | null = null;
  let rafId: number | null = null;
  let lastError: string | null = null;
  let framesProcessed = 0;
  let lastFeatures: AudioFeaturesSnapshot | null = null;
  let smoothedFeatures: AudioFeaturesSnapshot | null = null;
  const baseValues = new Map<string, number>();
  const unsubscribers: Array<() => void> = [];

  const emit = (type: string, payload?: unknown): void => {
    eventBus.emit({
      type,
      timestamp: new Date().toISOString(),
      source,
      payload,
    });
  };

  const reportError = (operation: string, error: unknown): void => {
    const message = error instanceof Error ? error.message : String(error);
    lastError = message;
    emit('bridge:error', { operation, message });
    console.warn(`[platform:bridge] ${operation}:`, message);
  };

  const captureBaseValues = (): void => {
    baseValues.clear();
    for (const [target, defaultValue] of Object.entries(VISUAL_TARGET_DEFAULTS)) {
      baseValues.set(target, defaultValue);
    }
  };

  const ensureEnginesReady = (): void => {
    if (!sound?.getStatus().initialized) {
      throw new Error('Sound adapter not initialized — call sound.init() first');
    }
    const visualStatus = visual?.getStatus();
    if (!visualStatus?.mounted) {
      throw new Error('Visual adapter not mounted — call visual.mount() first');
    }
  };

  const smoothFeatures = (next: AudioFeaturesSnapshot): AudioFeaturesSnapshot => {
    const alpha = 1 - Math.min(0.95, Math.max(0.05, config.smoothing));
    if (!smoothedFeatures) {
      smoothedFeatures = { ...next };
      return smoothedFeatures;
    }
    smoothedFeatures = {
      amplitude: lerp(smoothedFeatures.amplitude, next.amplitude, alpha),
      bass: lerp(smoothedFeatures.bass, next.bass, alpha),
      mids: lerp(smoothedFeatures.mids, next.mids, alpha),
      highs: lerp(smoothedFeatures.highs, next.highs, alpha),
      transient: lerp(smoothedFeatures.transient, next.transient, alpha),
      timestamp: next.timestamp,
    };
    return smoothedFeatures;
  };

  const readFeature = (features: AudioFeaturesSnapshot, feature: AudioFeature): number => {
    return features[feature];
  };

  const applyMappings = (features: AudioFeaturesSnapshot): void => {
    const vis = visual;
    if (!vis || !config.enabled) return;

    const snapshot = vis.getParameterSnapshot();
    const appliedTargets = new Set<string>();

    for (const mapping of config.mappings) {
      if (mapping.enabled === false || mapping.amount <= 0) continue;

      const targetKey = mapping.target;
      if (appliedTargets.has(targetKey)) continue;
      appliedTargets.add(targetKey);

      const controlName = resolveVisualControlName(mapping.target);
      const defaultBase = baseValues.get(targetKey) ?? VISUAL_TARGET_DEFAULTS[mapping.target];
      const snapshotBase = snapshot[controlName];
      const base =
        snapshotBase !== undefined
          ? snapshotBase
          : defaultBase;

      const featureValue = readFeature(features, mapping.feature);
      const swing = mapping.amount * config.sensitivity * 0.22;
      const delta = (featureValue - 0.5) * swing;

      let value: number;
      if (mapping.target === 'density' || mapping.target === 'scale' || mapping.target === 'brightness') {
        value = Math.max(0.05, base * (1 + delta));
        void vis.setControlSync(controlName, value);
      } else {
        value = clamp01(base + delta);
        void vis.setControlSync(controlName, value);
      }
    }
  };

  const tick = (): void => {
    if (!running) return;
    rafId = requestAnimationFrame(tick);

    try {
      if (!sound || !visual) return;

      const soundStatus = sound.getStatus();
      const visualStatus = visual.getStatus();
      if (!soundStatus.playing || !visualStatus.playing) {
        return;
      }

      const raw = sound.getAudioFeatures();
      lastFeatures = raw;
      if (!config.enabled) return;

      const features = smoothFeatures(raw);
      applyMappings(features);
      framesProcessed += 1;
    } catch (error) {
      reportError('tick', error);
    }
  };

  const subscribeEngineEvents = (): void => {
    unsubscribers.push(
      eventBus.on('sound', (event) => {
        if (event.type === 'sound:stop') {
          void bridge.stop();
        }
      }).unsubscribe,
    );
    unsubscribers.push(
      eventBus.on('visual', (event) => {
        if (event.type === 'visual:stop') {
          void bridge.stop();
        }
      }).unsubscribe,
    );
  };

  const bridge: AudioReactiveBridge = {
    async init(): Promise<void> {
      if (initialized) return;
      initialized = true;
      captureBaseValues();
      emit('bridge:init', { mappings: config.mappings.length });
    },

    connect(nextSound: SoundEngineAdapter, nextVisual: VisualEngineAdapter): void {
      if (connected) {
        bridge.disconnect();
      }
      sound = nextSound;
      visual = nextVisual;
      connected = true;
      captureBaseValues();
      smoothedFeatures = null;
      subscribeEngineEvents();
      emit('bridge:connect', {
        soundReady: nextSound.getStatus().initialized,
        visualMounted: nextVisual.getStatus().mounted,
      });
    },

    disconnect(): void {
      for (const unsub of unsubscribers) {
        unsub();
      }
      unsubscribers.length = 0;
      sound = null;
      visual = null;
      connected = false;
      smoothedFeatures = null;
      emit('bridge:disconnect', {});
    },

    async start(): Promise<void> {
      if (running) return;
      try {
        ensureEnginesReady();
        if (!connected) {
          throw new Error('Bridge not connected — call connect() first');
        }
        if (!initialized) {
          await bridge.init();
        }
        running = true;
        framesProcessed = 0;
        emit('bridge:start', { enabled: config.enabled });
        tick();
      } catch (error) {
        running = false;
        reportError('start', error);
        throw error;
      }
    },

    async stop(): Promise<void> {
      if (!running) return;
      running = false;
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      emit('bridge:stop', { framesProcessed });
    },

    updateMapping(partial: Partial<AudioReactiveBridgeConfig>): void {
      if (partial.enabled !== undefined) {
        config.enabled = partial.enabled;
      }
      if (partial.sensitivity !== undefined) {
        config.sensitivity = clamp01(partial.sensitivity);
      }
      if (partial.smoothing !== undefined) {
        config.smoothing = clamp01(partial.smoothing);
      }
      if (partial.mappings !== undefined) {
        config.mappings = partial.mappings.map((mapping) => ({ ...mapping }));
      }
      emit('bridge:mapping-change', {
        enabled: config.enabled,
        sensitivity: config.sensitivity,
        smoothing: config.smoothing,
        mappings: config.mappings,
      });
    },

    setMappingBase(target: VisualTarget, value: number): void {
      baseValues.set(target, clamp01(value));
    },

    getStatus(): AudioReactiveBridgeStatus {
      return {
        initialized,
        connected,
        running,
        enabled: config.enabled,
        sensitivity: config.sensitivity,
        smoothing: config.smoothing,
        mappings: config.mappings.map((mapping) => ({ ...mapping })),
        lastFeatures,
        lastError,
        framesProcessed,
      };
    },

    async dispose(): Promise<void> {
      await bridge.stop();
      bridge.disconnect();
      initialized = false;
      lastFeatures = null;
      smoothedFeatures = null;
      framesProcessed = 0;
      lastError = null;
    },
  };

  return bridge;
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function lerp(from: number, to: number, alpha: number): number {
  return from + (to - from) * alpha;
}
