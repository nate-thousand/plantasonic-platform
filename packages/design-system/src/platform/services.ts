/**
 * Shared platform services — apps consume services, never reimplement locally.
 */
import type { ServiceId } from './types.ts';

export interface PlatformServiceSpec {
  id: ServiceId;
  name: string;
  purpose: string;
  /** Module path or SDK method apps call. */
  api: string;
}

export const SERVICE_CATALOG: PlatformServiceSpec[] = [
  { id: 'logging', name: 'Logging', purpose: 'Structured console + remote log sink.', api: 'platform.services.logging' },
  { id: 'settings', name: 'Settings', purpose: 'Persisted user/project settings.', api: 'platform.services.settings' },
  { id: 'telemetry', name: 'Telemetry', purpose: 'Optional anonymized usage metrics.', api: 'platform.services.telemetry' },
  { id: 'storage', name: 'Storage', purpose: 'Key-value and blob storage abstraction.', api: 'platform.services.storage' },
  { id: 'undo-redo', name: 'Undo / Redo', purpose: 'Command-stack undo/redo.', api: 'platform.services.undoRedo' },
  { id: 'history', name: 'History', purpose: 'Session action history.', api: 'platform.services.history' },
  { id: 'autosave', name: 'Autosave', purpose: 'Debounced project state persistence.', api: 'platform.services.autosave' },
  { id: 'file-import', name: 'File Import', purpose: 'Drag-drop and file-picker import pipeline.', api: 'platform.services.fileImport' },
  { id: 'file-export', name: 'File Export', purpose: 'Export snapshots, presets, and recordings.', api: 'platform.services.fileExport' },
  { id: 'search', name: 'Search', purpose: 'Fuzzy search across project content.', api: 'platform.services.search' },
  { id: 'notifications', name: 'Notifications', purpose: 'Toast and banner notifications (shell integration).', api: 'platform.services.notifications' },
  { id: 'recent-projects', name: 'Recent Projects', purpose: 'Cross-project recent list.', api: 'platform.services.recentProjects' },
];

const DEFAULT_SERVICES: ServiceId[] = ['logging', 'settings', 'autosave', 'notifications'];

export function getServices(): PlatformServiceSpec[] {
  return [...SERVICE_CATALOG];
}

export function getService(id: ServiceId): PlatformServiceSpec | undefined {
  return SERVICE_CATALOG.find((s) => s.id === id);
}

export function defaultServices(): ServiceId[] {
  return [...DEFAULT_SERVICES];
}

/** Generated client bootstrap snippet for enabled services. */
export function generateServicesBootstrap(ids: ServiceId[]): string {
  return `import { createPlatformServices } from 'plantasonic-design-system/platform';

export const services = createPlatformServices(${JSON.stringify(ids)});

// Wire into your app bootstrap:
// services.logging.info('${ids.join(', ')} enabled');
// services.settings.get('theme');
// services.autosave.schedule(saveProject);
`;
}

/** In-browser service stubs for generated prototypes. */
export function createPlatformServices(ids: ServiceId[]) {
  const enabled = new Set(ids);
  return {
    ids: [...enabled],
    logging: {
      info: (...args: unknown[]) => enabled.has('logging') && console.info('[platform]', ...args),
      warn: (...args: unknown[]) => enabled.has('logging') && console.warn('[platform]', ...args),
      error: (...args: unknown[]) => enabled.has('logging') && console.error('[platform]', ...args),
    },
    settings: {
      get: (key: string) => (enabled.has('settings') ? localStorage.getItem(`ps:${key}`) : null),
      set: (key: string, value: string) => enabled.has('settings') && localStorage.setItem(`ps:${key}`, value),
    },
    autosave: {
      schedule: (fn: () => void, ms = 5000) => {
        if (!enabled.has('autosave')) return () => {};
        const t = setInterval(fn, ms);
        return () => clearInterval(t);
      },
    },
    notifications: {
      push: (title: string, message?: string) => {
        if (enabled.has('notifications')) console.info('[notify]', title, message ?? '');
      },
    },
  };
}
