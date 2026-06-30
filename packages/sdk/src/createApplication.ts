import type {
  ApplicationConfig,
  ApplicationInstance,
  LifecycleStatus,
  PlatformEventBus,
  PresetRegistry,
  Workspace,
} from '@plantasonic/platform-types';

import { createEventBus } from './events.js';
import { createLifecycle, type Lifecycle } from './lifecycle.js';
import { createPresetRegistry } from './presets.js';
import { createWorkspace } from './workspace.js';

/** Extended application instance with platform services attached */
export interface PlatformApplication extends ApplicationInstance {
  readonly lifecycle: Lifecycle;
  readonly eventBus: PlatformEventBus;
  readonly workspace: Workspace;
  readonly presets: PresetRegistry;
  /** Transition lifecycle and update instance status */
  start(): void;
  /** Pause a running application */
  pause(): void;
  /** Stop and tear down */
  stop(): void;
}

/**
 * Create a platform application instance.
 * This is the primary entry point for Plantasonic applications.
 *
 * Placeholder implementation — orchestrates platform services without
 * binding to real engine packages yet.
 */
export function createApplication(
  config: ApplicationConfig,
): PlatformApplication {
  const eventBus = createEventBus();
  const workspace = createWorkspace(config.workspace);
  const presets = createPresetRegistry({ eventBus });
  const lifecycle = createLifecycle({
    eventBus,
    initialStatus: config.initialStatus ?? 'idle',
  });

  let status: LifecycleStatus = lifecycle.status;
  const createdAt = Date.now();

  lifecycle.onStatusChange((next) => {
    status = next;
  });

  eventBus.emit({
    type: 'application.created',
    timestamp: new Date().toISOString(),
    source: 'platform',
    payload: { id: config.id, name: config.name },
  });

  const instance: PlatformApplication = {
    id: config.id,
    name: config.name,
    description: config.description,
    get status(): LifecycleStatus {
      return status;
    },
    createdAt,
    lifecycle,
    eventBus,
    workspace,
    presets,

    start(): void {
      if (status === 'idle') {
        lifecycle.transition('initializing');
        // Placeholder: simulate async init completing immediately
        lifecycle.transition('ready');
        lifecycle.transition('running');
      } else if (status === 'paused') {
        lifecycle.transition('running');
      }
    },

    pause(): void {
      if (status === 'running') {
        lifecycle.transition('paused');
      }
    },

    stop(): void {
      if (status === 'running' || status === 'paused') {
        lifecycle.transition('stopping');
        lifecycle.transition('stopped');
      }
    },
  };

  return instance;
}
