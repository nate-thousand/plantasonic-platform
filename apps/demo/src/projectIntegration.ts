import {
  createWorkspacePersistence,
  type PlatformApplication,
  type PluginManagerWithServices,
  type PresetBundleRegistryWithContext,
  type PerformanceControlManagerWithContext,
  type WorkspacePersistenceWithContext,
} from '@plantasonic/platform';
import type {
  AudioReactiveBridge,
  SoundEngineAdapter,
  VisualEngineAdapter,
} from '@plantasonic/platform-types';

import {
  applyDemoUIState,
  collectDemoUIState,
} from './presetIntegration.js';
import { setBridgeControlsEnabled, updateBridgeStatusLabel } from './bridgeIntegration.js';
import { setPerformanceControlsEnabled } from './performanceIntegration.js';
import { setVisualControlsEnabled } from './visualIntegration.js';

/** Project persistence controls for the status region */
export function renderProjectControls(): string {
  return `
    <div class="demo-project-controls border-top border-secondary-subtle pt-2 mt-2">
      <p class="small text-muted mb-2 mb-md-1">Project</p>
      <div class="d-flex flex-wrap gap-1 mb-2">
        <button type="button" class="btn btn-sm btn-outline-secondary" data-demo-project-save>Save</button>
        <button type="button" class="btn btn-sm btn-outline-secondary" data-demo-project-load>Load</button>
        <button type="button" class="btn btn-sm btn-outline-secondary" data-demo-project-reset>Reset</button>
        <button type="button" class="btn btn-sm btn-outline-secondary" data-demo-project-export>Export</button>
        <label class="btn btn-sm btn-outline-secondary mb-0">
          Import
          <input type="file" accept="application/json,.json" data-demo-project-import hidden>
        </label>
      </div>
      <p class="small mb-0" data-demo-project-status>Project not saved</p>
      <p class="text-warning small mb-0 mt-1" data-demo-project-warning hidden role="status"></p>
      <p class="text-danger small mb-0 mt-1" data-demo-project-error hidden role="alert"></p>
    </div>
  `;
}

function showProjectError(root: HTMLElement, message: string): void {
  const el = root.querySelector<HTMLElement>('[data-demo-project-error]');
  if (!el) return;
  el.hidden = false;
  el.textContent = message;
}

function clearProjectError(root: HTMLElement): void {
  const el = root.querySelector<HTMLElement>('[data-demo-project-error]');
  if (!el) return;
  el.hidden = true;
  el.textContent = '';
}

function showProjectWarning(root: HTMLElement, message: string): void {
  const el = root.querySelector<HTMLElement>('[data-demo-project-warning]');
  if (!el) return;
  el.hidden = false;
  el.textContent = message;
}

function clearProjectWarning(root: HTMLElement): void {
  const el = root.querySelector<HTMLElement>('[data-demo-project-warning]');
  if (!el) return;
  el.hidden = true;
  el.textContent = '';
}

function updateProjectStatus(root: HTMLElement, message: string): void {
  const el = root.querySelector<HTMLElement>('[data-demo-project-status]');
  if (el) el.textContent = message;
}

function syncPresetBrowserSelection(
  root: HTMLElement,
  bundleId: string | null | undefined,
): void {
  root.querySelectorAll<HTMLButtonElement>('[data-demo-bundle]').forEach((btn) => {
    btn.classList.toggle('active', Boolean(bundleId && btn.dataset.demoBundle === bundleId));
  });
}

/** Create workspace persistence wired to demo managers */
export function createDemoProjectPersistence(
  app: PlatformApplication,
  root: HTMLElement,
  sound: SoundEngineAdapter,
  visual: VisualEngineAdapter,
  bridge: AudioReactiveBridge,
  bundleRegistry: PresetBundleRegistryWithContext,
  performance: PerformanceControlManagerWithContext,
  pluginManager: PluginManagerWithServices,
): WorkspacePersistenceWithContext {
  const persistence = createWorkspacePersistence({
    eventBus: app.eventBus,
    storageKey: `plantasonic-project:${app.id}`,
    context: {
      applicationId: app.id,
      presetBundles: bundleRegistry,
      sound,
      visual,
      bridge,
      performance,
      pluginManager,
      workspace: app.workspace,
      collectUIState: () => collectDemoUIState(root, bridge, performance),
      applyUIState: async (ui) => {
        await applyDemoUIState(root, sound, visual, bridge, performance, ui);
        updateBridgeStatusLabel(root, bridge);
        root.querySelectorAll<HTMLInputElement>('[data-demo-param]').forEach((input) => {
          input.disabled = false;
        });
        setVisualControlsEnabled(root, true);
        setBridgeControlsEnabled(root, true);
        setPerformanceControlsEnabled(root, true);
      },
    },
  });

  return persistence;
}

/** Wire project save/load/export/import/reset controls */
export function wireProjectPersistence(
  root: HTMLElement,
  app: PlatformApplication,
  persistence: WorkspacePersistenceWithContext,
  bundleRegistry: PresetBundleRegistryWithContext,
): void {
  const handleResult = (operation: string, result: Awaited<ReturnType<typeof persistence.saveProject>>) => {
    if (result.error) {
      showProjectError(root, result.error);
    } else {
      clearProjectError(root);
    }
    if (result.warnings.length) {
      showProjectWarning(root, result.warnings.join(' · '));
    } else {
      clearProjectWarning(root);
    }
    if (result.applied) {
      const bundleId = bundleRegistry.getActiveBundleId();
      syncPresetBrowserSelection(root, bundleId);
      updateProjectStatus(root, `${operation} complete · bundle ${bundleId ?? '—'}`);
    }
  };

  app.eventBus.on('project', (event) => {
    if (event.type === 'project:error') {
      const payload = event.payload as { message?: string } | undefined;
      showProjectError(root, payload?.message ?? 'Project error');
      return;
    }
    clearProjectError(root);
    if (event.type === 'project:save') {
      updateProjectStatus(root, 'Project saved to local storage');
    }
    if (event.type === 'project:load') {
      const payload = event.payload as { warnings?: string[] } | undefined;
      if (payload?.warnings?.length) {
        showProjectWarning(root, payload.warnings.join(' · '));
      }
      updateProjectStatus(root, 'Project loaded from local storage');
      syncPresetBrowserSelection(root, bundleRegistry.getActiveBundleId());
    }
    if (event.type === 'project:import') {
      updateProjectStatus(root, 'Project imported');
      syncPresetBrowserSelection(root, bundleRegistry.getActiveBundleId());
    }
    if (event.type === 'project:reset') {
      updateProjectStatus(root, 'Project reset to defaults');
      syncPresetBrowserSelection(root, bundleRegistry.getActiveBundleId());
    }
  });

  root.querySelector<HTMLButtonElement>('[data-demo-project-save]')?.addEventListener('click', () => {
    void persistence.saveProject().then((result) => handleResult('Save', result));
  });

  root.querySelector<HTMLButtonElement>('[data-demo-project-load]')?.addEventListener('click', () => {
    void persistence.loadProject().then((result) => handleResult('Load', result));
  });

  root.querySelector<HTMLButtonElement>('[data-demo-project-reset]')?.addEventListener('click', () => {
    void persistence.resetProject().then((result) => handleResult('Reset', result));
  });

  root.querySelector<HTMLButtonElement>('[data-demo-project-export]')?.addEventListener('click', () => {
    try {
      clearProjectError(root);
      const json = persistence.exportProject();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `plantasonic-project-${app.id}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
      updateProjectStatus(root, 'Project exported');
    } catch (error) {
      showProjectError(root, error instanceof Error ? error.message : String(error));
    }
  });

  root.querySelector<HTMLInputElement>('[data-demo-project-import]')?.addEventListener(
    'change',
    (event) => {
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0];
      if (!file) return;
      void file.text().then((json) => {
        void persistence.importProject(json).then((result) => handleResult('Import', result));
        input.value = '';
      });
    },
  );

  updateProjectStatus(root, 'Project ready');
}

export function getProjectSummary(persistence: WorkspacePersistenceWithContext): string {
  const state = persistence.getCurrentState();
  return state.activePresetBundleId ?? '—';
}
