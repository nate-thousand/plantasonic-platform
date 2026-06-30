/**
 * Creative input layer — applications subscribe to normalized input events
 * instead of re-implementing device plumbing. The manager handles Pointer
 * Events (mouse / touch / pen), keyboard, wheel, and basic pinch/pan gestures.
 *
 * MIDI, gamepad, and pen-pressure backends attach as `InputAdapter`s on the
 * same API (shipped in a later release); apps and adapters emit the same
 * normalized event shapes.
 */

export type InputEventType = 'pointer' | 'key' | 'wheel' | 'gesture' | (string & {});

export type PointerPhase = 'down' | 'move' | 'up' | 'cancel';

export type NormalizedPointer = {
  type: 'pointer';
  phase: PointerPhase;
  x: number;
  y: number;
  buttons: number;
  pointerType: string;
  /** Pen pressure (0..1) when available. */
  pressure: number;
  pointerId: number;
};

export type NormalizedKey = {
  type: 'key';
  phase: 'down' | 'up';
  key: string;
  code: string;
  repeat: boolean;
  mods: { alt: boolean; ctrl: boolean; meta: boolean; shift: boolean };
};

export type NormalizedWheel = {
  type: 'wheel';
  dx: number;
  dy: number;
  x: number;
  y: number;
};

export type NormalizedGesture = {
  type: 'gesture';
  gesture: 'pinch' | 'pan';
  scale: number;
  dx: number;
  dy: number;
};

export type NormalizedInput = NormalizedPointer | NormalizedKey | NormalizedWheel | NormalizedGesture;

export type InputHandler<E = NormalizedInput> = (event: E) => void;

/**
 * Device backend contract. `attach` receives an `emit` callback and returns a
 * cleanup function. Implement this for MIDI / gamepad / pen backends.
 */
export type InputAdapter = {
  name: string;
  attach: (emit: (type: InputEventType, payload: unknown) => void) => () => void;
};

export type InputManager = {
  /** Attach DOM listeners to a target (element / window). Idempotent per target. */
  attach: (target: EventTarget) => InputManager;
  /** Subscribe to a normalized event type. Returns an unsubscribe function. */
  on: (type: InputEventType, handler: InputHandler<any>) => () => void;
  /** Manually emit a normalized event (used by adapters). */
  emit: (type: InputEventType, payload: unknown) => void;
  /** Register a device adapter (MIDI/gamepad/pen). Returns a detach function. */
  registerAdapter: (adapter: InputAdapter) => () => void;
  /** Detach all listeners and adapters. */
  destroy: () => void;
};

export function createInputManager(): InputManager {
  const handlers = new Map<InputEventType, Set<InputHandler<any>>>();
  const cleanups: Array<() => void> = [];
  const adapters = new Map<string, () => void>();

  // Gesture tracking for two-pointer pinch/pan.
  const activePointers = new Map<number, { x: number; y: number }>();
  let lastPinchDistance = 0;

  const emit = (type: InputEventType, payload: unknown) => {
    const set = handlers.get(type);
    if (!set) return;
    for (const handler of set) handler(payload as NormalizedInput);
  };

  const manager: InputManager = {
    attach(target) {
      if (!target || typeof target.addEventListener !== 'function') return manager;

      const onPointer = (phase: PointerPhase) => (event: Event) => {
        const pe = event as PointerEvent;
        if (phase === 'down') activePointers.set(pe.pointerId, { x: pe.clientX, y: pe.clientY });
        else if (phase === 'move' && activePointers.has(pe.pointerId)) activePointers.set(pe.pointerId, { x: pe.clientX, y: pe.clientY });

        emit('pointer', {
          type: 'pointer',
          phase,
          x: pe.clientX,
          y: pe.clientY,
          buttons: pe.buttons,
          pointerType: pe.pointerType ?? 'mouse',
          pressure: typeof pe.pressure === 'number' ? pe.pressure : 0,
          pointerId: pe.pointerId,
        } satisfies NormalizedPointer);

        // Two-pointer pinch/pan gesture.
        if (activePointers.size === 2) {
          const pts = [...activePointers.values()];
          const a = pts[0];
          const b = pts[1];
          if (a && b) {
            const dist = Math.hypot(a.x - b.x, a.y - b.y);
            const cx = (a.x + b.x) / 2;
            const cy = (a.y + b.y) / 2;
            if (lastPinchDistance > 0) {
              emit('gesture', {
                type: 'gesture',
                gesture: 'pinch',
                scale: dist / lastPinchDistance,
                dx: cx,
                dy: cy,
              } satisfies NormalizedGesture);
            }
            lastPinchDistance = dist;
          }
        }

        if (phase === 'up' || phase === 'cancel') {
          activePointers.delete(pe.pointerId);
          if (activePointers.size < 2) lastPinchDistance = 0;
        }
      };

      const onKey = (phase: 'down' | 'up') => (event: Event) => {
        const ke = event as KeyboardEvent;
        emit('key', {
          type: 'key',
          phase,
          key: ke.key,
          code: ke.code,
          repeat: ke.repeat,
          mods: { alt: ke.altKey, ctrl: ke.ctrlKey, meta: ke.metaKey, shift: ke.shiftKey },
        } satisfies NormalizedKey);
      };

      const onWheel = (event: Event) => {
        const we = event as WheelEvent;
        emit('wheel', { type: 'wheel', dx: we.deltaX, dy: we.deltaY, x: we.clientX, y: we.clientY } satisfies NormalizedWheel);
      };

      const bindings: Array<[string, EventListener]> = [
        ['pointerdown', onPointer('down') as EventListener],
        ['pointermove', onPointer('move') as EventListener],
        ['pointerup', onPointer('up') as EventListener],
        ['pointercancel', onPointer('cancel') as EventListener],
        ['keydown', onKey('down') as EventListener],
        ['keyup', onKey('up') as EventListener],
        ['wheel', onWheel as EventListener],
      ];
      for (const [name, fn] of bindings) {
        target.addEventListener(name, fn, { passive: true } as AddEventListenerOptions);
        cleanups.push(() => target.removeEventListener(name, fn));
      }
      return manager;
    },

    on(type, handler) {
      const set = handlers.get(type) ?? new Set();
      set.add(handler);
      handlers.set(type, set);
      return () => set.delete(handler);
    },

    emit,

    registerAdapter(adapter) {
      const detach = adapter.attach(emit);
      adapters.set(adapter.name, detach);
      return () => {
        detach();
        adapters.delete(adapter.name);
      };
    },

    destroy() {
      for (const fn of cleanups.splice(0)) fn();
      for (const detach of adapters.values()) detach();
      adapters.clear();
      handlers.clear();
      activePointers.clear();
    },
  };

  return manager;
}
