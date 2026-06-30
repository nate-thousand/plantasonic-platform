import {
  AsciiEngine,
  listPresets,
  presets as visualPresets,
  type PresetId,
} from 'ascii-visual-engine';

import type {
  PlatformEventBus,
  Preset,
  VisualEngineAdapter,
  VisualEngineMountTarget,
  VisualEngineStatus,
} from '@plantasonic/platform-types';

/** Options for creating a visual engine adapter */
export interface CreateVisualEngineAdapterOptions {
  eventBus: PlatformEventBus;
  source?: string;
}

/** Preset summary for demo UI */
export interface VisualPresetSummary {
  id: string;
  name: string;
}

/** Map sound-engine preset ids to ascii-visual-engine preset ids (demo compatibility) */
const SOUND_TO_VISUAL_PRESET: Record<string, PresetId> = {
  seed: 'glyphOrganicBloom',
  moss: 'glyphOrganicBloom',
  flowers: 'glyphDigitalForest',
  mold: 'glyphCorruptedBroadcast',
  bacteria: 'glyphParticleNebula',
  plantasonic: 'organic',
  'juno-flowers': 'glyphDigitalForest',
  ambient: 'ambient',
  drone: 'minimal',
};

const VISUAL_PRESET_IDS = new Set<string>(Object.keys(visualPresets));

/**
 * Thin compatibility wrapper around ascii-visual-engine (Plantasia Visual Engine).
 *
 * Package naming: npm package is `ascii-visual-engine`; ecosystem docs refer to
 * it as plantasia-visual-engine.
 *
 * API mapping notes (engine → adapter):
 * - `init()` — prepares adapter state (no DOM)
 * - `mount()` — creates canvas + `new AsciiEngine({ autoStart: false })`
 * - `start()` / `stop()` — `engine.start()` / `engine.stop()`
 * - `setPreset()` — `engine.setPresetById()` with sound→visual id mapping
 * - `updateParameter()` — `engine.setControl(name, value)`
 * - `resize()` — `engine.resize(width, height)`
 * - `dispose()` — `engine.destroy()` + DOM cleanup
 */
export function createVisualEngineAdapter(
  options: CreateVisualEngineAdapterOptions,
): VisualEngineAdapter {
  const { eventBus, source = 'visual-adapter' } = options;

  let engine: AsciiEngine | null = null;
  let canvas: HTMLCanvasElement | null = null;
  let mountElement: HTMLElement | null = null;
  let mounted = false;
  let playing = false;
  let currentPresetId: string | null = 'basic';
  let width = 0;
  let height = 0;
  let lastError: string | null = null;
  const parameterSnapshot: Record<string, number> = {
    density: 1,
    speed: 0.5,
    glitchAmount: 0.1,
    trailAmount: 0.3,
  };

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
    emit('visual:error', { operation, message });
    console.warn(`[platform:visual] ${operation}:`, message);
  };

  const adapter: VisualEngineAdapter = {
    id: 'visual',
    engineName: 'ascii-visual-engine',
    get isReady(): boolean {
      return engine !== null && mounted;
    },

    async init(): Promise<void> {
      emit('visual:init', { engineName: adapter.engineName });
    },

    async initialize(): Promise<void> {
      await adapter.init();
    },

    async mount(target: VisualEngineMountTarget): Promise<void> {
      if (mounted) return;
      try {
        mountElement = target.element;
        const rect = mountElement.getBoundingClientRect();
        width = Math.max(1, Math.round(rect.width));
        height = Math.max(1, Math.round(rect.height));

        canvas = document.createElement('canvas');
        canvas.className = 'ps-stage__canvas';
        canvas.setAttribute('aria-hidden', 'true');
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.display = 'block';
        mountElement.appendChild(canvas);

        engine = new AsciiEngine({
          canvas,
          width,
          height,
          autoStart: false,
        });
        engine.disableKeyboardInput();
        engine.setPresetById(currentPresetId ?? 'basic');

        mounted = true;
        emit('visual:mount', { width, height, presetId: currentPresetId });
      } catch (error) {
        reportError('mount', error);
        throw error;
      }
    },

    async unmount(): Promise<void> {
      try {
        await adapter.stop();
        engine?.destroy();
      } catch (error) {
        reportError('unmount', error);
      } finally {
        canvas?.remove();
        engine = null;
        canvas = null;
        mountElement = null;
        mounted = false;
        playing = false;
      }
    },

    async start(): Promise<void> {
      const eng = requireEngine();
      try {
        eng.start();
        playing = true;
        emit('visual:start', { presetId: currentPresetId });
      } catch (error) {
        playing = false;
        reportError('start', error);
        throw error;
      }
    },

    async stop(): Promise<void> {
      const eng = engine;
      if (!eng) return;
      try {
        eng.inputPanic();
        eng.stop();
        playing = false;
        emit('visual:stop', { presetId: currentPresetId });
      } catch (error) {
        reportError('stop', error);
      }
    },

    async setPreset(preset: Preset | string): Promise<void> {
      const eng = requireEngine();
      const requestedId = typeof preset === 'string' ? preset : preset.id;
      const visualId = resolveVisualPresetId(requestedId);
      try {
        eng.setPresetById(visualId);
        currentPresetId = visualId;
        emit('visual:preset-change', { presetId: visualId, requestedId });
        if (playing) {
          eng.start();
        }
      } catch (error) {
        reportError('setPreset', error);
        throw error;
      }
    },

    async updateParameter(name: string, value: number): Promise<void> {
      const eng = requireEngine();
      try {
        const clamped = Math.min(1, Math.max(0, value));
        eng.setControl(name, clamped);
        parameterSnapshot[name] = clamped;
        emit('visual:parameter-change', { name, value: clamped });
      } catch (error) {
        reportError('updateParameter', error);
        throw error;
      }
    },

    resize(nextWidth: number, nextHeight: number): void {
      const eng = engine;
      if (!eng || nextWidth <= 0 || nextHeight <= 0) return;
      try {
        width = Math.max(1, Math.round(nextWidth));
        height = Math.max(1, Math.round(nextHeight));
        eng.resize(width, height);
        emit('visual:resize', { width, height });
      } catch (error) {
        reportError('resize', error);
      }
    },

    getStatus(): VisualEngineStatus {
      const eng = engine;
      return {
        initialized: true,
        mounted,
        playing: eng?.isRunning() ?? playing,
        engineState: eng
          ? eng.isRunning()
            ? 'running'
            : mounted
              ? 'mounted'
              : 'idle'
          : 'idle',
        currentPresetId,
        width,
        height,
        fps: eng?.getEngineFps() ?? 0,
        lastError,
      };
    },

    getParameterSnapshot(): Readonly<Record<string, number>> {
      return { ...parameterSnapshot };
    },

    async dispose(): Promise<void> {
      await adapter.unmount();
      currentPresetId = 'basic';
      width = 0;
      height = 0;
    },
  };

  function requireEngine(): AsciiEngine {
    if (!engine) {
      throw new Error('Visual engine not mounted — call mount() first');
    }
    return engine;
  }

  return adapter;
}

/** Resolve a platform/sound preset id to a visual engine preset id */
export function resolveVisualPresetId(presetId: string): string {
  if (VISUAL_PRESET_IDS.has(presetId)) {
    return presetId;
  }
  const mapped = SOUND_TO_VISUAL_PRESET[presetId];
  if (mapped) {
    return mapped;
  }
  if (presetId in visualPresets) {
    return presetId;
  }
  return 'basic';
}

/** List built-in visual presets from the engine */
export function listVisualEnginePresets(): VisualPresetSummary[] {
  return listPresets().map((preset: { id: string; name: string }) => ({
    id: preset.id,
    name: preset.name,
  }));
}
