/**
 * Concept templates — app identity layer for the Prototype Generator.
 * Prototype type = technical setup; concept = branding, presets, copy, direction.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const CONCEPTS_ROOT = path.join(path.resolve(__dirname, '..'), 'concepts');

/** @type {Record<string, ConceptDefinition>} */
export const CONCEPT_TEMPLATES = {
  plantasonic: {
    id: 'plantasonic',
    name: 'Plantasonic',
    tagline: 'Generative audio-visual flora',
    description:
      'Generative audio-visual flora — rebuilt as a thin consumer of @plantasonic/platform.',
    presetBrowserLabel: 'Plantasonic Presets',
    defaultTempo: 68,
    themeIntent: 'dark',
    visualDirection:
      'Organic ASCII flora, earthy palettes, subharmonic motion, generative botanical forms.',
    soundDirection:
      'Ecological synthesis, roots and bloom, ambient mycelium networks, experimental mutation.',
    forbiddenTerms: ['Signal 9', 'Revolution is broadcast', 'broadcast resistance'],
    allowedTerms: ['Plantasonic', 'Seed', 'Root', 'Bloom', 'Mycelium', 'Mutation', 'flora'],
  },
  flowers: {
    id: 'flowers',
    name: 'Flowers',
    tagline: 'Grow sound into light.',
    description: 'Audio-reactive botanical visual instrument.',
    presetBrowserLabel: 'Flowers Presets',
    defaultTempo: 72,
    themeIntent: 'dark',
    visualDirection:
      'Organic growth, petals, soft motion, generative botanical forms.',
    soundDirection:
      'Ambient tones, soft pulses, harmonic bloom, organic modulation.',
    forbiddenTerms: [
      'Signal 9',
      'Plantasonic',
      'Revolution is broadcast',
      'broadcast resistance',
      'cyberpunk',
      'CRT',
      'Mycelium',
      'Mutation',
    ],
    allowedTerms: ['Seed', 'Stem', 'Petal', 'Bloom', 'Pollinate', 'Flowers'],
  },
};

/**
 * @typedef {Object} ConceptDefinition
 * @property {string} id
 * @property {string} name
 * @property {string} tagline
 * @property {string} description
 * @property {string} presetBrowserLabel
 * @property {number} defaultTempo
 * @property {string} themeIntent
 * @property {string} visualDirection
 * @property {string} soundDirection
 * @property {string[]} [forbiddenTerms]
 * @property {string[]} [allowedTerms]
 */

export function listConceptTemplates() {
  return Object.values(CONCEPT_TEMPLATES);
}

export function resolveConcept(conceptId) {
  const concept = CONCEPT_TEMPLATES[conceptId];
  if (!concept) {
    const available = Object.keys(CONCEPT_TEMPLATES).join(', ');
    throw new Error(`Unknown concept template "${conceptId}". Available: ${available}`);
  }
  const overlayRoot = path.join(CONCEPTS_ROOT, conceptId, 'overlay');
  if (!existsSync(overlayRoot)) {
    throw new Error(`Concept overlay not found: ${overlayRoot}`);
  }
  return { ...concept, overlayRoot };
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

/** List overlay files relative to overlay root */
export function listConceptOverlayFiles(overlayRoot) {
  return walkFiles(overlayRoot);
}

export function buildConceptVars(concept, appVars) {
  return {
    ...appVars,
    CONCEPT_ID: concept.id,
    APP_NAME: appVars.APP_NAME ?? concept.name,
    APP_TITLE: appVars.APP_TITLE ?? concept.name,
    APP_TAGLINE: concept.tagline,
    APP_DESCRIPTION: concept.description,
    PRESET_BROWSER_LABEL: concept.presetBrowserLabel,
    DEFAULT_TEMPO: String(concept.defaultTempo),
    THEME_INTENT: concept.themeIntent,
    VISUAL_DIRECTION: concept.visualDirection,
    SOUND_DIRECTION: concept.soundDirection,
    CONCEPT_ABOUT: `${concept.description} Visual: ${concept.visualDirection} Sound: ${concept.soundDirection}`,
  };
}

export function buildConceptMeta(concept) {
  return {
    conceptId: concept.id,
    name: concept.name,
    tagline: concept.tagline,
    forbiddenTerms: concept.forbiddenTerms ?? [],
    allowedTerms: concept.allowedTerms ?? [],
  };
}
