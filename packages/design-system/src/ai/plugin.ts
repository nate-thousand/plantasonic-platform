/**
 * Plantasonic Design System — Plugin architecture.
 *
 * Plugins extend the Design System without modifying core source. A plugin
 * contributes metadata (components, layouts, patterns, themes, tokens),
 * commands, documentation, and AI integrations. Plugins are applied to a
 * {@link Registry}, keeping the core registry pure and composable.
 */
import type {
  AnyMetadata,
  ComponentMetadata,
  LayoutMetadata,
  PatternMetadata,
  ThemeMetadata,
  TokenMetadata,
} from './metadata.ts';
import { Registry, createDefaultRegistry } from './registry.ts';

export interface PluginCommand {
  id: string;
  label: string;
  group?: string;
  shortcut?: string;
  run?: (...args: unknown[]) => unknown;
}

export interface PluginDocumentation {
  id: string;
  title: string;
  /** Markdown body or a path/URL to the document. */
  content: string;
}

export interface PluginAIIntegration {
  id: string;
  /** What the integration provides (e.g. prompt pack, MCP tool, generator). */
  kind: 'prompt' | 'mcp-tool' | 'generator' | 'context';
  description: string;
}

export interface PluginContributions {
  components?: ComponentMetadata[];
  layouts?: LayoutMetadata[];
  patterns?: PatternMetadata[];
  themes?: ThemeMetadata[];
  tokens?: TokenMetadata[];
  commands?: PluginCommand[];
  documentation?: PluginDocumentation[];
  ai?: PluginAIIntegration[];
}

export interface Plugin {
  name: string;
  version: string;
  description?: string;
  /** Plugin ids this plugin requires to be installed first. */
  dependsOn?: string[];
  contributes: PluginContributions;
  /** Optional hook run after contributions are registered. */
  setup?: (registry: Registry) => void;
}

/** Identity helper for authoring a type-checked plugin. */
export function definePlugin(plugin: Plugin): Plugin {
  return plugin;
}

function metadataContributions(p: PluginContributions): AnyMetadata[] {
  return [
    ...(p.components ?? []),
    ...(p.layouts ?? []),
    ...(p.patterns ?? []),
    ...(p.themes ?? []),
    ...(p.tokens ?? []),
  ];
}

export interface PluginHost {
  registry: Registry;
  commands: PluginCommand[];
  documentation: PluginDocumentation[];
  ai: PluginAIIntegration[];
  plugins: Plugin[];
  use(plugin: Plugin): PluginHost;
}

/**
 * Create a plugin host seeded with the default registry. Apply plugins with
 * `.use()`; contributions are merged into the host registry and collections.
 *
 * @example
 * const host = createPluginHost().use(myPlugin);
 * host.registry.components(); // includes plugin components
 */
export function createPluginHost(registry: Registry = createDefaultRegistry()): PluginHost {
  const host: PluginHost = {
    registry,
    commands: [],
    documentation: [],
    ai: [],
    plugins: [],
    use(plugin: Plugin) {
      for (const dep of plugin.dependsOn ?? []) {
        if (!host.plugins.some((p) => p.name === dep)) {
          throw new Error(`Plugin "${plugin.name}" requires "${dep}" to be installed first.`);
        }
      }
      host.registry.addAll(metadataContributions(plugin.contributes));
      host.commands.push(...(plugin.contributes.commands ?? []));
      host.documentation.push(...(plugin.contributes.documentation ?? []));
      host.ai.push(...(plugin.contributes.ai ?? []));
      host.plugins.push(plugin);
      plugin.setup?.(host.registry);
      return host;
    },
  };
  return host;
}
