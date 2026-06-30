/**
 * Plantasonic Design System — Registry & Knowledge Graph.
 *
 * The searchable source of truth. Every component, primitive, layout, pattern,
 * token, and theme registers itself here so applications and AI tools discover
 * capabilities through the registry instead of the filesystem. The registry
 * also derives a knowledge graph (relationships between elements) to power
 * impact analysis before changes.
 */
import type {
  AnyMetadata,
  ComponentMetadata,
  ElementKind,
  LayoutMetadata,
  PatternMetadata,
  Status,
  ThemeMetadata,
  TokenMetadata,
} from './metadata.ts';
import { ALL_COMPONENT_METADATA } from './components.ts';
import { LAYOUT_METADATA } from './layouts.ts';
import { PATTERN_METADATA } from './patterns.ts';
import { TOKEN_METADATA, THEME_METADATA } from './tokens.generated.ts';

export interface RegistryQuery {
  kind?: ElementKind | ElementKind[];
  category?: string;
  status?: Status;
  tag?: string;
  /** Free-text match against id, name, purpose, tags. */
  text?: string;
}

/** A directed relationship between two registered elements. */
export interface GraphEdge {
  from: string;
  to: string;
  type: 'depends-on' | 'composed-of' | 'used-in-layout' | 'fits-layout' | 'uses-token' | 'themes';
}

export interface KnowledgeGraph {
  nodes: Array<{ id: string; kind: ElementKind; name: string }>;
  edges: GraphEdge[];
}

export interface ImpactReport {
  id: string;
  /** Elements that directly reference the target. */
  directDependents: string[];
  /** Elements that reference the target transitively. */
  transitiveDependents: string[];
}

export class Registry {
  #byId = new Map<string, AnyMetadata>();

  constructor(records: AnyMetadata[] = []) {
    for (const record of records) this.add(record);
  }

  /** Register (or overwrite) a metadata record. */
  add(record: AnyMetadata): this {
    this.#byId.set(record.id, record);
    return this;
  }

  /** Register many records. */
  addAll(records: AnyMetadata[]): this {
    for (const record of records) this.add(record);
    return this;
  }

  /** Look up a single record by id. */
  get(id: string): AnyMetadata | undefined {
    return this.#byId.get(id);
  }

  has(id: string): boolean {
    return this.#byId.has(id);
  }

  /** All records. */
  all(): AnyMetadata[] {
    return [...this.#byId.values()];
  }

  /** Filtered query across all records. */
  query(q: RegistryQuery = {}): AnyMetadata[] {
    const kinds = q.kind ? (Array.isArray(q.kind) ? q.kind : [q.kind]) : null;
    const text = q.text?.toLowerCase();
    return this.all().filter((r) => {
      if (kinds && !kinds.includes(r.kind)) return false;
      if (q.category && r.category !== q.category) return false;
      if (q.status && r.status !== q.status) return false;
      if (q.tag && !(r.tags ?? []).includes(q.tag)) return false;
      if (text) {
        const haystack = [r.id, r.name, r.purpose, ...(r.tags ?? [])].join(' ').toLowerCase();
        if (!haystack.includes(text)) return false;
      }
      return true;
    });
  }

  components(): ComponentMetadata[] {
    return this.query({ kind: ['component', 'primitive'] }) as ComponentMetadata[];
  }

  layouts(): LayoutMetadata[] {
    return this.query({ kind: 'layout' }) as LayoutMetadata[];
  }

  patterns(): PatternMetadata[] {
    return this.query({ kind: 'pattern' }) as PatternMetadata[];
  }

  tokens(): TokenMetadata[] {
    return this.query({ kind: 'token' }) as TokenMetadata[];
  }

  themes(): ThemeMetadata[] {
    return this.query({ kind: 'theme' }) as ThemeMetadata[];
  }

  /** Distinct categories present, optionally scoped to a kind. */
  categories(kind?: ElementKind): string[] {
    const records = kind ? this.query({ kind }) : this.all();
    return [...new Set(records.map((r) => r.category))].sort();
  }

  /** All deprecated records. */
  deprecated(): AnyMetadata[] {
    return this.all().filter((r) => r.status === 'deprecated' || (r as TokenMetadata).deprecated === true);
  }

  /** Build the knowledge graph from explicit metadata relationships. */
  knowledgeGraph(): KnowledgeGraph {
    const nodes = this.all().map((r) => ({ id: r.id, kind: r.kind, name: r.name }));
    const edges: GraphEdge[] = [];
    const tokenByCssVar = new Map<string, string>();
    for (const t of this.tokens()) tokenByCssVar.set(t.cssVar, t.id);

    const push = (from: string, to: string, type: GraphEdge['type']) => {
      if (from === to) return;
      if (!this.#byId.has(to)) return;
      edges.push({ from, to, type });
    };

    for (const r of this.all()) {
      for (const dep of (r.dependencies ?? [])) push(r.id, dep, 'depends-on');

      if (r.kind === 'component' || r.kind === 'primitive') {
        const c = r as ComponentMetadata;
        for (const layoutId of (c.supportedLayouts ?? [])) {
          if (layoutId === '*') continue;
          push(layoutId, c.id, 'used-in-layout');
        }
      }
      if (r.kind === 'layout') {
        const l = r as LayoutMetadata;
        for (const id of (l.supportedComponents ?? [])) {
          if (id === '*' || id.endsWith('.*')) continue;
          push(l.id, id, 'used-in-layout');
        }
        for (const id of (l.recommendedPatterns ?? [])) push(l.id, id, 'composed-of');
      }
      if (r.kind === 'pattern') {
        const p = r as PatternMetadata;
        for (const id of (p.composedOf ?? [])) push(p.id, id, 'composed-of');
        for (const id of (p.supportedLayouts ?? [])) {
          if (id === '*') continue;
          push(p.id, id, 'fits-layout');
        }
      }
      if (r.kind === 'theme') {
        const t = r as ThemeMetadata;
        for (const tok of this.tokens()) {
          if ((tok.values as Record<string, unknown>)[t.id.replace('theme.', '')] !== undefined) {
            push(t.id, tok.id, 'themes');
          }
        }
      }
      // Token usage referenced via motion tokens (CSS vars).
      const motionTokens = (r as ComponentMetadata).motion?.tokens ?? [];
      for (const cssVar of motionTokens) {
        const tokenId = tokenByCssVar.get(cssVar);
        if (tokenId) push(r.id, tokenId, 'uses-token');
      }
    }
    return { nodes, edges };
  }

  /** Find what would be impacted by changing `id` (reverse dependents). */
  impactOf(id: string): ImpactReport {
    const { edges } = this.knowledgeGraph();
    const reverse = new Map<string, Set<string>>();
    for (const e of edges) {
      if (!reverse.has(e.to)) reverse.set(e.to, new Set());
      reverse.get(e.to)!.add(e.from);
    }
    const direct = [...(reverse.get(id) ?? [])];
    const seen = new Set<string>();
    const stack = [...direct];
    while (stack.length) {
      const next = stack.pop()!;
      if (seen.has(next)) continue;
      seen.add(next);
      for (const dep of reverse.get(next) ?? []) stack.push(dep);
    }
    return {
      id,
      directDependents: direct.sort(),
      transitiveDependents: [...seen].sort(),
    };
  }

  /** Summary counts for architecture exports. */
  summary(): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const r of this.all()) counts[r.kind] = (counts[r.kind] ?? 0) + 1;
    counts.total = this.#byId.size;
    return counts;
  }
}

/** The default registry, populated with everything the Design System ships. */
export function createDefaultRegistry(): Registry {
  return new Registry([
    ...ALL_COMPONENT_METADATA,
    ...LAYOUT_METADATA,
    ...PATTERN_METADATA,
    ...TOKEN_METADATA,
    ...THEME_METADATA,
  ]);
}

/** Shared singleton registry. */
export const registry: Registry = createDefaultRegistry();
