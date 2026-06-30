import {
  clampEcologyValue,
  createPlantasiaEngine,
  ECOLOGICAL_CONTROLS,
  presets as enginePresets,
  type PlantasiaEngine,
} from 'plantasia-sound-engine';

import type {
  PlatformEventBus,
  Preset,
  SoundEngineAdapter,
  SoundEngineStatus,
  AudioFeaturesSnapshot,
} from '@plantasonic/platform-types';

import {
  analyzePlaceholderAudioFeatures,
  createPlaceholderAnalyzerState,
  zeroAudioFeatures,
} from './placeholderAudioAnalyzer.js';

/** Options for creating a sound engine adapter */
export interface CreateSoundEngineAdapterOptions {
  eventBus: PlatformEventBus;
  source?: string;
}

/** Preset summary for demo UI */
export interface SoundPresetSummary {
  id: string;
  name: string;
}

const ECOLOGY_SET = new Set<string>(ECOLOGICAL_CONTROLS);

/**
 * Thin compatibility wrapper around plantasia-sound-engine.
 *
 * API mapping notes (engine → adapter):
 * - `init()` maps to `createPlantasiaEngine()` — does NOT unlock audio
 * - `start()` maps to `initialize()` + `loadDefaultSpecies()` + `start()`
 * - `stop()` maps to `allNotesOff()` + `stopSpecies()`
 * - `playPreset()` maps to `loadPreset(presetId)`
 * - `updateParameter()` maps ecological names to `setControl()`, `tempo` to `setTempo()`
 * - `initialize()` (EngineAdapter) delegates to `init()`
 */
export function createSoundEngineAdapter(
  options: CreateSoundEngineAdapterOptions,
): SoundEngineAdapter {
  const { eventBus, source = 'sound-adapter' } = options;

  let engine: PlantasiaEngine | null = null;
  let audioReady = false;
  let playing = false;
  let currentPresetId: string | null = null;
  let lastError: string | null = null;
  const parameterSnapshot: Record<string, number> = {
    growth: 0.5,
    bloom: 0.5,
    roots: 0.5,
    mold: 0.5,
    bacteria: 0.5,
    tempo: 72,
  };
  const analyzerState = createPlaceholderAnalyzerState();

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
    emit('sound:error', { operation, message });
    console.warn(`[platform:sound] ${operation}:`, message);
  };

  const adapter: SoundEngineAdapter = {
    id: 'sound',
    engineName: 'plantasia-sound-engine',
    get isReady(): boolean {
      return engine !== null && audioReady;
    },

    async init(): Promise<void> {
      if (engine) return;
      try {
        engine = createPlantasiaEngine();
        emit('sound:init', { engineName: adapter.engineName });
      } catch (error) {
        reportError('init', error);
        throw error;
      }
    },

    /** EngineAdapter alias — delegates to init() */
    async initialize(): Promise<void> {
      await adapter.init();
    },

    async start(): Promise<void> {
      const eng = requireEngine();
      try {
        if (!audioReady) {
          await eng.initialize();
          audioReady = true;
        }
        if (eng.getCurrentSpecies() === null) {
          await eng.loadDefaultSpecies();
        }
        await eng.start();
        playing = true;
        emit('sound:start', {
          species: eng.getCurrentSpecies()?.id ?? null,
          presetId: currentPresetId,
        });
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
        eng.allNotesOff();
        eng.stopSpecies();
        playing = false;
        emit('sound:stop', { presetId: currentPresetId });
      } catch (error) {
        reportError('stop', error);
      }
    },

    async playPreset(preset: Preset | string): Promise<void> {
      const eng = requireEngine();
      const presetId = typeof preset === 'string' ? preset : preset.id;
      try {
        if (!audioReady) {
          await eng.initialize();
          audioReady = true;
        }
        await eng.loadPreset(presetId);
        currentPresetId = presetId;
        emit('sound:preset-change', { presetId });
        if (playing) {
          await eng.start();
        }
      } catch (error) {
        reportError('playPreset', error);
        throw error;
      }
    },

    async updateParameter(name: string, value: number): Promise<void> {
      const eng = requireEngine();
      try {
        if (name === 'tempo') {
          eng.setTempo(Math.max(20, Math.min(300, value)));
        } else if (ECOLOGY_SET.has(name)) {
          eng.setControl(
            name as (typeof ECOLOGICAL_CONTROLS)[number],
            clampEcologyValue(value),
          );
        } else {
          eng.updateParameter(name, value);
        }
        parameterSnapshot[name] = value;
        emit('sound:parameter-change', { name, value });
      } catch (error) {
        reportError('updateParameter', error);
        throw error;
      }
    },

    getStatus(): SoundEngineStatus {
      const eng = engine;
      return {
        initialized: eng !== null,
        audioReady,
        playing,
        engineState: eng?.getState() ?? 'idle',
        currentSpecies: eng?.getCurrentSpecies()?.id ?? null,
        currentPresetId,
        level: safeLevel(eng),
        lastError,
      };
    },

    getParameterSnapshot(): Readonly<Record<string, number>> {
      return { ...parameterSnapshot };
    },

    getAudioFeatures(): AudioFeaturesSnapshot {
      const eng = engine;
      if (!eng || !audioReady) {
        return zeroAudioFeatures();
      }
      try {
        const level = eng.getLevel();
        const waveform = eng.getWaveform();
        return analyzePlaceholderAudioFeatures(waveform, level, analyzerState);
      } catch {
        return zeroAudioFeatures();
      }
    },

    noteOn(note: string, velocity = 0.8): void {
      const eng = requireEngine();
      try {
        eng.noteOn(note, velocity);
      } catch (error) {
        reportError('noteOn', error);
      }
    },

    noteOff(note: string): void {
      const eng = engine;
      if (!eng) return;
      try {
        eng.noteOff(note);
      } catch (error) {
        reportError('noteOff', error);
      }
    },

    async dispose(): Promise<void> {
      const eng = engine;
      if (!eng) return;
      try {
        eng.dispose();
      } catch (error) {
        reportError('dispose', error);
      } finally {
        engine = null;
        audioReady = false;
        playing = false;
        currentPresetId = null;
      }
    },
  };

  function requireEngine(): PlantasiaEngine {
    if (!engine) {
      throw new Error('Sound engine not initialized — call init() first');
    }
    return engine;
  }

  return adapter;
}

/** List built-in presets from the engine for demo UI */
export function listSoundEnginePresets(): SoundPresetSummary[] {
  return enginePresets.map((preset) => ({
    id: preset.id,
    name: preset.name,
  }));
}

function safeLevel(engine: PlantasiaEngine | null): number {
  if (!engine) return 0;
  try {
    return engine.getLevel();
  } catch {
    return 0;
  }
}
