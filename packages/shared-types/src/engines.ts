import type { Preset } from './presets.js';
import type { AudioFeaturesSnapshot } from './audioReactive.js';

/**
 * Base contract for engine adapters registered with the platform.
 * Adapters wrap external engine packages without importing their internals into the SDK.
 */
export interface EngineAdapter {
  /** Unique adapter identifier, e.g. 'sound', 'visual' */
  readonly id: string;
  /** Engine package name for diagnostics */
  readonly engineName: string;
  /** Whether the adapter has completed initialization */
  readonly isReady: boolean;
  /** Initialize the engine (placeholder — real adapters delegate to engine packages) */
  initialize(): Promise<void>;
  /** Tear down the engine and release resources */
  dispose(): Promise<void>;
}

/**
 * Adapter contract for the Plantasia Sound Engine.
 * The platform orchestrates audio; the Sound Engine owns all audio logic.
 */
export interface SoundEngineStatus {
  /** Engine instance created via init() */
  initialized: boolean;
  /** Audio context unlocked (requires user gesture) */
  audioReady: boolean;
  /** Whether generative playback is active */
  playing: boolean;
  /** Raw engine lifecycle state from plantasia-sound-engine */
  engineState: string;
  /** Active species id, if loaded */
  currentSpecies: string | null;
  /** Last loaded preset id */
  currentPresetId: string | null;
  /** Current audio level (0–1) */
  level: number;
  /** Last error message, if any */
  lastError: string | null;
}

export interface SoundEngineAdapter extends EngineAdapter {
  readonly id: 'sound';
  /** Create engine instance (no audio context unlock) */
  init(): Promise<void>;
  /** Start playback — unlocks audio on first call (user gesture required) */
  start(): Promise<void>;
  /** Stop playback */
  stop(): Promise<void>;
  /** Load and apply a preset by platform Preset or preset id */
  playPreset(preset: Preset | string): Promise<void>;
  /** Update an engine parameter (ecological control name or tempo) */
  updateParameter(name: string, value: number): Promise<void>;
  /** Current adapter and engine status */
  getStatus(): SoundEngineStatus;
  /** Platform-layer audio feature snapshot for reactive bridge */
  getAudioFeatures(): AudioFeaturesSnapshot;
  /** Last written parameter values for project persistence */
  getParameterSnapshot(): Readonly<Record<string, number>>;
  /** Trigger a note (performance control layer) */
  noteOn(note: string, velocity?: number): void;
  /** Release a note */
  noteOff(note: string): void;
  /** Release engine resources */
  dispose(): Promise<void>;
}

/**
 * Adapter contract for the Plantasia Visual Engine (npm: ascii-visual-engine).
 * The platform orchestrates rendering; the Visual Engine owns all visual logic.
 */
export interface VisualEngineStatus {
  /** Engine wrapper created via init() */
  initialized: boolean;
  /** Canvas mounted into the stage region */
  mounted: boolean;
  /** Render loop active */
  playing: boolean;
  /** Human-readable engine state */
  engineState: string;
  /** Active visual preset id */
  currentPresetId: string | null;
  /** Current render width (px) */
  width: number;
  /** Current render height (px) */
  height: number;
  /** Last measured FPS from the engine */
  fps: number;
  /** Last error message, if any */
  lastError: string | null;
}

/** Target element for mounting the visual engine canvas */
export interface VisualEngineMountTarget {
  element: HTMLElement;
}

/** Video source input for ascii-visual-engine VideoSource */
export type VisualEngineVideoInput =
  | string
  | {
      src?: string;
      /** Pre-created video element (e.g. canvas captureStream fallback) */
      element?: HTMLVideoElement;
      loop?: boolean;
      muted?: boolean;
      autoplay?: boolean;
      fitMode?: 'fit' | 'fill' | 'stretch' | 'center';
    };

/** Status of the active video source pipeline */
export interface VisualEngineVideoStatus {
  sourceMode: 'procedural' | 'source';
  activeSourceId: string | null;
  ready: boolean;
  playing: boolean;
  error: string | null;
  width: number;
  height: number;
}

/** Frame capture / GIF export status from ascii-visual-engine */
export interface VisualEngineFrameCaptureStatus {
  state: 'idle' | 'recording' | 'paused' | 'stopped';
  frameCount: number;
  duration: number;
  frameRate: number;
}

/** Options for GIF export from captured engine frames */
export interface VisualEngineGifExportOptions {
  frameRate?: number;
  loop?: boolean;
  transparent?: boolean;
  width?: number;
  height?: number;
  filename?: string;
}

export interface VisualEngineExportResult {
  ok: boolean;
  format: 'gif' | 'png' | 'svg' | 'ascii' | 'json' | 'sequence' | 'mp4' | 'webm' | 'pdf';
  blob?: Blob;
  filename?: string;
  error?: string;
}

export interface VisualEngineAdapter extends EngineAdapter {
  readonly id: 'visual';
  /** Prepare adapter (does not mount canvas) */
  init(): Promise<void>;
  /** Mount canvas and create engine instance in the stage region */
  mount(target: VisualEngineMountTarget): Promise<void>;
  /** Unmount canvas and stop render loop */
  unmount(): Promise<void>;
  /** Start the render loop */
  start(): Promise<void>;
  /** Stop the render loop */
  stop(): Promise<void>;
  /** Apply a visual preset by platform Preset or preset id */
  setPreset(preset: Preset | string): Promise<void>;
  /** Update a visual engine control (0–1 normalized) */
  updateParameter(name: string, value: number): Promise<void>;
  /** Set an engine control without clamping (source/post controls) */
  setControl(name: string, value: number): Promise<void>;
  /** Set ASCII glyph render color (hex or css color string) */
  setAsciiColor(color: string): Promise<void>;
  /** Set active glyph characters (emoji / symbol set) */
  setGlyphSet(glyphs: string[]): Promise<void>;
  /** Drive per-glyph random scale from bass level (0–1) */
  setBassGlyphScale(level: number): Promise<void>;
  /** Switch between procedural motion and external source sampling */
  setSourceMode(mode: 'procedural' | 'source'): Promise<void>;
  /** Load a video into the built-in VideoSource and activate source mode */
  loadVideoSource(input: VisualEngineVideoInput): Promise<void>;
  /** Minimal preset + disable pattern/motion layers that overwrite source sampling */
  prepareVideoAsciiPipeline(): Promise<void>;
  /** Toggle video-to-ASCII sampling vs standalone procedural visualizer */
  setVideoBackgroundEnabled(enabled: boolean): Promise<void>;
  playVideo(): Promise<void>;
  pauseVideo(): Promise<void>;
  restartVideo(): Promise<void>;
  getVideoStatus(): VisualEngineVideoStatus;
  /** Begin capturing rendered engine frames (non-blocking; hooks render loop) */
  startFrameCapture(frameRate?: number): { ok: boolean; error?: string };
  /** Stop capture and wait for pending frame blobs */
  stopFrameCapture(): Promise<void>;
  cancelFrameCapture(): void;
  getFrameCaptureStatus(): VisualEngineFrameCaptureStatus;
  /** Export captured frames as GIF from engine canvas output */
  exportCapturedGif(options?: VisualEngineGifExportOptions): Promise<VisualEngineExportResult>;
  /** Engine stage canvas used for frame capture */
  getCaptureCanvas(): HTMLCanvasElement | null;
  /** Respond to container dimension changes */
  resize(width: number, height: number): void;
  /** Current adapter and engine status */
  getStatus(): VisualEngineStatus;
  /** Last written control values for project persistence */
  getParameterSnapshot(): Readonly<Record<string, number>>;
  /** Release all resources */
  dispose(): Promise<void>;
  /** Synchronous control write for live slider drag (no await / microtask delay) */
  setControlSync(name: string, value: number): void;
  /** Live decoder diagnostics for debug overlay */
  getTransmissionDiagnostics(): {
    cols: number;
    rows: number;
    glyphCount: number;
    renderTimeMs: number;
    rendererId: string;
  } | null;
}

/** Map of registered engine adapters keyed by adapter id */
export type EngineAdapterRegistry = Map<string, EngineAdapter>;
