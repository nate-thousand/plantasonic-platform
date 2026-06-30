import type {
  AudioReactiveMapping,
  ControlMapping,
  PlatformEventBus,
  PlatformLifecycle,
  PlatformPlugin,
  PluginAdapterDeclaration,
  PluginCapability,
  PluginCommand,
  PluginContext,
  PluginDocumentation,
  PluginManager,
  PluginPanel,
  PluginRegistrationResult,
  PluginStatus,
  PresetBundle,
  PresetBundleRegistry,
  PresetRegistry,
  PerformanceControlManager,
  AudioReactiveBridge,
  SoundEngineAdapter,
  VisualEngineAdapter,
  Workspace,
  WorkspaceRegion,
} from '@plantasonic/platform-types';

import { DEFAULT_AUDIO_REACTIVE_MAPPINGS } from './audioReactiveBridge.js';
import { DEFAULT_PERFORMANCE_MAPPINGS } from './performanceControls.js';

/** Services available when building plugin context */
export interface PluginManagerServices {
  eventBus: PlatformEventBus;
  lifecycle: PlatformLifecycle;
  presets: PresetRegistry;
  workspace: Workspace;
  presetBundles?: PresetBundleRegistry;
  sound?: SoundEngineAdapter;
  visual?: VisualEngineAdapter;
  bridge?: AudioReactiveBridge;
  performance?: PerformanceControlManager;
}

export interface CreatePluginManagerOptions {
  eventBus: PlatformEventBus;
  source?: string;
  services?: PluginManagerServices;
}

interface PluginContributions {
  commands: PluginCommand[];
  panels: PluginPanel[];
  presetBundles: PresetBundle[];
  performanceMappings: ControlMapping[];
  audioReactiveMappings: AudioReactiveMapping[];
  workspaceRegions: WorkspaceRegion[];
  documentation: PluginDocumentation[];
  adapterDeclarations: PluginAdapterDeclaration[];
}

interface PluginRecord {
  plugin: PlatformPlugin;
  enabled: boolean;
  registered: boolean;
  warnings: string[];
  lastError: string | null;
  contributions: PluginContributions;
}

const ALL_CAPABILITIES: PluginCapability[] = [
  'commands',
  'panels',
  'preset-bundles',
  'sound-adapter',
  'visual-adapter',
  'performance-mappings',
  'audio-reactive-mappings',
  'workspace-regions',
  'documentation',
];

export class PluginValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PluginValidationError';
  }
}

/** Create the platform plugin manager */
export function createPluginManager(
  options: CreatePluginManagerOptions,
): PluginManagerWithServices {
  const { eventBus, source = 'plugin-manager' } = options;
  let services: PluginManagerServices | undefined = options.services;
  const records = new Map<string, PluginRecord>();

  const emit = (type: string, payload?: unknown): void => {
    eventBus.emit({
      type,
      timestamp: new Date().toISOString(),
      source,
      payload,
    });
  };

  const reportError = (operation: string, pluginId: string, error: unknown): void => {
    const message = error instanceof Error ? error.message : String(error);
    const record = records.get(pluginId);
    if (record) {
      record.lastError = message;
    }
    emit('plugin:error', { operation, pluginId, message });
    console.warn(`[platform:plugin] ${operation} (${pluginId}):`, message);
  };

  const manager: PluginManagerWithServices = {
    setServices(next: PluginManagerServices): void {
      services = next;
    },

    validatePlugin(plugin: PlatformPlugin): PluginRegistrationResult {
      const warnings: string[] = [];
      const manifest = plugin.manifest;

      if (!manifest) {
        return {
          pluginId: 'unknown',
          registered: false,
          warnings,
          error: 'Plugin manifest is required',
        };
      }

      if (!manifest.id?.trim()) {
        return {
          pluginId: manifest.id ?? 'unknown',
          registered: false,
          warnings,
          error: 'Plugin manifest requires a non-empty id',
        };
      }

      if (!manifest.name?.trim()) {
        return {
          pluginId: manifest.id,
          registered: false,
          warnings,
          error: 'Plugin manifest requires a non-empty name',
        };
      }

      if (!manifest.version?.trim()) {
        return {
          pluginId: manifest.id,
          registered: false,
          warnings,
          error: 'Plugin manifest requires a version',
        };
      }

      if (!Array.isArray(manifest.capabilities) || manifest.capabilities.length === 0) {
        warnings.push('Plugin declares no capabilities');
      }

      for (const capability of manifest.capabilities ?? []) {
        if (!ALL_CAPABILITIES.includes(capability)) {
          warnings.push(`Unsupported capability: ${capability}`);
        }
      }

      for (const dependency of manifest.dependencies ?? []) {
        if (!dependency.optional && !records.has(dependency.pluginId)) {
          warnings.push(`Missing required dependency: ${dependency.pluginId}`);
        }
      }

      if (records.has(manifest.id)) {
        return {
          pluginId: manifest.id,
          registered: false,
          warnings,
          error: `Duplicate plugin id: ${manifest.id}`,
        };
      }

      return { pluginId: manifest.id, registered: true, warnings };
    },

    async registerPlugin(plugin: PlatformPlugin): Promise<PluginRegistrationResult> {
      const validation = manager.validatePlugin(plugin);
      if (!validation.registered) {
        emit('plugin:error', {
          operation: 'register',
          pluginId: validation.pluginId,
          message: validation.error,
        });
        return validation;
      }

      const record: PluginRecord = {
        plugin,
        enabled: false,
        registered: false,
        warnings: [...validation.warnings],
        lastError: null,
        contributions: emptyContributions(),
      };

      records.set(plugin.manifest.id, record);

      try {
        const context = createPluginContext(plugin.manifest.id, record.contributions);
        await plugin.register(context);
        record.registered = true;

        if (plugin.manifest.defaultEnabled !== false) {
          await manager.enablePlugin(plugin.manifest.id);
        }

        emit('plugin:register', {
          pluginId: plugin.manifest.id,
          capabilities: plugin.manifest.capabilities,
          warnings: record.warnings,
        });

        return {
          pluginId: plugin.manifest.id,
          registered: true,
          warnings: record.warnings,
        };
      } catch (error) {
        record.lastError = error instanceof Error ? error.message : String(error);
        records.delete(plugin.manifest.id);
        reportError('register', plugin.manifest.id, error);
        return {
          pluginId: plugin.manifest.id,
          registered: false,
          warnings: record.warnings,
          error: record.lastError,
        };
      }
    },

    async unregisterPlugin(pluginId: string): Promise<void> {
      const record = records.get(pluginId);
      if (!record) {
        reportError('unregister', pluginId, 'Plugin not found');
        return;
      }

      try {
        if (record.enabled) {
          await manager.disablePlugin(pluginId);
        }
        const context = createPluginContext(pluginId, record.contributions);
        await record.plugin.unregister?.(context);
      } catch (error) {
        reportError('unregister', pluginId, error);
      } finally {
        records.delete(pluginId);
        emit('plugin:unregister', { pluginId });
      }
    },

    getPlugin(pluginId: string): PlatformPlugin | undefined {
      return records.get(pluginId)?.plugin;
    },

    getPlugins(): PlatformPlugin[] {
      return [...records.values()].map((record) => record.plugin);
    },

    getPluginsByCapability(capability: PluginCapability): PlatformPlugin[] {
      return manager
        .getPlugins()
        .filter((plugin) => plugin.manifest.capabilities.includes(capability));
    },

    async enablePlugin(pluginId: string): Promise<void> {
      const record = records.get(pluginId);
      if (!record) {
        reportError('enable', pluginId, 'Plugin not found');
        return;
      }
      if (record.enabled) return;

      try {
        applyContributions(record.contributions);
        const context = createPluginContext(pluginId, record.contributions);
        await record.plugin.enable?.(context);
        record.enabled = true;
        emit('plugin:enable', { pluginId });
      } catch (error) {
        reportError('enable', pluginId, error);
      }
    },

    async disablePlugin(pluginId: string): Promise<void> {
      const record = records.get(pluginId);
      if (!record) {
        reportError('disable', pluginId, 'Plugin not found');
        return;
      }
      if (!record.enabled) return;

      try {
        removeContributions(record.contributions);
        const context = createPluginContext(pluginId, record.contributions);
        await record.plugin.disable?.(context);
        record.enabled = false;
        emit('plugin:disable', { pluginId });
      } catch (error) {
        reportError('disable', pluginId, error);
      }
    },

    getPluginStatus(pluginId: string): PluginStatus | undefined {
      const record = records.get(pluginId);
      if (!record) return undefined;
      return buildStatus(record);
    },

    getAllPluginStatuses(): PluginStatus[] {
      return [...records.values()].map(buildStatus);
    },
  };

  function emptyContributions(): PluginContributions {
    return {
      commands: [],
      panels: [],
      presetBundles: [],
      performanceMappings: [],
      audioReactiveMappings: [],
      workspaceRegions: [],
      documentation: [],
      adapterDeclarations: [],
    };
  }

  function createPluginContext(
    pluginId: string,
    contributions: PluginContributions,
  ): PluginContext {
    if (!services) {
      throw new PluginValidationError('PluginManager services not configured');
    }

    const registerAndEmit = (capability: PluginCapability, payload: unknown): void => {
      emit('plugin:capability-register', { pluginId, capability, payload });
    };

    return {
      eventBus: services.eventBus,
      lifecycle: services.lifecycle,
      presets: services.presets,
      workspace: services.workspace,
      presetBundles: services.presetBundles,
      sound: services.sound,
      visual: services.visual,
      bridge: services.bridge,
      performance: services.performance,

      registerCommand(command: PluginCommand): void {
        contributions.commands.push(command);
        registerAndEmit('commands', command);
      },

      registerPanel(panel: PluginPanel): void {
        contributions.panels.push(panel);
        registerAndEmit('panels', panel);
      },

      registerPresetBundle(bundle: PresetBundle): void {
        contributions.presetBundles.push(bundle);
        registerAndEmit('preset-bundles', { bundleId: bundle.id });
      },

      registerPerformanceMapping(mapping: ControlMapping): void {
        contributions.performanceMappings.push(mapping);
        registerAndEmit('performance-mappings', mapping);
      },

      registerAudioReactiveMapping(mapping: AudioReactiveMapping): void {
        contributions.audioReactiveMappings.push(mapping);
        registerAndEmit('audio-reactive-mappings', mapping);
      },

      registerWorkspaceRegion(region: WorkspaceRegion): void {
        contributions.workspaceRegions.push(region);
        registerAndEmit('workspace-regions', region);
      },

      registerDocumentation(doc: PluginDocumentation): void {
        contributions.documentation.push(doc);
        registerAndEmit('documentation', doc);
      },

      declareSoundAdapter(declaration: PluginAdapterDeclaration): void {
        contributions.adapterDeclarations.push(declaration);
        registerAndEmit('sound-adapter', declaration);
      },

      declareVisualAdapter(declaration: PluginAdapterDeclaration): void {
        contributions.adapterDeclarations.push(declaration);
        registerAndEmit('visual-adapter', declaration);
      },
    };
  }

  function applyContributions(contributions: PluginContributions): void {
    for (const bundle of contributions.presetBundles) {
      try {
        services?.presetBundles?.registerBundle(bundle);
      } catch (error) {
        console.warn('[platform:plugin] preset bundle apply failed:', error);
      }
    }

    if (contributions.performanceMappings.length > 0 && services?.performance) {
      const existing = services.performance.getStatus().mappings;
      services.performance.updateMappings([
        ...existing,
        ...contributions.performanceMappings,
      ]);
    }

    if (contributions.audioReactiveMappings.length > 0 && services?.bridge) {
      const status = services.bridge.getStatus();
      services.bridge.updateMapping({
        mappings: [...status.mappings, ...contributions.audioReactiveMappings],
      });
    }
  }

  function removeContributions(contributions: PluginContributions): void {
    for (const bundle of contributions.presetBundles) {
      try {
        services?.presetBundles?.unregisterBundle(bundle.id);
      } catch (error) {
        console.warn('[platform:plugin] preset bundle remove failed:', error);
      }
    }

    if (contributions.performanceMappings.length > 0 && services?.performance) {
      const removeIds = new Set(contributions.performanceMappings.map((mapping) => mapping.id));
      const remaining = services.performance
        .getStatus()
        .mappings.filter((mapping) => !removeIds.has(mapping.id));
      services.performance.updateMappings(
        remaining.length > 0 ? remaining : DEFAULT_PERFORMANCE_MAPPINGS,
      );
    }

    if (contributions.audioReactiveMappings.length > 0 && services?.bridge) {
      const removeKeys = new Set(
        contributions.audioReactiveMappings.map(
          (mapping) => `${mapping.feature}:${mapping.target}`,
        ),
      );
      const remaining = services.bridge
        .getStatus()
        .mappings.filter(
          (mapping) => !removeKeys.has(`${mapping.feature}:${mapping.target}`),
        );
      services.bridge.updateMapping({
        mappings: remaining.length > 0 ? remaining : DEFAULT_AUDIO_REACTIVE_MAPPINGS,
      });
    }
  }

  function buildStatus(record: PluginRecord): PluginStatus {
    const { plugin, enabled, registered, warnings, lastError, contributions } = record;
    return {
      pluginId: plugin.manifest.id,
      name: plugin.manifest.name,
      version: plugin.manifest.version,
      enabled,
      registered,
      capabilities: [...plugin.manifest.capabilities],
      warnings: [...warnings],
      lastError,
      contributionCounts: {
        commands: contributions.commands.length,
        panels: contributions.panels.length,
        presetBundles: contributions.presetBundles.length,
        performanceMappings: contributions.performanceMappings.length,
        audioReactiveMappings: contributions.audioReactiveMappings.length,
        workspaceRegions: contributions.workspaceRegions.length,
        adapterDeclarations: contributions.adapterDeclarations.length,
      },
    };
  }

  return manager;
}

export type PluginManagerWithServices = PluginManager & {
  setServices(services: PluginManagerServices): void;
};
