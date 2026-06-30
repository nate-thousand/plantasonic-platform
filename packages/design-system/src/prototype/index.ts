/**
 * Plantasonic Design System — Prototype Platform.
 *
 * Generate prototypes that automatically inherit the Design System: tokens,
 * theme, layout, components, motion, accessibility, documentation, validation,
 * and deployment setup.
 *
 *   import { createPrototype, scaffoldPrototype } from 'plantasonic-design-system/prototype';
 *
 *   const { plan, files } = createPrototype({
 *     type: 'audio-reactive-installation',
 *     name: 'Bloom Room',
 *     layout: 'layout.instrument',
 *     sound: true,
 *     midi: true,
 *     touch: true,
 *   });
 */

export type {
  PrototypeType,
  PrototypeRenderer,
  PrototypeLayoutId,
  ShellVariant,
  CreatePrototypeConfig,
  PrototypePlan,
  PrototypePanelSpec,
  PrototypeEngineSpec,
  PrototypeTypeSpec,
  GeneratedPrototypeFile,
  CreatePrototypeResult,
  PrototypeValidationReport,
  PrototypeValidationCheck,
} from './types.ts';

export {
  PROTOTYPE_TYPES,
  PROTOTYPE_TYPE_IDS,
  getPrototypeTypeSpec,
  isPrototypeType,
} from './catalog.ts';

export { parseBrief, resolvePrototypePlan, planFromBrief } from './spec-parser.ts';

export { generatePrototypeFiles } from './generate.ts';

export {
  createPrototype,
  createPrototypeFromBrief,
  writePrototype,
  scaffoldPrototype,
  scaffoldPrototypeFromBrief,
  type WritePrototypeOptions,
} from './create-prototype.ts';

export {
  validatePrototype,
  validatePrototypeStructure,
  validateGeneratedFiles,
} from './validate.ts';
