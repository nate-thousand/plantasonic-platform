/**
 * Application Blueprints — data-driven identity and startup experience for the Prototype Generator.
 * Blueprints extend concept templates with workspace, HUD, theme, scenes, assets, and preset catalogs.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const BLUEPRINTS_ROOT = path.join(path.resolve(__dirname, '..'), 'blueprints');

/** Legacy concept ids that resolve to a blueprint */
export const BLUEPRINT_ALIASES = {
  'signal-9-live': 'signal-9',
};

/**
 * @typedef {Object} BlueprintDefinition
 * @property {string} id
 * @property {string} version
 * @property {Object} identity
 * @property {Object} startupWorkspace
 * @property {Object[]} startupPresets
 * @property {Object} startupVisualScene
 * @property {Object} startupSoundScene
 * @property {Object} hud
 * @property {Object} theme
 * @property {Object} assets
 * @property {Object} generator
 */

export function listBlueprints() {
  if (!existsSync(BLUEPRINTS_ROOT)) return [];
  return readdirSync(BLUEPRINTS_ROOT).filter((name) => {
    const blueprintPath = path.join(BLUEPRINTS_ROOT, name, 'blueprint.json');
    return existsSync(blueprintPath);
  });
}

export function resolveBlueprintId(id) {
  return BLUEPRINT_ALIASES[id] ?? id;
}

export function resolveBlueprint(blueprintId) {
  const id = resolveBlueprintId(blueprintId);
  const blueprintRoot = path.join(BLUEPRINTS_ROOT, id);
  const blueprintJsonPath = path.join(BLUEPRINTS_ROOT, id, 'blueprint.json');

  if (!existsSync(blueprintJsonPath)) {
    return null;
  }

  const definition = JSON.parse(readFileSync(blueprintJsonPath, 'utf8'));
  const overlayRoot = path.join(blueprintRoot, 'overlay');

  if (!existsSync(overlayRoot)) {
    throw new Error(`Blueprint overlay not found: ${overlayRoot}`);
  }

  return {
    ...definition,
    id,
    blueprintRoot,
    overlayRoot,
  };
}

function walkFiles(dir, base = dir) {
  const files = [];
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) {
      files.push(...walkFiles(full, base));
    } else {
      files.push(path.relative(base, full));
    }
  }
  return files;
}

export function listBlueprintOverlayFiles(overlayRoot) {
  return walkFiles(overlayRoot);
}

export function buildBlueprintVars(blueprint, appVars) {
  const gen = blueprint.generator ?? {};
  const identity = blueprint.identity ?? {};

  return {
    ...appVars,
    BLUEPRINT_ID: blueprint.id,
    CONCEPT_ID: blueprint.id,
    APP_NAME: appVars.APP_NAME ?? identity.name ?? blueprint.id,
    APP_TITLE: appVars.APP_TITLE ?? identity.name ?? blueprint.id,
    APP_TAGLINE: identity.tagline ?? '',
    APP_DESCRIPTION: identity.description ?? '',
    PRESET_BROWSER_LABEL: gen.presetBrowserLabel ?? `${identity.name ?? blueprint.id} Presets`,
    DEFAULT_TEMPO: String(gen.defaultTempo ?? 72),
    THEME_INTENT: gen.themeIntent ?? 'dark',
    VISUAL_DIRECTION: gen.visualDirection ?? '',
    SOUND_DIRECTION: gen.soundDirection ?? '',
    CONCEPT_ABOUT: `${identity.description ?? ''} Visual: ${gen.visualDirection ?? ''} Sound: ${gen.soundDirection ?? ''}`,
  };
}

export function buildBlueprintMeta(blueprint) {
  const gen = blueprint.generator ?? {};
  const identity = blueprint.identity ?? {};

  return {
    blueprintId: blueprint.id,
    blueprintVersion: blueprint.version ?? '1.0.0',
    conceptId: blueprint.id,
    name: identity.name ?? blueprint.id,
    tagline: identity.tagline ?? '',
    forbiddenTerms: gen.forbiddenTerms ?? [],
    allowedTerms: gen.allowedTerms ?? [],
  };
}
