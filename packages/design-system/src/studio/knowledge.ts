/**
 * Knowledge repository — shared architecture decisions, migrations, debt, principles.
 */
import type { KnowledgeEntry } from './types.ts';

export class KnowledgeRepository {
  #entries = new Map<string, KnowledgeEntry>();

  add(entry: Omit<KnowledgeEntry, 'createdAt'> & { createdAt?: string }): KnowledgeEntry {
    const record: KnowledgeEntry = {
      ...entry,
      createdAt: entry.createdAt ?? new Date().toISOString(),
    };
    this.#entries.set(record.id, record);
    return record;
  }

  get(id: string): KnowledgeEntry | undefined {
    return this.#entries.get(id);
  }

  all(): KnowledgeEntry[] {
    return [...this.#entries.values()];
  }

  byProject(projectId: string): KnowledgeEntry[] {
    return this.all().filter((e) => e.projectId === projectId);
  }

  byType(type: KnowledgeEntry['type']): KnowledgeEntry[] {
    return this.all().filter((e) => e.type === type);
  }

  byTag(tag: string): KnowledgeEntry[] {
    return this.all().filter((e) => e.tags.includes(tag));
  }

  search(query: string): KnowledgeEntry[] {
    const q = query.toLowerCase();
    return this.all().filter(
      (e) => e.title.toLowerCase().includes(q) || e.body.toLowerCase().includes(q) || e.tags.some((t) => t.includes(q)),
    );
  }
}

export const knowledgeRepository = new KnowledgeRepository();

/** Seed canonical design-system knowledge. */
function seedKnowledge(): void {
  if (knowledgeRepository.all().length > 0) return;
  knowledgeRepository.add({
    id: 'principle.token-first',
    type: 'principle',
    title: 'Token-first styling',
    body: 'All colors, spacing, and motion must use design-system tokens — never hardcoded values.',
    tags: ['tokens', 'design-system'],
  });
  knowledgeRepository.add({
    id: 'principle.lightweight-client',
    type: 'principle',
    title: 'Lightweight platform clients',
    body: 'Applications install engines and consume platform services — they never embed or duplicate infrastructure.',
    tags: ['platform', 'architecture'],
  });
  knowledgeRepository.add({
    id: 'practice.spec-authoritative',
    type: 'practice',
    title: 'project.json is authoritative',
    body: 'Every project must be reproducible from project.json via orchestrateProject().',
    tags: ['studio', 'specification'],
  });
}

seedKnowledge();

export function recordDecision(input: {
  id: string;
  title: string;
  body: string;
  projectId?: string;
  tags?: string[];
}): KnowledgeEntry {
  const entry: Omit<KnowledgeEntry, 'createdAt'> = {
    id: input.id,
    type: 'decision',
    title: input.title,
    body: input.body,
    tags: input.tags ?? [],
  };
  if (input.projectId) entry.projectId = input.projectId;
  return knowledgeRepository.add(entry);
}

export function recordTechnicalDebt(input: {
  id: string;
  title: string;
  body: string;
  projectId?: string;
}): KnowledgeEntry {
  const entry: Omit<KnowledgeEntry, 'createdAt'> = {
    id: input.id,
    type: 'debt',
    title: input.title,
    body: input.body,
    tags: ['debt'],
  };
  if (input.projectId) entry.projectId = input.projectId;
  return knowledgeRepository.add(entry);
}

export function exportKnowledge(): KnowledgeEntry[] {
  return knowledgeRepository.all();
}
