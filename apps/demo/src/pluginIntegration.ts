import {
  createPluginManager,
  type PlatformApplication,
  type PluginManagerWithServices,
  type PresetBundleRegistryWithContext,
  type PerformanceControlManagerWithContext,
} from '@plantasonic/platform';
import type {
  AudioReactiveBridge,
  SoundEngineAdapter,
  VisualEngineAdapter,
} from '@plantasonic/platform-types';

import type { PlatformPlugin } from '@plantasonic/platform-types';

import { DEMO_PLUGINS } from './demoPlugins.js';

/** Plugins inspector panel markup */
export function renderPluginsPanel(): string {
  return `
    <p class="small text-muted mb-2">Platform plugins register capabilities without modifying core SDK code.</p>
    <ul class="list-unstyled mb-0 demo-plugin-list" data-demo-plugin-list>
      <li class="small text-muted">Loading plugins…</li>
    </ul>
  `;
}

function showPluginError(root: HTMLElement, message: string): void {
  const el = root.querySelector<HTMLElement>('[data-demo-plugin-error]');
  if (!el) return;
  el.hidden = false;
  el.textContent = message;
}

function clearPluginError(root: HTMLElement): void {
  const el = root.querySelector<HTMLElement>('[data-demo-plugin-error]');
  if (!el) return;
  el.hidden = true;
  el.textContent = '';
}

function renderPluginList(root: HTMLElement, manager: PluginManagerWithServices): void {
  const list = root.querySelector<HTMLElement>('[data-demo-plugin-list]');
  if (!list) return;

  const statuses = manager.getAllPluginStatuses();
  if (statuses.length === 0) {
    list.innerHTML = '<li class="small text-muted">No plugins registered</li>';
    return;
  }

  list.innerHTML = statuses
    .map((status) => {
      const caps = status.capabilities.join(', ');
      const counts = Object.values(status.contributionCounts).reduce((a, b) => a + b, 0);
      const warn = status.warnings.length
        ? `<span class="text-warning d-block small">${status.warnings.join(' · ')}</span>`
        : '';
      const err = status.lastError
        ? `<span class="text-danger d-block small">${status.lastError}</span>`
        : '';
      return `<li class="mb-2 pb-2 border-bottom border-secondary-subtle">
        <div class="d-flex justify-content-between align-items-start gap-2">
          <div>
            <span class="fw-semibold small">${status.name}</span>
            <span class="badge ${status.enabled ? 'text-bg-success' : 'text-bg-secondary'} ms-1">${status.enabled ? 'on' : 'off'}</span>
            <span class="d-block small text-muted">v${status.version} · ${counts} contributions</span>
            <span class="d-block small text-muted">${caps}</span>
            ${warn}${err}
          </div>
          <button type="button" class="btn btn-sm btn-outline-secondary" data-demo-plugin-toggle="${status.pluginId}" aria-pressed="${status.enabled}">
            ${status.enabled ? 'Disable' : 'Enable'}
          </button>
        </div>
      </li>`;
    })
    .join('');
}

/** Create plugin manager, register demo plugins, wire services */
export async function createDemoPluginManager(
  app: PlatformApplication,
  sound: SoundEngineAdapter,
  visual: VisualEngineAdapter,
  bridge: AudioReactiveBridge,
  bundleRegistry: PresetBundleRegistryWithContext,
  performance: PerformanceControlManagerWithContext,
  plugins: PlatformPlugin[] = DEMO_PLUGINS,
): Promise<PluginManagerWithServices> {
  const manager = createPluginManager({ eventBus: app.eventBus });
  manager.setServices({
    eventBus: app.eventBus,
    lifecycle: app.lifecycle,
    presets: app.presets,
    workspace: app.workspace,
    presetBundles: bundleRegistry,
    sound,
    visual,
    bridge,
    performance,
  });

  for (const plugin of plugins) {
    const result = await manager.registerPlugin(plugin);
    if (!result.registered && result.error) {
      console.warn(`[demo:plugin] ${plugin.manifest.id}: ${result.error}`);
    } else if (result.warnings.length) {
      console.warn(`[demo:plugin] ${plugin.manifest.id} warnings:`, result.warnings);
    }
  }

  return manager;
}

/** Wire plugin panel toggles and event updates */
export function wirePluginManager(
  root: HTMLElement,
  app: PlatformApplication,
  manager: PluginManagerWithServices,
): () => void {
  app.eventBus.on('plugin', (event) => {
    if (event.type === 'plugin:error') {
      const payload = event.payload as { message?: string } | undefined;
      showPluginError(root, payload?.message ?? 'Plugin error');
    } else {
      clearPluginError(root);
    }
    renderPluginList(root, manager);
  });

  root.addEventListener('click', (event) => {
    const target = (event.target as HTMLElement).closest<HTMLButtonElement>(
      '[data-demo-plugin-toggle]',
    );
    if (!target) return;
    const pluginId = target.dataset.demoPluginToggle;
    if (!pluginId) return;
    void (async () => {
      try {
        const status = manager.getPluginStatus(pluginId);
        if (!status) return;
        if (status.enabled) {
          await manager.disablePlugin(pluginId);
        } else {
          await manager.enablePlugin(pluginId);
        }
        renderPluginList(root, manager);
      } catch (error) {
        showPluginError(root, error instanceof Error ? error.message : String(error));
      }
    })();
  });

  renderPluginList(root, manager);

  return () => {};
}

export function getEnabledPluginCount(manager: PluginManagerWithServices): number {
  return manager.getAllPluginStatuses().filter((status) => status.enabled).length;
}
