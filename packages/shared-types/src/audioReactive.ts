import type { SoundEngineAdapter, VisualEngineAdapter } from './engines.js';

/** Frequency band derived from audio analysis */
export type AudioBand = 'bass' | 'mids' | 'highs';

/** Scalar audio feature used for reactive mapping */
export type AudioFeature = AudioBand | 'amplitude' | 'transient';

/** Visual parameter target (platform vocabulary) */
export type VisualTarget = 'density' | 'motion' | 'brightness' | 'scale' | 'glitch';

/** Normalized mapping strength (0–1) */
export type MappingAmount = number;

/** Snapshot of analyzed audio features at a point in time */
export interface AudioFeaturesSnapshot {
  amplitude: number;
  bass: number;
  mids: number;
  highs: number;
  transient: number;
  timestamp: number;
}

/** One feature → target mapping entry */
export interface AudioReactiveMapping {
  feature: AudioFeature;
  target: VisualTarget;
  amount: MappingAmount;
  enabled?: boolean;
}

/** Bridge configuration */
export interface AudioReactiveBridgeConfig {
  enabled: boolean;
  sensitivity: number;
  smoothing: number;
  mappings: AudioReactiveMapping[];
}

/** Runtime bridge status for diagnostics and UI */
export interface AudioReactiveBridgeStatus {
  initialized: boolean;
  connected: boolean;
  running: boolean;
  enabled: boolean;
  sensitivity: number;
  smoothing: number;
  mappings: AudioReactiveMapping[];
  lastFeatures: AudioFeaturesSnapshot | null;
  lastError: string | null;
  framesProcessed: number;
}

/** Platform contract for the audio reactive bridge */
export interface AudioReactiveBridge {
  init(): Promise<void>;
  start(): Promise<void>;
  stop(): Promise<void>;
  connect(sound: SoundEngineAdapter, visual: VisualEngineAdapter): void;
  disconnect(): void;
  updateMapping(config: Partial<AudioReactiveBridgeConfig>): void;
  getStatus(): AudioReactiveBridgeStatus;
  dispose(): Promise<void>;
}
