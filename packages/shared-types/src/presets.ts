/**
 * Legacy flat preset entry for the basic preset registry.
 * Prefer {@link PresetBundle} from presetBundles.ts for unified bundles.
 */
export interface Preset {
  /** Unique preset identifier */
  id: string;
  /** Display name */
  name: string;
  /** Optional description */
  description?: string;
  /** Tags for filtering in the preset browser */
  tags?: string[];
  /** Engine-specific preset data (opaque to the platform) */
  data: Record<string, unknown>;
}

/**
 * Legacy collection of flat presets grouped for the basic registry.
 * Prefer {@link PresetBundle} for unified cross-engine bundles.
 */
export interface PresetCollection {
  /** Collection identifier */
  id: string;
  /** Display name */
  name: string;
  /** Presets contained in this collection */
  presets: Preset[];
}

/** Contract for the legacy flat preset registry */
export interface PresetRegistry {
  /** Register a preset collection */
  registerBundle(collection: PresetCollection): void;
  /** Look up a preset by id across all collections */
  getPreset(id: string): Preset | undefined;
  /** List all registered presets */
  listPresets(): Preset[];
  /** Apply a preset — emits events for engines to consume (placeholder) */
  applyPreset(id: string): void;
}
