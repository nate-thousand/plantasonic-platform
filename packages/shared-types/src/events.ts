/**
 * Base shape for all platform events.
 * Events flow through the platform event bus — engines and UI never talk directly.
 */
export interface PlatformEvent<TPayload = unknown> {
  /** Dot-namespaced event type, e.g. 'lifecycle.ready', 'preset.loaded' */
  type: string;
  /** ISO 8601 timestamp */
  timestamp: string;
  /** Source component identifier */
  source: string;
  /** Optional typed payload */
  payload?: TPayload;
}

/** Handler invoked when a matching event is emitted */
export type PlatformEventHandler<TPayload = unknown> = (
  event: PlatformEvent<TPayload>,
) => void;

/** Subscription handle returned when listening to events */
export interface PlatformEventSubscription {
  /** Remove this listener */
  unsubscribe(): void;
}

/** Contract for the platform event bus */
export interface PlatformEventBus {
  /** Emit an event to all matching listeners */
  emit<TPayload = unknown>(event: PlatformEvent<TPayload>): void;
  /** Subscribe to events matching a type prefix (e.g. 'lifecycle' matches 'lifecycle.ready') */
  on<TPayload = unknown>(
    typePrefix: string,
    handler: PlatformEventHandler<TPayload>,
  ): PlatformEventSubscription;
  /** Remove all listeners */
  clear(): void;
}
