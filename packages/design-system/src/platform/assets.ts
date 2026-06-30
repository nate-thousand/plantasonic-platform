/**
 * Centralized asset management — apps reference shared assets, never duplicate.
 */
import type { AssetKind, AssetRef } from './types.ts';

export class AssetRegistry {
  #assets = new Map<string, AssetRef>();

  register(asset: AssetRef): this {
    this.#assets.set(asset.id, asset);
    return this;
  }

  get(id: string): AssetRef | undefined {
    return this.#assets.get(id);
  }

  all(): AssetRef[] {
    return [...this.#assets.values()];
  }

  byKind(kind: AssetKind): AssetRef[] {
    return this.all().filter((a) => a.kind === kind);
  }

  query(opts: { kind?: AssetKind; tag?: string; text?: string } = {}): AssetRef[] {
    const text = opts.text?.toLowerCase();
    return this.all().filter((a) => {
      if (opts.kind && a.kind !== opts.kind) return false;
      if (opts.tag && !(a.tags ?? []).includes(opts.tag)) return false;
      if (text) {
        const hay = [a.id, a.name, ...(a.tags ?? [])].join(' ').toLowerCase();
        if (!hay.includes(text)) return false;
      }
      return true;
    });
  }
}

export const assetRegistry = new AssetRegistry();

/** Register an asset in the shared registry. */
export function registerAsset(asset: AssetRef): AssetRef {
  assetRegistry.register(asset);
  return asset;
}

/** Create a typed asset reference with stable id. */
export function defineAsset(
  kind: AssetKind,
  name: string,
  uri: string,
  opts: Partial<Omit<AssetRef, 'id' | 'kind' | 'name' | 'uri'>> = {},
): AssetRef {
  const id = `asset.${kind}.${name.toLowerCase().replace(/\s+/g, '-')}`;
  return registerAsset({ id, kind, name, uri, ...opts });
}
