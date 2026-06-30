import type {
  AudioReactiveBridge,
  PerformanceControlManager,
  PerformanceControlStatus,
  ControlMapping,
  ControlTarget,
  ControlValue,
  LearnModeState,
  MIDIMessage,
  PresetBundleRegistry,
  SoundEngineAdapter,
  VisualEngineAdapter,
  PlatformEventBus,
} from '@plantasonic/platform-types';

/** Routing targets for performance control messages */
export interface PerformanceControlContext {
  sound?: SoundEngineAdapter;
  visual?: VisualEngineAdapter;
  bridge?: AudioReactiveBridge;
  presetBundles?: PresetBundleRegistry;
  onTransportPlay?: () => void | Promise<void>;
  onTransportStop?: () => void | Promise<void>;
  onTransportToggle?: () => void | Promise<void>;
  onWorkspaceAction?: (action: string, value?: ControlValue) => void | Promise<void>;
  onUIAction?: (action: string, value?: ControlValue) => void | Promise<void>;
}

export interface CreatePerformanceControlManagerOptions {
  eventBus: PlatformEventBus;
  source?: string;
  context?: PerformanceControlContext;
  mappings?: ControlMapping[];
}

/** Default demo-oriented control mappings */
export const DEFAULT_PERFORMANCE_MAPPINGS: ControlMapping[] = [
  { id: 'kb-a', source: 'keyboard-key', sourceValue: 'KeyA', target: 'sound-note', targetId: 'C4', enabled: true },
  { id: 'kb-s', source: 'keyboard-key', sourceValue: 'KeyS', target: 'sound-note', targetId: 'D4', enabled: true },
  { id: 'kb-d', source: 'keyboard-key', sourceValue: 'KeyD', target: 'sound-note', targetId: 'E4', enabled: true },
  { id: 'kb-f', source: 'keyboard-key', sourceValue: 'KeyF', target: 'sound-note', targetId: 'F4', enabled: true },
  { id: 'kb-g', source: 'keyboard-key', sourceValue: 'KeyG', target: 'sound-note', targetId: 'G4', enabled: true },
  { id: 'kb-space', source: 'keyboard-key', sourceValue: 'Space', target: 'transport-toggle', targetId: 'play', enabled: true },
  { id: 'kb-esc', source: 'keyboard-key', sourceValue: 'Escape', target: 'transport-stop', targetId: 'stop', enabled: true },
  { id: 'kb-1', source: 'keyboard-key', sourceValue: 'Digit1', target: 'preset-bundle', targetId: 'seed', enabled: true },
  { id: 'kb-2', source: 'keyboard-key', sourceValue: 'Digit2', target: 'preset-bundle', targetId: 'root', enabled: true },
  { id: 'kb-3', source: 'keyboard-key', sourceValue: 'Digit3', target: 'preset-bundle', targetId: 'bloom', enabled: true },
  { id: 'kb-4', source: 'keyboard-key', sourceValue: 'Digit4', target: 'preset-bundle', targetId: 'mycelium', enabled: true },
  { id: 'kb-5', source: 'keyboard-key', sourceValue: 'Digit5', target: 'preset-bundle', targetId: 'mutation', enabled: true },
  { id: 'midi-cc1', source: 'midi-cc', sourceValue: 1, target: 'sound-parameter', targetId: 'growth', enabled: true },
  { id: 'midi-cc2', source: 'midi-cc', sourceValue: 2, target: 'visual-parameter', targetId: 'density', enabled: true },
  { id: 'midi-cc3', source: 'midi-cc', sourceValue: 3, target: 'bridge-mapping', targetId: 'bass', enabled: true },
  { id: 'midi-cc9', source: 'midi-cc', sourceValue: 9, target: 'bridge-enabled', targetId: 'toggle', enabled: true },
  { id: 'pad-36', source: 'midi-pad', sourceValue: 36, target: 'preset-bundle', targetId: 'seed', enabled: true },
  { id: 'pad-37', source: 'midi-pad', sourceValue: 37, target: 'preset-bundle', targetId: 'root', enabled: true },
  { id: 'pad-38', source: 'midi-pad', sourceValue: 38, target: 'preset-bundle', targetId: 'bloom', enabled: true },
  { id: 'pad-39', source: 'midi-pad', sourceValue: 39, target: 'preset-bundle', targetId: 'mycelium', enabled: true },
  { id: 'pad-40', source: 'midi-pad', sourceValue: 40, target: 'preset-bundle', targetId: 'mutation', enabled: true },
  { id: 'midi-start', source: 'midi-transport', sourceValue: 'start', target: 'transport-play', targetId: 'play', enabled: true },
  { id: 'midi-stop', source: 'midi-transport', sourceValue: 'stop', target: 'transport-stop', targetId: 'stop', enabled: true },
];

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/**
 * Platform-level performance control manager.
 * Routes Web MIDI and keyboard input to adapters without engine coupling.
 */
export function createPerformanceControlManager(
  options: CreatePerformanceControlManagerOptions,
): PerformanceControlManagerWithContext {
  const { eventBus, source = 'performance-controls' } = options;

  let initialized = false;
  let running = false;
  let performanceModeEnabled = false;
  let context: PerformanceControlContext = options.context ?? {};
  let mappings: ControlMapping[] = (options.mappings ?? DEFAULT_PERFORMANCE_MAPPINGS).map(
    (mapping) => ({ ...mapping }),
  );
  let lastError: string | null = null;

  let midiAccess: MIDIAccess | null = null;
  const midiHandlers = new Map<MIDIInput, (event: MIDIMessageEvent) => void>();
  const activeMidiNotes = new Set<number>();
  const activeKeys = new Set<string>();
  const activeKeyboardNotes = new Set<string>();

  let learnMode: LearnModeState = {
    active: false,
    waitingForSource: false,
  };

  let lastMidiMessage: MIDIMessage | null = null;
  let onKeyDown: ((event: KeyboardEvent) => void) | null = null;
  let onKeyUp: ((event: KeyboardEvent) => void) | null = null;

  const midiSupported =
    typeof navigator !== 'undefined' && typeof navigator.requestMIDIAccess === 'function';

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
    emit('performance:error', { operation, message });
    console.warn(`[platform:performance] ${operation}:`, message);
  };

  const manager: PerformanceControlManagerWithContext = {
    async init(): Promise<void> {
      if (initialized) return;
      initialized = true;
      emit('performance:init', { midiSupported, keyboardFallback: true });
    },

    setContext(next: PerformanceControlContext): void {
      context = { ...context, ...next };
    },

    async requestMIDIAccess(): Promise<boolean> {
      if (!midiSupported) {
        reportError('requestMIDIAccess', 'Web MIDI not supported in this browser');
        return false;
      }
      try {
        midiAccess = await navigator.requestMIDIAccess({ sysex: false });
        attachMidiInputs();
        midiAccess.onstatechange = () => {
          attachMidiInputs();
          emitMidiConnection();
        };
        emitMidiConnection();
        return true;
      } catch (error) {
        reportError('requestMIDIAccess', error);
        return false;
      }
    },

    enablePerformanceMode(enabled: boolean): void {
      performanceModeEnabled = enabled;
      if (enabled && running) {
        attachKeyboard();
      } else {
        detachKeyboard();
      }
    },

    updateMappings(next: ControlMapping[]): void {
      mappings = next.map((mapping) => ({ ...mapping }));
      emit('performance:mapping-change', { count: mappings.length });
    },

    startLearnMode(target: ControlTarget, targetId: string): void {
      learnMode = {
        active: true,
        waitingForSource: true,
        pendingTarget: target,
        pendingTargetId: targetId,
      };
    },

    stopLearnMode(): void {
      learnMode = { active: false, waitingForSource: false };
    },

    async start(): Promise<void> {
      if (running) return;
      running = true;
      if (performanceModeEnabled) {
        attachKeyboard();
      }
    },

    async stop(): Promise<void> {
      running = false;
      detachKeyboard();
      activeKeys.clear();
      activeKeyboardNotes.clear();
      for (const note of activeMidiNotes) {
        await routeNoteOff(note);
      }
      activeMidiNotes.clear();
    },

    getStatus(): PerformanceControlStatus {
      return {
        initialized,
        running,
        performanceModeEnabled,
        midi: {
          supported: midiSupported,
          connected: midiAccess !== null && getMidiDeviceNames().length > 0,
          deviceNames: getMidiDeviceNames(),
          activeNotes: [...activeMidiNotes],
          lastMessage: lastMidiMessage,
        },
        keyboard: {
          enabled: performanceModeEnabled && running,
          activeKeys: [...activeKeys],
          activeNotes: [...activeKeyboardNotes],
        },
        learnMode: { ...learnMode },
        mappings: mappings.map((mapping) => ({ ...mapping })),
        lastError,
      };
    },

    async dispose(): Promise<void> {
      await manager.stop();
      detachMidiInputs();
      midiAccess = null;
      initialized = false;
      learnMode = { active: false, waitingForSource: false };
    },
  };

  function getMidiDeviceNames(): string[] {
    if (!midiAccess) return [];
    return [...midiAccess.inputs.values()].map((input) => input.name ?? input.id);
  }

  function emitMidiConnection(): void {
    const names = getMidiDeviceNames();
    if (names.length > 0) {
      emit('performance:midi-connected', { devices: names });
    } else {
      emit('performance:midi-disconnected', {});
    }
  }

  function attachMidiInputs(): void {
    if (!midiAccess) return;
    detachMidiInputs();
    for (const input of midiAccess.inputs.values()) {
      const handler = (event: MIDIMessageEvent): void => {
        void handleMidiEvent(event);
      };
      input.addEventListener('midimessage', handler);
      midiHandlers.set(input, handler);
    }
  }

  function detachMidiInputs(): void {
    for (const [input, handler] of midiHandlers) {
      input.removeEventListener('midimessage', handler);
    }
    midiHandlers.clear();
  }

  function attachKeyboard(): void {
    if (typeof window === 'undefined' || onKeyDown) return;
    onKeyDown = (event: KeyboardEvent): void => {
      if (!performanceModeEnabled || !running) return;
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }
      void handleKeyboardEvent(event, true);
    };
    onKeyUp = (event: KeyboardEvent): void => {
      if (!performanceModeEnabled || !running) return;
      void handleKeyboardEvent(event, false);
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
  }

  function detachKeyboard(): void {
    if (typeof window === 'undefined' || !onKeyDown || !onKeyUp) return;
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    onKeyDown = null;
    onKeyUp = null;
  }

  async function handleMidiEvent(event: MIDIMessageEvent): Promise<void> {
    const data = event.data;
    if (!data || data.length === 0) return;

    const message = parseMidiMessage(data);
    lastMidiMessage = message;

    if (learnMode.waitingForSource) {
      handleLearnCapture('midi', message);
      return;
    }

    if (message.type === 'noteOn' && message.note !== undefined && message.velocity !== undefined) {
      if (message.velocity === 0) {
        await handleNoteOff(message.note);
        return;
      }
      emit('performance:note-on', { note: message.note, velocity: message.velocity });
      await handleNoteOn(message.note, message.velocity);
      return;
    }

    if (message.type === 'noteOff' && message.note !== undefined) {
      emit('performance:note-off', { note: message.note });
      await handleNoteOff(message.note);
      return;
    }

    if (message.type === 'controlChange' && message.controller !== undefined) {
      emit('performance:control-change', {
        controller: message.controller,
        value: message.value,
      });
      await handleControlChange(message.controller, message.value ?? 0);
    }
  }

  async function handleKeyboardEvent(event: KeyboardEvent, pressed: boolean): Promise<void> {
    const code = event.code;

    if (learnMode.waitingForSource && pressed) {
      handleLearnCapture('keyboard', code);
      return;
    }

    if (pressed) {
      if (activeKeys.has(code)) return;
      activeKeys.add(code);
      event.preventDefault();

      const mapping = findMapping('keyboard-key', code);
      if (mapping) {
        await routeMapping(mapping, 1, true);
        return;
      }
    } else {
      activeKeys.delete(code);
      const mapping = findMapping('keyboard-key', code);
      if (mapping?.target === 'sound-note') {
        context.sound?.noteOff(mapping.targetId);
        activeKeyboardNotes.delete(mapping.targetId);
      }
    }
  }

  function handleLearnCapture(source: 'midi' | 'keyboard', value: MIDIMessage | string): void {
    if (!learnMode.pendingTarget || !learnMode.pendingTargetId) return;
    const id = `learned-${Date.now()}`;
    if (source === 'keyboard' && typeof value === 'string') {
      mappings.push({
        id,
        source: 'keyboard-key',
        sourceValue: value,
        target: learnMode.pendingTarget,
        targetId: learnMode.pendingTargetId,
        enabled: true,
      });
    } else if (source === 'midi' && typeof value !== 'string') {
      const msg = value;
      if (msg.type === 'controlChange' && msg.controller !== undefined) {
        mappings.push({
          id,
          source: 'midi-cc',
          sourceValue: msg.controller,
          target: learnMode.pendingTarget,
          targetId: learnMode.pendingTargetId,
          enabled: true,
        });
      } else if (msg.note !== undefined) {
        mappings.push({
          id,
          source: 'midi-note',
          sourceValue: msg.note,
          target: learnMode.pendingTarget,
          targetId: learnMode.pendingTargetId,
          enabled: true,
        });
      }
    }
    emit('performance:mapping-change', { learned: true });
    manager.stopLearnMode();
  }

  async function handleNoteOn(note: number, velocity: number): Promise<void> {
    activeMidiNotes.add(note);

    const padMapping = findMapping('midi-pad', note);
    if (padMapping) {
      await routeMapping(padMapping, velocity / 127, true);
      return;
    }

    const noteMapping = findMapping('midi-note', note);
    if (noteMapping) {
      await routeMapping(noteMapping, velocity / 127, true);
      return;
    }

    await routeNoteOn(midiNoteToName(note), velocity / 127);
    await bumpVisualForNote(velocity / 127);
  }

  async function handleNoteOff(note: number): Promise<void> {
    activeMidiNotes.delete(note);
    const mapping = findMapping('midi-note', note) ?? findMapping('midi-pad', note);
    if (mapping?.target === 'sound-note') {
      context.sound?.noteOff(mapping.targetId);
      return;
    }
    await routeNoteOff(note);
  }

  async function handleControlChange(controller: number, value: number): Promise<void> {
    const normalized = value / 127;
    const mapping = findMapping('midi-cc', controller);
    if (mapping) {
      await routeMapping(mapping, normalized, true);
      return;
    }

    if (controller === 250) {
      await routeTransport('play');
    } else if (controller === 252) {
      await routeTransport('stop');
    }
  }

  async function routeMapping(
    mapping: ControlMapping,
    value: ControlValue,
    pressed: boolean,
  ): Promise<void> {
    if (mapping.enabled === false) return;

    switch (mapping.target) {
      case 'sound-note':
        if (pressed) {
          const vel = typeof value === 'number' ? value : 0.8;
          context.sound?.noteOn(mapping.targetId, vel);
          activeKeyboardNotes.add(mapping.targetId);
          await bumpVisualForNote(typeof value === 'number' ? value : 0.8);
        } else {
          context.sound?.noteOff(mapping.targetId);
          activeKeyboardNotes.delete(mapping.targetId);
        }
        break;
      case 'sound-parameter':
        if (typeof value === 'number') {
          await context.sound?.updateParameter(mapping.targetId, value);
        }
        break;
      case 'visual-parameter':
        if (typeof value === 'number') {
          await context.visual?.updateParameter(mapping.targetId, value);
        }
        break;
      case 'preset-bundle':
        if (pressed) {
          await context.presetBundles?.applyBundle(mapping.targetId);
        }
        break;
      case 'bridge-mapping':
        if (typeof value === 'number' && context.bridge) {
          const status = context.bridge.getStatus();
          const next = status.mappings.map((entry) =>
            entry.feature === mapping.targetId ? { ...entry, amount: value } : entry,
          );
          context.bridge.updateMapping({ mappings: next });
        }
        break;
      case 'bridge-enabled':
        if (context.bridge) {
          const enabled =
            typeof value === 'number' ? value > 0.5 : typeof value === 'boolean' ? value : true;
          context.bridge.updateMapping({ enabled });
        }
        break;
      case 'transport-play':
        if (pressed) await routeTransport('play');
        break;
      case 'transport-stop':
        if (pressed) await routeTransport('stop');
        break;
      case 'transport-toggle':
        if (pressed) await routeTransport('toggle');
        break;
      case 'workspace-action':
        if (pressed) await context.onWorkspaceAction?.(mapping.targetId, value);
        break;
      case 'ui-action':
        if (pressed) await context.onUIAction?.(mapping.targetId, value);
        break;
      default:
        break;
    }
  }

  async function routeTransport(action: 'play' | 'stop' | 'toggle'): Promise<void> {
    try {
      if (action === 'play') await context.onTransportPlay?.();
      else if (action === 'stop') await context.onTransportStop?.();
      else await context.onTransportToggle?.();
    } catch (error) {
      reportError('transport', error);
    }
  }

  async function routeNoteOn(noteName: string, velocity: number): Promise<void> {
    try {
      context.sound?.noteOn(noteName, velocity);
    } catch (error) {
      reportError('noteOn', error);
    }
  }

  async function routeNoteOff(note: number): Promise<void> {
    try {
      context.sound?.noteOff(midiNoteToName(note));
    } catch (error) {
      reportError('noteOff', error);
    }
  }

  async function bumpVisualForNote(intensity: number): Promise<void> {
    const visual = context.visual;
    if (!visual) return;
    const glitch = Math.min(1, 0.05 + intensity * 0.4);
    await visual.updateParameter('glitchAmount', glitch).catch(() => undefined);
  }

  function findMapping(source: ControlMapping['source'], sourceValue: string | number): ControlMapping | undefined {
    return mappings.find(
      (mapping) =>
        mapping.enabled !== false &&
        mapping.source === source &&
        mapping.sourceValue === sourceValue,
    );
  }

  return manager;
}

export function parseMidiMessage(data: Uint8Array): MIDIMessage {
  const status = data[0] ?? 0;
  const command = status & 0xf0;
  const channel = status & 0x0f;

  if (command === 0x90) {
    return {
      type: 'noteOn',
      channel,
      note: data[1],
      velocity: data[2],
    };
  }
  if (command === 0x80) {
    return {
      type: 'noteOff',
      channel,
      note: data[1],
      velocity: data[2],
    };
  }
  if (command === 0xb0) {
    return {
      type: 'controlChange',
      channel,
      controller: data[1],
      value: data[2],
    };
  }
  return { type: 'unknown' };
}

export function midiNoteToName(note: number): string {
  const octave = Math.floor(note / 12) - 1;
  const name = NOTE_NAMES[note % 12] ?? 'C';
  return `${name}${octave}`;
}

export type PerformanceControlManagerWithContext = PerformanceControlManager & {
  setContext(context: PerformanceControlContext): void;
};
