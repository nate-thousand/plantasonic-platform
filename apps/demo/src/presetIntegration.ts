import {
  applyWorkspacePresetToRegions,
  createPresetBundleRegistry,
  DEFAULT_AUDIO_REACTIVE_MAPPINGS,
  listSoundEnginePresets,
  listVisualEnginePresets,
  type PlatformApplication,
  type PresetBundleRegistryWithContext,
} from '@plantasonic/platform';
import type {
  AudioReactiveBridge,
  PresetBundle,
  SoundEngineAdapter,
  UIPresetState,
  VisualEngineAdapter,
  WorkspacePreset,
} from '@plantasonic/platform-types';

import type { PerformanceControlManagerWithContext } from '@plantasonic/platform';

import {
  clearBridgeError,
  setBridgeControlsEnabled,
  updateBridgeStatusLabel,
} from './bridgeIntegration.js';
import { clearVisualError, setVisualControlsEnabled } from './visualIntegration.js';

const SOUND_PRESET_IDS = new Set(listSoundEnginePresets().map((preset) => preset.id));
const VISUAL_PRESET_IDS = new Set(listVisualEnginePresets().map((preset) => preset.id));

/** Render preset browser from unified bundles */
export function renderPresetBrowserContent(bundles: PresetBundle[]): string {
  if (bundles.length === 0) {
    return '<p class="text-muted small mb-0">No preset bundles available</p>';
  }

  return `<ul class="list-unstyled mb-0 demo-preset-list">${bundles
    .map((bundle) => {
      const tags = bundle.tags?.length
        ? bundle.tags
            .slice(0, 2)
            .map((tag) => `<span class="badge text-bg-secondary ms-1">${tag}</span>`)
            .join('')
        : '';
      const category = bundle.category
        ? `<span class="badge text-bg-dark me-1">${bundle.category}</span>`
        : '';
      return `<li class="mb-2">
        <button type="button" class="btn btn-sm btn-outline-secondary w-100 text-start demo-preset-bundle-btn" data-demo-bundle="${bundle.id}">
          <span class="d-block fw-semibold">${bundle.name}</span>
          ${bundle.description ? `<span class="d-block small text-muted mt-1">${bundle.description}</span>` : ''}
          <span class="d-block mt-1">${category}${tags}</span>
        </button>
      </li>`;
    })
    .join('')}</ul>`;
}

function showPresetWarning(root: HTMLElement, message: string): void {
  const el = root.querySelector<HTMLElement>('[data-demo-preset-warning]');
  if (!el) return;
  el.hidden = false;
  el.textContent = message;
}

function clearPresetWarning(root: HTMLElement): void {
  const el = root.querySelector<HTMLElement>('[data-demo-preset-warning]');
  if (!el) return;
  el.hidden = true;
  el.textContent = '';
}

function showPresetError(root: HTMLElement, message: string): void {
  const el = root.querySelector<HTMLElement>('[data-demo-preset-error]');
  if (!el) return;
  el.hidden = false;
  el.textContent = message;
}

function clearPresetError(root: HTMLElement): void {
  const el = root.querySelector<HTMLElement>('[data-demo-preset-error]');
  if (!el) return;
  el.hidden = true;
  el.textContent = '';
}

function setParameterControlsEnabled(root: HTMLElement, enabled: boolean): void {
  root.querySelectorAll<HTMLInputElement>('[data-demo-param]').forEach((input) => {
    input.disabled = !enabled;
  });
}

function setEngineControlsEnabled(root: HTMLElement, enabled: boolean): void {
  setParameterControlsEnabled(root, enabled);
  setVisualControlsEnabled(root, enabled);
  setBridgeControlsEnabled(root, enabled);
}

export function applyInspectorPanel(root: HTMLElement, panelId?: string): void {
  if (!panelId) return;
  const panel = root.querySelector<HTMLElement>(`[data-ps-inspector-panel="${panelId}"]`);
  if (!panel) return;

  root.querySelectorAll('[data-ps-inspector-panel]').forEach((section) => {
    section.classList.add('ps-is-collapsed');
    const toggle = section.querySelector('[data-ps-inspector-toggle]');
    const body = section.querySelector('.ps-inspector__body');
    toggle?.setAttribute('aria-expanded', 'false');
    body?.setAttribute('hidden', '');
  });

  panel.classList.remove('ps-is-collapsed');
  const toggle = panel.querySelector('[data-ps-inspector-toggle]');
  const body = panel.querySelector('.ps-inspector__body');
  toggle?.setAttribute('aria-expanded', 'true');
  body?.removeAttribute('hidden');
}

/** Apply UI preset state through platform adapters (not raw DOM-only writes) */
export async function applyDemoUIState(
  root: HTMLElement,
  sound: SoundEngineAdapter,
  visual: VisualEngineAdapter,
  bridge: AudioReactiveBridge,
  performance: PerformanceControlManagerWithContext | undefined,
  ui: UIPresetState & {
    activeInspectorPanel?: string;
    inspectorPanels?: Partial<Record<string, { collapsed?: boolean }>>;
    performanceModeEnabled?: boolean;
  },
): Promise<void> {
  await applyUiPresetState(root, sound, visual, ui);

  if (bridge && ui.audioReactiveEnabled !== undefined) {
    const status = bridge.getStatus();
    bridge.updateMapping({
      enabled: ui.audioReactiveEnabled,
      sensitivity: ui.bridgeSensitivity ?? status.sensitivity,
      smoothing: ui.bridgeSmoothing ?? status.smoothing,
      mappings: status.mappings,
    });
  }

  if (performance && ui.performanceModeEnabled !== undefined) {
    performance.enablePerformanceMode(ui.performanceModeEnabled);
    const perfToggle = root.querySelector<HTMLInputElement>('[data-demo-performance-enabled]');
    if (perfToggle) perfToggle.checked = ui.performanceModeEnabled;
  }

  if (ui.inspectorPanels) {
    applyInspectorPanelStates(root, ui.inspectorPanels);
  } else if (ui.activeInspectorPanel) {
    applyInspectorPanel(root, ui.activeInspectorPanel);
  }
}

/** Collect UI state from inspector controls for project persistence */
export function collectDemoUIState(
  root: HTMLElement,
  bridge: AudioReactiveBridge,
  performance?: PerformanceControlManagerWithContext,
): UIPresetState & {
  activeInspectorPanel?: string;
  inspectorPanels?: Partial<Record<string, { collapsed?: boolean }>>;
  performanceModeEnabled?: boolean;
} {
  const bridgeStatus = bridge.getStatus();
  const soundParameters: Record<string, number> = {};
  root.querySelectorAll<HTMLInputElement>('[data-demo-param]').forEach((input) => {
    const name = input.dataset.demoParam;
    if (!name || name === 'tempo') return;
    soundParameters[name] = Number(input.value);
  });

  const visualParameters: Record<string, number> = {};
  root.querySelectorAll<HTMLInputElement>('[data-demo-visual-param]').forEach((input) => {
    const name = input.dataset.demoVisualParam;
    if (!name) return;
    visualParameters[name] = Number(input.value);
  });

  const bridgeMappingAmounts: Partial<Record<string, number>> = {};
  root.querySelectorAll<HTMLInputElement>('[data-demo-bridge-map]').forEach((input) => {
    const feature = input.dataset.demoBridgeMap;
    if (!feature) return;
    bridgeMappingAmounts[feature] = Number(input.value);
  });

  const inspectorPanels: Partial<Record<string, { collapsed?: boolean }>> = {};
  let activeInspectorPanel: string | undefined;
  root.querySelectorAll<HTMLElement>('[data-ps-inspector-panel]').forEach((panel) => {
    const id = panel.dataset.psInspectorPanel;
    if (!id) return;
    const collapsed = panel.classList.contains('ps-is-collapsed');
    inspectorPanels[id] = { collapsed };
    if (!collapsed) activeInspectorPanel = id;
  });

  const tempoInput = root.querySelector<HTMLInputElement>('[data-demo-param="tempo"]');

  return {
    tempo: tempoInput ? Number(tempoInput.value) : undefined,
    soundParameters,
    visualParameters,
    audioReactiveEnabled: bridgeStatus.enabled,
    bridgeSensitivity: bridgeStatus.sensitivity,
    bridgeSmoothing: bridgeStatus.smoothing,
    bridgeMappingAmounts,
    activeInspectorPanel,
    inspectorPanels,
    performanceModeEnabled: performance?.getStatus().performanceModeEnabled,
  };
}

function applyInspectorPanelStates(
  root: HTMLElement,
  panels: Partial<Record<string, { collapsed?: boolean }>>,
): void {
  for (const [panelId, config] of Object.entries(panels)) {
    const panel = root.querySelector<HTMLElement>(`[data-ps-inspector-panel="${panelId}"]`);
    if (!panel) continue;
    const collapsed = config?.collapsed ?? false;
    const toggle = panel.querySelector('[data-ps-inspector-toggle]');
    const body = panel.querySelector('.ps-inspector__body');
    panel.classList.toggle('ps-is-collapsed', collapsed);
    toggle?.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    if (collapsed) {
      body?.setAttribute('hidden', '');
    } else {
      body?.removeAttribute('hidden');
    }
  }
}

async function applyUiPresetState(
  root: HTMLElement,
  sound: SoundEngineAdapter,
  visual: VisualEngineAdapter,
  ui: UIPresetState,
): Promise<void> {
  if (ui.tempo !== undefined) {
    const tempoInput = root.querySelector<HTMLInputElement>('[data-demo-param="tempo"]');
    if (tempoInput) {
      tempoInput.value = String(ui.tempo);
      const label = root.querySelector('[data-demo-tempo-value]');
      if (label) label.textContent = `${ui.tempo} BPM`;
    }
    await sound.updateParameter('tempo', ui.tempo).catch(() => undefined);
  }

  if (ui.soundParameters) {
    for (const [name, value] of Object.entries(ui.soundParameters)) {
      const input = root.querySelector<HTMLInputElement>(`[data-demo-param="${name}"]`);
      if (input) input.value = String(value);
      await sound.updateParameter(name, value).catch(() => undefined);
    }
  }

  if (ui.visualParameters) {
    for (const [name, value] of Object.entries(ui.visualParameters)) {
      const input = root.querySelector<HTMLInputElement>(`[data-demo-visual-param="${name}"]`);
      if (input) input.value = String(value);
      await visual.updateParameter(name, value).catch(() => undefined);
    }
  }

  const bridgeEnabled = root.querySelector<HTMLInputElement>('[data-demo-bridge-enabled]');
  if (bridgeEnabled && ui.audioReactiveEnabled !== undefined) {
    bridgeEnabled.checked = ui.audioReactiveEnabled;
  }

  if (ui.bridgeSensitivity !== undefined) {
    const input = root.querySelector<HTMLInputElement>('[data-demo-bridge-sensitivity]');
    if (input) input.value = String(ui.bridgeSensitivity);
  }

  if (ui.bridgeSmoothing !== undefined) {
    const input = root.querySelector<HTMLInputElement>('[data-demo-bridge-smoothing]');
    if (input) input.value = String(ui.bridgeSmoothing);
  }

  if (ui.bridgeMappingAmounts) {
    for (const [feature, amount] of Object.entries(ui.bridgeMappingAmounts)) {
      const input = root.querySelector<HTMLInputElement>(`[data-demo-bridge-map="${feature}"]`);
      if (input) input.value = String(amount);
    }
  }
}

/** Create registry, register demo bundles, and wire apply context */
export function createDemoPresetBundleRegistry(
  app: PlatformApplication,
  sound: SoundEngineAdapter,
  visual: VisualEngineAdapter,
  bridge: AudioReactiveBridge,
  root: HTMLElement,
  presetBundles: PresetBundle[],
): PresetBundleRegistryWithContext {
  const registry = createPresetBundleRegistry({ eventBus: app.eventBus });

  for (const bundle of presetBundles) {
    registry.registerBundle(bundle);
  }

  registry.setContext({
    sound,
    visual,
    bridge,
    workspace: app.workspace,
    validateSoundPresetId: (id) => SOUND_PRESET_IDS.has(id),
    validateVisualPresetId: (id) => VISUAL_PRESET_IDS.has(id) || SOUND_PRESET_IDS.has(id),
    applyWorkspace: (preset: WorkspacePreset) => {
      applyWorkspacePresetToRegions(app.workspace, preset);
      applyInspectorPanel(root, preset.activeInspectorPanel);
    },
    applyUI: async (ui) => {
      await applyUiPresetState(root, sound, visual, ui);
    },
  });

  return registry;
}

/** Wire preset bundle browser selection */
export function wirePresetBundles(
  root: HTMLElement,
  app: PlatformApplication,
  registry: PresetBundleRegistryWithContext,
  bridge: AudioReactiveBridge,
): void {
  app.eventBus.on('preset', (event) => {
    if (event.type === 'preset:error') {
      const payload = event.payload as { message?: string } | undefined;
      showPresetError(root, payload?.message ?? 'Preset error');
      return;
    }
    if (event.type === 'preset:apply') {
      const payload = event.payload as { warnings?: string[] } | undefined;
      if (payload?.warnings?.length) {
        showPresetWarning(root, payload.warnings.join(' · '));
      } else {
        clearPresetWarning(root);
      }
      clearPresetError(root);
    }
  });

  root.querySelectorAll<HTMLButtonElement>('[data-demo-bundle]').forEach((button) => {
    button.addEventListener('click', () => {
      const bundleId = button.dataset.demoBundle;
      if (!bundleId) return;
      void (async () => {
        try {
          clearPresetError(root);
          clearPresetWarning(root);
          clearVisualError(root);
          clearBridgeError(root);

          const result = await registry.applyBundle(bundleId);
          if (result.warnings.length) {
            showPresetWarning(root, result.warnings.join(' · '));
          }

          setEngineControlsEnabled(root, true);
          updateBridgeStatusLabel(root, bridge);

          root.querySelectorAll<HTMLButtonElement>('[data-demo-bundle]').forEach((btn) => {
            btn.classList.toggle('active', btn.dataset.demoBundle === bundleId);
          });
        } catch (error) {
          showPresetError(root, error instanceof Error ? error.message : String(error));
        }
      })();
    });
  });
}

export { DEFAULT_AUDIO_REACTIVE_MAPPINGS };
