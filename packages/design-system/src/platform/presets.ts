/**
 * Preset framework — versioning, categories, tags, sharing, import/export.
 */
import type { PresetRecord } from './types.ts';

export class PresetRegistry {
  #presets = new Map<string, PresetRecord>();

  register(preset: PresetRecord): this {
    this.#presets.set(preset.id, preset);
    return this;
  }

  get(id: string): PresetRecord | undefined {
    return this.#presets.get(id);
  }

  all(): PresetRecord[] {
    return [...this.#presets.values()];
  }

  favorites(): PresetRecord[] {
    return this.all().filter((p) => p.favorite);
  }

  byCategory(category: string): PresetRecord[] {
    return this.all().filter((p) => p.category === category);
  }

  byTag(tag: string): PresetRecord[] {
    return this.all().filter((p) => p.tags.includes(tag));
  }

  /** Export presets as portable JSON (cloud sync / share). */
  export(ids?: string[]): PresetRecord[] {
    if (!ids) return this.all();
    return ids.map((id) => this.get(id)).filter(Boolean) as PresetRecord[];
  }

  /** Import presets from portable JSON. */
  import(records: PresetRecord[], opts: { merge?: boolean } = {}): number {
    let count = 0;
    for (const p of records) {
      if (!opts.merge && this.#presets.has(p.id)) continue;
      this.register(p);
      count += 1;
    }
    return count;
  }
}

export const presetRegistry = new PresetRegistry();

export function definePreset(
  partial: Omit<PresetRecord, 'version' | 'tags'> & { version?: string; tags?: string[] },
): PresetRecord {
  const preset: PresetRecord = {
    version: partial.version ?? '1.0.0',
    tags: partial.tags ?? [],
    ...partial,
  };
  presetRegistry.register(preset);
  return preset;
}

/** Serialize presets for cloud sync or AI-generated preset handoff. */
export function exportPresets(ids?: string[]): string {
  return JSON.stringify(presetRegistry.export(ids), null, 2);
}

/** Import presets from JSON string. */
export function importPresets(json: string, merge = true): number {
  const records = JSON.parse(json) as PresetRecord[];
  return presetRegistry.import(records, { merge });
}
