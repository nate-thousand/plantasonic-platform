import type {
  Preset,
  PresetCollection,
  PresetRegistry,
} from '@plantasonic/platform-types';

import type { PlatformEventBus } from '@plantasonic/platform-types';

/** Options for creating a preset registry */
export interface PresetRegistryOptions {
  eventBus?: PlatformEventBus;
  source?: string;
}

/**
 * Create a preset registry for managing and applying presets across engines.
 * Placeholder — real implementation will route preset data to engine adapters.
 */
export function createPresetRegistry(
  options: PresetRegistryOptions = {},
): PresetRegistry {
  const { eventBus, source = 'platform' } = options;
  const presets = new Map<string, Preset>();

  return {
    registerBundle(collection: PresetCollection): void {
      for (const preset of collection.presets) {
        presets.set(preset.id, preset);
      }

      eventBus?.emit({
        type: 'preset.bundle.registered',
        timestamp: new Date().toISOString(),
        source,
        payload: { bundleId: collection.id, count: collection.presets.length },
      });
    },

    getPreset(id: string): Preset | undefined {
      return presets.get(id);
    },

    listPresets(): Preset[] {
      return Array.from(presets.values());
    },

    applyPreset(id: string): void {
      const preset = presets.get(id);
      if (!preset) {
        console.warn(`[platform] Preset not found: ${id}`);
        return;
      }

      eventBus?.emit({
        type: 'preset.applied',
        timestamp: new Date().toISOString(),
        source,
        payload: { presetId: id, preset },
      });
    },
  };
}
