import type {
  AudioReactiveBridge,
  PlatformEventBus,
  PresetBundle,
  PresetBundleApplyResult,
  PresetBundleRegistry,
  PresetCategory,
  PresetTag,
  SoundEngineAdapter,
  UIPresetState,
  VisualEngineAdapter,
  Workspace,
  WorkspacePreset,
  WorkspaceRegionId,
} from '@plantasonic/platform-types';

import { DEFAULT_AUDIO_REACTIVE_MAPPINGS } from './audioReactiveBridge.js';

/** Targets used when applying a preset bundle */
export interface PresetBundleApplyContext {
  sound?: SoundEngineAdapter;
  visual?: VisualEngineAdapter;
  bridge?: AudioReactiveBridge;
  workspace?: Workspace;
  validateSoundPresetId?: (presetId: string) => boolean;
  validateVisualPresetId?: (presetId: string) => boolean;
  applyWorkspace?: (preset: WorkspacePreset) => void | Promise<void>;
  applyUI?: (state: UIPresetState, bundle: PresetBundle) => void | Promise<void>;
}

/** Options for creating a preset bundle registry */
export interface CreatePresetBundleRegistryOptions {
  eventBus: PlatformEventBus;
  source?: string;
  context?: PresetBundleApplyContext;
}

export class PresetBundleValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PresetBundleValidationError';
  }
}

/**
 * Create a unified preset bundle registry that coordinates engine adapters
 * without direct Sound ↔ Visual coupling.
 */
export function createPresetBundleRegistry(
  options: CreatePresetBundleRegistryOptions,
): PresetBundleRegistryWithContext {
  const { eventBus, source = 'preset-bundle-registry' } = options;
  const bundles = new Map<string, PresetBundle>();
  let context: PresetBundleApplyContext = options.context ?? {};
  let activeBundleId: string | null = null;

  const emit = (type: string, payload?: unknown): void => {
    eventBus.emit({
      type,
      timestamp: new Date().toISOString(),
      source,
      payload,
    });
  };

  const reportError = (operation: string, error: unknown): void => {
    const message = error instanceof Error ? error.message : String(error);
    emit('preset:error', { operation, message });
    console.warn(`[platform:preset] ${operation}:`, message);
  };

  const registry: PresetBundleRegistryWithContext = {
    registerBundle(bundle: PresetBundle): void {
      validateBundle(bundle);
      bundles.set(bundle.id, cloneBundle(bundle));
      emit('preset:register', { bundleId: bundle.id, name: bundle.name });
    },

    unregisterBundle(id: string): void {
      if (!bundles.has(id)) {
        reportError('unregister', `Bundle not found: ${id}`);
        return;
      }
      bundles.delete(id);
      if (activeBundleId === id) {
        activeBundleId = null;
      }
      emit('preset:unregister', { bundleId: id });
    },

    getBundle(id: string): PresetBundle | undefined {
      const bundle = bundles.get(id);
      return bundle ? cloneBundle(bundle) : undefined;
    },

    getBundles(): PresetBundle[] {
      return [...bundles.values()].map(cloneBundle);
    },

    getBundlesByCategory(category: PresetCategory): PresetBundle[] {
      return registry.getBundles().filter((bundle) => bundle.category === category);
    },

    getBundlesByTag(tag: PresetTag): PresetBundle[] {
      return registry.getBundles().filter((bundle) => bundle.tags?.includes(tag));
    },

    async applyBundle(id: string): Promise<PresetBundleApplyResult> {
      const bundle = bundles.get(id);
      if (!bundle) {
        const message = `Preset bundle not found: ${id}`;
        reportError('apply', message);
        throw new PresetBundleValidationError(message);
      }

      const warnings: string[] = [];

      try {
        await applySound(bundle, warnings);
        await applyVisual(bundle, warnings);
        applyBridge(bundle, warnings);
        await applyWorkspaceState(bundle, warnings);
        await applyUiState(bundle, warnings);

        activeBundleId = id;
        emit('preset:apply', {
          bundleId: id,
          bundle: cloneBundle(bundle),
          warnings,
        });

        return { bundleId: id, applied: true, warnings };
      } catch (error) {
        reportError('apply', error);
        throw error;
      }
    },

    exportBundle(id: string): string {
      const bundle = bundles.get(id);
      if (!bundle) {
        const message = `Preset bundle not found: ${id}`;
        reportError('export', message);
        throw new PresetBundleValidationError(message);
      }
      const json = JSON.stringify(bundle, null, 2);
      emit('preset:export', { bundleId: id });
      return json;
    },

    importBundle(json: string): PresetBundle {
      try {
        const parsed: unknown = JSON.parse(json);
        const bundle = validateBundle(parsed);
        registry.registerBundle(bundle);
        emit('preset:import', { bundleId: bundle.id });
        return cloneBundle(bundle);
      } catch (error) {
        reportError('import', error);
        if (error instanceof PresetBundleValidationError) {
          throw error;
        }
        throw new PresetBundleValidationError(
          error instanceof Error ? error.message : 'Invalid preset bundle JSON',
        );
      }
    },

    getActiveBundleId(): string | null {
      return activeBundleId;
    },

    setContext(next: PresetBundleApplyContext): void {
      context = { ...context, ...next };
    },
  };

  async function applySound(bundle: PresetBundle, warnings: string[]): Promise<void> {
    const sound = context.sound;
    const ref = bundle.sound;
    if (!ref?.presetId) return;
    if (!sound) {
      warnings.push('Sound adapter not connected — skipped sound preset');
      return;
    }
    if (context.validateSoundPresetId && !context.validateSoundPresetId(ref.presetId)) {
      warnings.push(`Sound preset not found: ${ref.presetId}`);
      return;
    }
    try {
      await sound.playPreset(ref.presetId);
    } catch (error) {
      warnings.push(
        `Sound preset failed (${ref.presetId}): ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async function applyVisual(bundle: PresetBundle, warnings: string[]): Promise<void> {
    const visual = context.visual;
    const ref = bundle.visual;
    if (!ref?.presetId) return;
    if (!visual) {
      warnings.push('Visual adapter not connected — skipped visual preset');
      return;
    }
    if (context.validateVisualPresetId && !context.validateVisualPresetId(ref.presetId)) {
      warnings.push(`Visual preset not found: ${ref.presetId}`);
      return;
    }
    try {
      await visual.setPreset(ref.presetId);
    } catch (error) {
      warnings.push(
        `Visual preset failed (${ref.presetId}): ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  function applyBridge(bundle: PresetBundle, warnings: string[]): void {
    const bridge = context.bridge;
    if (!bridge) {
      if (bundle.audioReactive) {
        warnings.push('Audio reactive bridge not connected — skipped bridge preset');
      }
      return;
    }

    const reactive = bundle.audioReactive;
    if (!reactive) {
      bridge.updateMapping({
        mappings: DEFAULT_AUDIO_REACTIVE_MAPPINGS.map((mapping) => ({ ...mapping })),
      });
      return;
    }

    const mappings =
      reactive.mappings && reactive.mappings.length > 0
        ? reactive.mappings.map((mapping) => ({ ...mapping }))
        : DEFAULT_AUDIO_REACTIVE_MAPPINGS.map((mapping) => ({ ...mapping }));

    if (!reactive.mappings || reactive.mappings.length === 0) {
      warnings.push('Bridge mapping preset missing — using defaults');
    }

    bridge.updateMapping({
      enabled: reactive.enabled ?? false,
      sensitivity: reactive.sensitivity ?? 0.75,
      smoothing: reactive.smoothing ?? 0.65,
      mappings,
    });
  }

  async function applyWorkspaceState(
    bundle: PresetBundle,
    warnings: string[],
  ): Promise<void> {
    const workspacePreset = bundle.workspace;
    if (!workspacePreset) return;

    if (context.applyWorkspace) {
      await context.applyWorkspace(workspacePreset);
      return;
    }

    if (context.workspace) {
      applyWorkspacePresetToRegions(context.workspace, workspacePreset);
      return;
    }

    warnings.push('Workspace handler not connected — skipped workspace preset');
  }

  async function applyUiState(bundle: PresetBundle, warnings: string[]): Promise<void> {
    const ui = bundle.ui;
    if (!ui) return;

    if (context.applyUI) {
      await context.applyUI(ui, bundle);
      return;
    }

    warnings.push('UI handler not connected — skipped UI preset');
  }

  return registry;
}

/** Apply workspace region visibility/labels to bound DOM elements */
export function applyWorkspacePresetToRegions(
  workspace: Workspace,
  preset: WorkspacePreset,
): void {
  if (!preset.regions) return;

  for (const [regionId, config] of Object.entries(preset.regions)) {
    const region = workspace.getRegion(regionId as WorkspaceRegionId);
    if (!region?.element) continue;

    if (config.visible === false) {
      region.element.classList.add('demo-region-hidden');
      region.element.setAttribute('hidden', '');
    } else if (config.visible === true) {
      region.element.classList.remove('demo-region-hidden');
      region.element.removeAttribute('hidden');
    }

    if (config.label) {
      region.element.dataset.psRegionLabel = config.label;
    }
  }
}

function validateBundle(input: unknown): PresetBundle {
  if (!input || typeof input !== 'object') {
    throw new PresetBundleValidationError('Preset bundle must be an object');
  }

  const bundle = input as PresetBundle;

  if (typeof bundle.id !== 'string' || bundle.id.trim() === '') {
    throw new PresetBundleValidationError('Preset bundle requires a non-empty id');
  }
  if (typeof bundle.name !== 'string' || bundle.name.trim() === '') {
    throw new PresetBundleValidationError('Preset bundle requires a non-empty name');
  }

  if (bundle.sound && typeof bundle.sound.presetId !== 'string') {
    throw new PresetBundleValidationError('sound.presetId must be a string');
  }
  if (bundle.visual && typeof bundle.visual.presetId !== 'string') {
    throw new PresetBundleValidationError('visual.presetId must be a string');
  }

  return bundle;
}

function cloneBundle(bundle: PresetBundle): PresetBundle {
  return JSON.parse(JSON.stringify(bundle)) as PresetBundle;
}

export type PresetBundleRegistryWithContext = PresetBundleRegistry & {
  setContext(context: PresetBundleApplyContext): void;
};
