import type {
  LifecycleStatus,
  PlatformEventBus,
} from '@plantasonic/platform-types';

/** Options for creating a lifecycle manager */
export interface LifecycleOptions {
  eventBus: PlatformEventBus;
  source?: string;
  initialStatus?: LifecycleStatus;
}

/** Contract for the platform lifecycle manager */
export interface Lifecycle {
  readonly status: LifecycleStatus;
  transition(to: LifecycleStatus): void;
  onStatusChange(handler: (status: LifecycleStatus) => void): () => void;
}

const VALID_TRANSITIONS: Record<LifecycleStatus, LifecycleStatus[]> = {
  idle: ['initializing'],
  initializing: ['ready', 'error'],
  ready: ['running', 'stopped'],
  running: ['paused', 'stopping'],
  paused: ['running', 'stopping'],
  stopping: ['stopped', 'error'],
  stopped: ['idle'],
  error: ['idle'],
};

/**
 * Create a lifecycle manager that coordinates application state transitions.
 * Placeholder implementation — real lifecycle will coordinate engine init/teardown.
 */
export function createLifecycle(options: LifecycleOptions): Lifecycle {
  const { eventBus, source = 'platform', initialStatus = 'idle' } = options;
  let status: LifecycleStatus = initialStatus;
  const handlers = new Set<(status: LifecycleStatus) => void>();

  function notify(): void {
    for (const handler of handlers) {
      handler(status);
    }
  }

  function emitTransition(from: LifecycleStatus, to: LifecycleStatus): void {
    eventBus.emit({
      type: 'lifecycle.transition',
      timestamp: new Date().toISOString(),
      source,
      payload: { from, to },
    });
  }

  return {
    get status(): LifecycleStatus {
      return status;
    },

    transition(to: LifecycleStatus): void {
      const allowed = VALID_TRANSITIONS[status];
      if (!allowed.includes(to)) {
        console.warn(
          `[platform] Invalid lifecycle transition: ${status} → ${to}`,
        );
        return;
      }

      const from = status;
      status = to;
      emitTransition(from, to);
      notify();

      if (to === 'ready') {
        eventBus.emit({
          type: 'lifecycle.ready',
          timestamp: new Date().toISOString(),
          source,
        });
      }
    },

    onStatusChange(handler: (status: LifecycleStatus) => void): () => void {
      handlers.add(handler);
      return () => handlers.delete(handler);
    },
  };
}
