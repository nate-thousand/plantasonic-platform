/**
 * Ecosystem Plugin Framework — extends AI plugins with panels, renderers,
 * effects, presets, workflows, and validation rules. Installable without
 * modifying core source.
 */
import type { Plugin, PluginContributions, PluginHost } from '../ai/plugin.ts';
import { createPluginHost as createAiPluginHost } from '../ai/plugin.ts';
import type { PresetRecord } from './types.ts';
import type { WorkflowSpec } from './types.ts';
import { WORKFLOW_CATALOG } from './workflows.ts';
import type { RuleId } from '../ai/validate.ts';

export interface PanelContribution {
  id: string;
  title: string;
  render: string;
  description?: string;
}

export interface RendererContribution {
  id: string;
  name: string;
  adapter: string;
  description?: string;
}

export interface EffectContribution {
  id: string;
  name: string;
  category: string;
}

export interface ValidationRuleContribution {
  id: string;
  rule: RuleId | string;
  severity: 'error' | 'warning';
  description: string;
}

export interface EcosystemContributions extends PluginContributions {
  panels?: PanelContribution[];
  renderers?: RendererContribution[];
  effects?: EffectContribution[];
  presets?: PresetRecord[];
  workflows?: WorkflowSpec[];
  validationRules?: ValidationRuleContribution[];
}

export interface EcosystemPlugin extends Omit<Plugin, 'contributes'> {
  contributes: EcosystemContributions;
}

export interface EcosystemPluginHost extends PluginHost {
  panels: PanelContribution[];
  renderers: RendererContribution[];
  effects: EffectContribution[];
  presets: PresetRecord[];
  workflows: WorkflowSpec[];
  validationRules: ValidationRuleContribution[];
  ecosystemPlugins: EcosystemPlugin[];
  useEcosystem(plugin: EcosystemPlugin): EcosystemPluginHost;
}

export function defineEcosystemPlugin(plugin: EcosystemPlugin): EcosystemPlugin {
  return plugin;
}

/** Create an ecosystem plugin host (wraps AI plugin host + ecosystem contributions). */
export function createEcosystemPluginHost(): EcosystemPluginHost {
  const aiHost = createAiPluginHost();
  const host: EcosystemPluginHost = {
    ...aiHost,
    panels: [],
    renderers: [],
    effects: [],
    presets: [],
    workflows: [...WORKFLOW_CATALOG],
    validationRules: [],
    ecosystemPlugins: [],
    use(plugin: Plugin) {
      aiHost.use(plugin);
      return host;
    },
    useEcosystem(plugin: EcosystemPlugin) {
      for (const dep of plugin.dependsOn ?? []) {
        const ok =
          host.ecosystemPlugins.some((p) => p.name === dep) || host.plugins.some((p) => p.name === dep);
        if (!ok) throw new Error(`Ecosystem plugin "${plugin.name}" requires "${dep}" first.`);
      }
      host.use(plugin);
      host.panels.push(...(plugin.contributes.panels ?? []));
      host.renderers.push(...(plugin.contributes.renderers ?? []));
      host.effects.push(...(plugin.contributes.effects ?? []));
      host.presets.push(...(plugin.contributes.presets ?? []));
      host.workflows.push(...(plugin.contributes.workflows ?? []));
      host.validationRules.push(...(plugin.contributes.validationRules ?? []));
      host.ecosystemPlugins.push(plugin);
      return host;
    },
  };
  return host;
}

/** Install a plugin into a project manifest (returns updated plugin id list). */
export function installPlugin(manifest: { plugins: string[] }, pluginName: string): string[] {
  if (manifest.plugins.includes(pluginName)) return manifest.plugins;
  return [...manifest.plugins, pluginName];
}
