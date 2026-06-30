import type {
  PlatformEvent,
  PlatformEventBus,
  PlatformEventHandler,
  PlatformEventSubscription,
} from '@plantasonic/platform-types';

/**
 * Create a lightweight in-memory event bus for platform-wide communication.
 * Engines and UI communicate through this bus — never directly with each other.
 */
export function createEventBus(): PlatformEventBus {
  const listeners = new Map<string, Set<PlatformEventHandler>>();

  return {
    emit<TPayload = unknown>(event: PlatformEvent<TPayload>): void {
      for (const [prefix, handlers] of listeners) {
        if (event.type === prefix || event.type.startsWith(`${prefix}.`)) {
          for (const handler of handlers) {
            handler(event);
          }
        }
      }
    },

    on<TPayload = unknown>(
      typePrefix: string,
      handler: PlatformEventHandler<TPayload>,
    ): PlatformEventSubscription {
      if (!listeners.has(typePrefix)) {
        listeners.set(typePrefix, new Set());
      }
      listeners.get(typePrefix)!.add(handler as PlatformEventHandler);

      return {
        unsubscribe(): void {
          listeners.get(typePrefix)?.delete(handler as PlatformEventHandler);
        },
      };
    },

    clear(): void {
      listeners.clear();
    },
  };
}
