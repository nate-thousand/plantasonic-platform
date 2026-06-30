import type {
  PlatformEventBus,
  ProjectApplyResult,
  ProjectState,
  ProjectStorageAdapter,
  WorkspacePersistence,
} from '@plantasonic/platform-types';

import {
  applyProjectState,
  captureProjectState,
  createDefaultProjectState,
  deserializeProject,
  PROJECT_STATE_VERSION,
  ProjectValidationError,
  serializeProject,
  validateSerializedProject,
  type ProjectStateContext,
} from './projectState.js';

export interface CreateWorkspacePersistenceOptions {
  eventBus: PlatformEventBus;
  context: ProjectStateContext;
  storage?: ProjectStorageAdapter;
  storageKey?: string;
  source?: string;
}

/** localStorage-backed storage adapter (browser only) */
export function createLocalStorageAdapter(storage: Storage = localStorage): ProjectStorageAdapter {
  return {
    read(key: string): string | null {
      try {
        return storage.getItem(key);
      } catch {
        return null;
      }
    },
    write(key: string, value: string): void {
      try {
        storage.setItem(key, value);
      } catch (error) {
        throw new ProjectValidationError(
          error instanceof Error ? error.message : 'Failed to write project to storage',
        );
      }
    },
    remove(key: string): void {
      try {
        storage.removeItem(key);
      } catch {
        // Ignore storage removal failures
      }
    },
  };
}

/** In-memory storage adapter for tests or non-browser environments */
export function createMemoryStorageAdapter(): ProjectStorageAdapter {
  const store = new Map<string, string>();
  return {
    read(key: string): string | null {
      return store.get(key) ?? null;
    },
    write(key: string, value: string): void {
      store.set(key, value);
    },
    remove(key: string): void {
      store.delete(key);
    },
  };
}

const reportError = (
  eventBus: PlatformEventBus,
  source: string,
  operation: string,
  message: string,
): void => {
  eventBus.emit({
    type: 'project:error',
    timestamp: new Date().toISOString(),
    source,
    payload: { operation, message },
  });
  console.warn(`[platform:project] ${operation}:`, message);
};

/** Create workspace persistence with a replaceable storage adapter */
export function createWorkspacePersistence(
  options: CreateWorkspacePersistenceOptions,
): WorkspacePersistenceWithContext {
  const {
    eventBus,
    source = 'workspace-persistence',
    storageKey = 'plantasonic-demo-project',
  } = options;
  let context = options.context;
  const storage = options.storage ?? createLocalStorageAdapter();

  const emit = (type: string, payload?: unknown): void => {
    eventBus.emit({
      type,
      timestamp: new Date().toISOString(),
      source,
      payload,
    });
  };

  const persistence: WorkspacePersistenceWithContext = {
    setContext(next: ProjectStateContext): void {
      context = next;
    },

    getCurrentState(): ProjectState {
      return captureProjectState(context);
    },

    async saveProject(): Promise<ProjectApplyResult> {
      try {
        const state = captureProjectState(context);
        const json = serializeProject(state);
        storage.write(storageKey, json);
        emit('project:save', { storageKey, version: PROJECT_STATE_VERSION });
        return { applied: true, warnings: [] };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        reportError(eventBus, source, 'save', message);
        return { applied: false, warnings: [], error: message };
      }
    },

    async loadProject(): Promise<ProjectApplyResult> {
      try {
        const raw = storage.read(storageKey);
        if (!raw) {
          const message = 'No saved project found in storage';
          reportError(eventBus, source, 'load', message);
          return { applied: false, warnings: [], error: message };
        }

        let parsed: unknown;
        try {
          parsed = JSON.parse(raw);
        } catch {
          storage.remove(storageKey);
          const message = 'Corrupted project data in storage — storage cleared';
          reportError(eventBus, source, 'load', message);
          return { applied: false, warnings: [], error: message };
        }

        const validation = validateSerializedProject(parsed);
        if (!validation.valid || !validation.state) {
          storage.remove(storageKey);
          const message = validation.error ?? 'Invalid saved project — storage cleared';
          reportError(eventBus, source, 'load', message);
          return { applied: false, warnings: validation.warnings, error: message };
        }

        const result = await applyProjectState(context, validation.state);
        if (!result.applied) {
          reportError(eventBus, source, 'load', result.error ?? 'Failed to apply project');
          return result;
        }

        emit('project:load', {
          storageKey,
          warnings: [...validation.warnings, ...result.warnings],
        });
        return {
          applied: true,
          warnings: [...validation.warnings, ...result.warnings],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        reportError(eventBus, source, 'load', message);
        return { applied: false, warnings: [], error: message };
      }
    },

    exportProject(): string {
      const state = captureProjectState(context);
      const json = serializeProject(state);
      emit('project:export', { version: PROJECT_STATE_VERSION });
      return json;
    },

    async importProject(json: string): Promise<ProjectApplyResult> {
      try {
        const state = deserializeProject(json);
        const validation = validateSerializedProject(JSON.parse(json));
        const result = await applyProjectState(context, state);
        if (!result.applied) {
          reportError(eventBus, source, 'import', result.error ?? 'Failed to apply imported project');
          return result;
        }

        emit('project:import', {
          warnings: [...(validation.warnings ?? []), ...result.warnings],
        });
        return {
          applied: true,
          warnings: [...(validation.warnings ?? []), ...result.warnings],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        reportError(eventBus, source, 'import', message);
        return { applied: false, warnings: [], error: message };
      }
    },

    async resetProject(): Promise<ProjectApplyResult> {
      try {
        storage.remove(storageKey);
        const defaults = createDefaultProjectState(context.applicationId);
        const result = await applyProjectState(context, defaults);
        emit('project:reset', { storageKey });
        return result;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        reportError(eventBus, source, 'reset', message);
        return { applied: false, warnings: [], error: message };
      }
    },
  };

  return persistence;
}

export type WorkspacePersistenceWithContext = WorkspacePersistence & {
  setContext(context: ProjectStateContext): void;
};

export {
  applyProjectState,
  captureProjectState,
  createDefaultProjectState,
  deserializeProject,
  PROJECT_STATE_VERSION,
  ProjectValidationError,
  serializeProject,
  validateProjectState,
  validateSerializedProject,
} from './projectState.js';

export type { ProjectStateContext } from './projectState.js';
