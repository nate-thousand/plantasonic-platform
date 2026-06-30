import type { WorkspaceConfig } from './workspace.js';

/**
 * Lifecycle states for a platform application instance.
 * Transitions are managed by the platform SDK, not by individual engines.
 */
export type LifecycleStatus =
  | 'idle'
  | 'initializing'
  | 'ready'
  | 'running'
  | 'paused'
  | 'stopping'
  | 'stopped'
  | 'error';

/**
 * Configuration for creating a new platform application.
 * Applications supply creative direction; the platform orchestrates engines.
 */
export interface ApplicationConfig {
  /** Unique identifier for this application instance */
  id: string;
  /** Human-readable application name */
  name: string;
  /** Optional description shown in status/debug surfaces */
  description?: string;
  /** Workspace layout configuration */
  workspace?: WorkspaceConfig;
  /** Initial lifecycle status (defaults to 'idle') */
  initialStatus?: LifecycleStatus;
}

/**
 * A running platform application instance.
 * Exposes lifecycle state and references to registered engine adapters.
 */
export interface ApplicationInstance {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly status: LifecycleStatus;
  /** Timestamp when the instance was created (ms since epoch) */
  readonly createdAt: number;
}
