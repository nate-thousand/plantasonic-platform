/** Normalized control value (0–1 or semantic) */
export type ControlValue = number | boolean | string;

/** Target domain for routed performance controls */
export type ControlTarget =
  | 'sound-note'
  | 'sound-parameter'
  | 'visual-parameter'
  | 'preset-bundle'
  | 'bridge-mapping'
  | 'bridge-enabled'
  | 'transport-play'
  | 'transport-stop'
  | 'transport-toggle'
  | 'workspace-action'
  | 'ui-action';

/** Input source kind for a control mapping */
export type ControlSourceKind =
  | 'keyboard-key'
  | 'midi-note'
  | 'midi-cc'
  | 'midi-pad'
  | 'midi-transport';

/** Maps an input source to a platform control target */
export interface ControlMapping {
  id: string;
  source: ControlSourceKind;
  /** MIDI note/CC number or keyboard `code` (e.g. KeyA) */
  sourceValue: string | number;
  target: ControlTarget;
  /** Parameter name, bundle id, mapping feature id, or action name */
  targetId: string;
  enabled?: boolean;
}

/** Parsed MIDI message (platform layer) */
export interface MIDIMessage {
  type: 'noteOn' | 'noteOff' | 'controlChange' | 'unknown';
  channel?: number;
  note?: number;
  velocity?: number;
  controller?: number;
  value?: number;
}

/** Runtime MIDI input state */
export interface MIDIInputState {
  supported: boolean;
  connected: boolean;
  deviceNames: string[];
  activeNotes: number[];
  lastMessage: MIDIMessage | null;
}

/** Runtime keyboard input state */
export interface KeyboardInputState {
  enabled: boolean;
  activeKeys: string[];
  activeNotes: string[];
}

/** MIDI learn placeholder state */
export interface LearnModeState {
  active: boolean;
  waitingForSource: boolean;
  pendingTarget?: ControlTarget;
  pendingTargetId?: string;
}

/** Manager status snapshot */
export interface PerformanceControlStatus {
  initialized: boolean;
  running: boolean;
  performanceModeEnabled: boolean;
  midi: MIDIInputState;
  keyboard: KeyboardInputState;
  learnMode: LearnModeState;
  mappings: ControlMapping[];
  lastError: string | null;
}

/** Platform contract for performance control routing */
export interface PerformanceControlManager {
  init(): Promise<void>;
  start(): Promise<void>;
  stop(): Promise<void>;
  dispose(): Promise<void>;
  /** Request Web MIDI access — must be called from a user gesture */
  requestMIDIAccess(): Promise<boolean>;
  enablePerformanceMode(enabled: boolean): void;
  updateMappings(mappings: ControlMapping[]): void;
  /** Placeholder — captures next input for mapping assignment */
  startLearnMode(target: ControlTarget, targetId: string): void;
  stopLearnMode(): void;
  getStatus(): PerformanceControlStatus;
}
