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
  VisualEngineExportResult,
  VisualEngineFrameCaptureStatus,
  VisualEngineGifExportOptions,
  VisualEngineMountTarget,
  VisualEngineStatus,
  VisualEngineVideoInput,
  VisualEngineVideoStatus,
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

type GlyphCapableEngine = AsciiEngine & {
  setGlyphSet?: (glyphs: string[]) => void;
  setBassGlyphScale?: (level: number) => void;
};

/** Works with current source and older prebuilt engine bundles missing public helpers. */
function applyEngineGlyphSet(eng: AsciiEngine, glyphs: string[]): void {
  if (glyphs.length === 0) return;

  const engine = eng as GlyphCapableEngine;
  if (typeof engine.setGlyphSet === 'function') {
    engine.setGlyphSet(glyphs);
    return;
  }

  const registry = eng.getGlyphRegistry();
  registry.disable();
  registry.setResolvedGlyphSet(glyphs);
  eng.getRendererManager().setGlyphSet(glyphs);
}

function applyEngineBassGlyphScale(eng: AsciiEngine, level: number): void {
  const engine = eng as GlyphCapableEngine;
  if (typeof engine.setBassGlyphScale === 'function') {
    engine.setBassGlyphScale(level);
  }
}

/** Strip procedural layers that overwrite external source sampling. */
function applyVideoSamplingPipeline(eng: AsciiEngine): void {
  for (const plugin of eng.getPluginManager().getAll()) {
    if (plugin.type === 'pattern') {
      eng.disablePlugin(plugin.id);
      continue;
    }
    if (plugin.type === 'effect') {
      const phase = (plugin as { phase?: string }).phase;
      // Keep glitch for video post; disable motion generators and trails/feedback plugins.
      if (phase === 'motion' || (phase === 'post' && plugin.id !== 'glitch')) {
        eng.disablePlugin(plugin.id);
      }
    }
  }
  for (const motion of eng.getMotionManager().getAll()) {
    eng.disableMotion(motion.id);
  }
  for (const simulation of eng.getSimulationManager().getAll()) {
    eng.disableSimulation(simulation.id);
  }
  enableVideoPostPasses(eng);
  eng.enablePlugin('glitch');
}

function enableVideoPostPasses(eng: AsciiEngine): void {
  const post = eng.getPostProcessor();
  post.enablePass('threshold');
  post.enablePass('feedback');
  post.enablePass('scanline');
}

/** Procedural motion when video source sampling is off. */
function applyStandaloneVisualizerPipeline(eng: AsciiEngine): void {
  eng.setSourceMode('procedural');
  for (const id of ['noise', 'wave', 'trails'] as const) {
    if (eng.getPluginManager().get(id)) {
      eng.enablePlugin(id);
    }
  }
}

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
  let lastVideoInput: VisualEngineVideoInput | null = null;
  let lastAsciiColor: string | null = null;
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

  function reapplyAsciiColor(): void {
    if (!lastAsciiColor) return;
    const eng = engine;
    if (!eng) return;
    eng.setColor(lastAsciiColor);
  }

  function getVideoSourceHandle(): {
    play(): Promise<void>;
    pause(): Promise<void>;
    isPlaying(): boolean;
  } | null {
    const eng = engine;
    if (!eng) return null;
    const source = eng.getSourceManager().getSource('video');
    if (!source || source.type !== 'video') return null;
    const candidate = source as unknown as {
      play?(): void;
      pause?(): void;
      isPlaying?(): boolean;
    };
    if (
      typeof candidate.play !== 'function' ||
      typeof candidate.pause !== 'function' ||
      typeof candidate.isPlaying !== 'function'
    ) {
      return null;
    }
    return candidate as {
      play(): Promise<void>;
      pause(): Promise<void>;
      isPlaying(): boolean;
    };
  }

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
        reapplyAsciiColor();
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

    async setControl(name: string, value: number): Promise<void> {
      const eng = requireEngine();
      try {
        eng.setControl(name, value);
        parameterSnapshot[name] = value;
        emit('visual:parameter-change', { name, value });
      } catch (error) {
        reportError('setControl', error);
        throw error;
      }
    },

    setControlSync(name: string, value: number): void {
      const eng = engine;
      if (!eng) return;
      try {
        eng.setControl(name, value);
        parameterSnapshot[name] = value;
      } catch (error) {
        reportError('setControlSync', error);
      }
    },

    async setAsciiColor(color: string): Promise<void> {
      const eng = requireEngine();
      try {
        lastAsciiColor = color;
        eng.setColor(color);
        emit('visual:color-change', { color });
      } catch (error) {
        reportError('setAsciiColor', error);
        throw error;
      }
    },

    async setGlyphSet(glyphs: string[]): Promise<void> {
      const eng = requireEngine();
      try {
        applyEngineGlyphSet(eng, glyphs);
        emit('visual:glyph-set', { count: glyphs.length });
      } catch (error) {
        reportError('setGlyphSet', error);
        throw error;
      }
    },

    async setBassGlyphScale(level: number): Promise<void> {
      const eng = requireEngine();
      try {
        applyEngineBassGlyphScale(eng, level);
      } catch (error) {
        reportError('setBassGlyphScale', error);
        throw error;
      }
    },

    async setSourceMode(mode: 'procedural' | 'source'): Promise<void> {
      const eng = requireEngine();
      try {
        eng.setSourceMode(mode);
        emit('visual:source-mode', { mode });
      } catch (error) {
        reportError('setSourceMode', error);
        throw error;
      }
    },

    async prepareVideoAsciiPipeline(): Promise<void> {
      const eng = requireEngine();
      try {
        // Do NOT call setPreset here — it resets source mode to procedural and
        // clears the active video source. Only strip layers that overwrite sampling.
        applyVideoSamplingPipeline(eng);

        emit('visual:video-pipeline-ready', { presetId: currentPresetId });
        reapplyAsciiColor();
      } catch (error) {
        reportError('prepareVideoAsciiPipeline', error);
        throw error;
      }
    },

    async setVideoBackgroundEnabled(enabled: boolean): Promise<void> {
      const eng = requireEngine();
      try {
        if (enabled) {
          applyVideoSamplingPipeline(eng);
          eng.setSourceMode('source');
          eng.setActiveSource('video');
          const handle = getVideoSourceHandle();
          if (handle) {
            await handle.play();
          }
        } else {
          applyStandaloneVisualizerPipeline(eng);
        }
        emit('visual:video-background', { enabled });
        reapplyAsciiColor();
      } catch (error) {
        reportError('setVideoBackgroundEnabled', error);
        throw error;
      }
    },

    async loadVideoSource(input: VisualEngineVideoInput): Promise<void> {
      const eng = requireEngine();
      try {
        lastVideoInput = input;
        eng.setSourceMode('source');
        eng.setActiveSource('video');

        if (typeof input === 'object' && input.element instanceof HTMLVideoElement) {
          await eng.loadSource('video', input.element);
        } else {
          const payload =
            typeof input === 'string'
              ? { src: input, loop: true, muted: true, autoplay: true }
              : { loop: true, muted: true, autoplay: true, ...input };
          await eng.loadSource('video', payload);
        }

        const debug = eng.getDebugState().source;
        const srcLabel =
          typeof input === 'string'
            ? input
            : input.element
              ? 'video-element'
              : (input.src ?? '');
        emit('visual:source-loaded', {
          type: 'video',
          src: srcLabel,
          ready: debug.ready,
        });
        if (debug.error) {
          reportError('loadVideoSource', new Error(debug.error));
        }
        reapplyAsciiColor();
      } catch (error) {
        reportError('loadVideoSource', error);
        throw error;
      }
    },

    async playVideo(): Promise<void> {
      const eng = requireEngine();
      try {
        eng.setSourceMode('source');
        eng.setActiveSource('video');
        const handle = getVideoSourceHandle();
        if (!handle) {
          throw new Error('No video source loaded');
        }
        await handle.play();
        if (!playing) {
          eng.start();
          playing = true;
        }
        emit('visual:video-play', {});
      } catch (error) {
        reportError('playVideo', error);
        throw error;
      }
    },

    async pauseVideo(): Promise<void> {
      try {
        const handle = getVideoSourceHandle();
        if (!handle) return;
        await handle.pause();
        emit('visual:video-pause', {});
      } catch (error) {
        reportError('pauseVideo', error);
        throw error;
      }
    },

    async restartVideo(): Promise<void> {
      if (!lastVideoInput) return;
      try {
        await adapter.pauseVideo();
        if (typeof lastVideoInput === 'object' && lastVideoInput.element instanceof HTMLVideoElement) {
          lastVideoInput.element.currentTime = 0;
          await adapter.playVideo();
        } else {
          await adapter.loadVideoSource(lastVideoInput);
          await adapter.playVideo();
        }
        emit('visual:video-restart', {});
      } catch (error) {
        reportError('restartVideo', error);
        throw error;
      }
    },

    getVideoStatus(): VisualEngineVideoStatus {
      const eng = engine;
      if (!eng) {
        return {
          sourceMode: 'procedural',
          activeSourceId: null,
          ready: false,
          playing: false,
          error: lastError,
          width: 0,
          height: 0,
        };
      }
      const debug = eng.getDebugState().source;
      const video = getVideoSourceHandle();
      return {
        sourceMode: eng.getSourceMode(),
        activeSourceId: debug.activeSourceId,
        ready: debug.ready,
        playing: video?.isPlaying() ?? false,
        error: debug.error,
        width: debug.width,
        height: debug.height,
      };
    },

    startFrameCapture(frameRate = 30): { ok: boolean; error?: string } {
      try {
        const eng = requireEngine();
        return eng.startRecording(frameRate);
      } catch (error) {
        reportError('startFrameCapture', error);
        return {
          ok: false,
          error: error instanceof Error ? error.message : String(error),
        };
      }
    },

    async stopFrameCapture(): Promise<void> {
      try {
        requireEngine().stopRecording();
      } catch (error) {
        reportError('stopFrameCapture', error);
        throw error;
      }
    },

    cancelFrameCapture(): void {
      try {
        requireEngine().cancelRecording();
      } catch (error) {
        reportError('cancelFrameCapture', error);
      }
    },

    getFrameCaptureStatus(): VisualEngineFrameCaptureStatus {
      const eng = engine;
      if (!eng) {
        return { state: 'idle', frameCount: 0, duration: 0, frameRate: 30 };
      }
      return eng.getExportManager().getDebugState().recording;
    },

    async exportCapturedGif(
      options: VisualEngineGifExportOptions = {},
    ): Promise<VisualEngineExportResult> {
      try {
        const result = await requireEngine().exportGIF(options);
        return {
          ok: result.ok,
          format: result.format,
          blob: result.blob,
          filename: result.filename,
          error: result.error,
        };
      } catch (error) {
        reportError('exportCapturedGif', error);
        return {
          ok: false,
          format: 'gif',
          error: error instanceof Error ? error.message : String(error),
        };
      }
    },

    getCaptureCanvas(): HTMLCanvasElement | null {
      try {
        return requireEngine().getCanvas() ?? null;
      } catch {
        return canvas;
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

    getTransmissionDiagnostics(): {
      cols: number;
      rows: number;
      glyphCount: number;
      renderTimeMs: number;
      rendererId: string;
    } | null {
      const eng = engine;
      if (!eng) return null;
      try {
        const dims = eng.getRendererManager().getDimensions();
        const perf = eng.getDebugState().performance;
        return {
          cols: dims.cols,
          rows: dims.rows,
          glyphCount: dims.cols * dims.rows,
          renderTimeMs: perf.renderTimeMs,
          rendererId: eng.getActiveRendererId() ?? 'canvas',
        };
      } catch {
        return null;
      }
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
