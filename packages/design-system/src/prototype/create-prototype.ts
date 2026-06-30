/**
 * Prototype Platform SDK — createPrototype().
 */
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { CreatePrototypeConfig, CreatePrototypeResult } from './types.ts';
import { resolvePrototypePlan, planFromBrief } from './spec-parser.ts';
import { generatePrototypeFiles } from './generate.ts';
import { validateGeneratedFiles } from './validate.ts';

export interface WritePrototypeOptions {
  /** Target directory (created if missing). Must not exist unless `force`. */
  dir: string;
  force?: boolean;
  /** Run validation before writing; throws if validation fails. */
  validate?: boolean;
}

/** High-level API — resolve config, generate files, optionally write to disk. */
export function createPrototype(config: CreatePrototypeConfig): CreatePrototypeResult {
  const plan = resolvePrototypePlan(config);
  const result = generatePrototypeFiles(plan);

  if (config.documentation !== false) {
    const validation = validateGeneratedFiles(result.files);
    if (!validation.ok) {
      const failed = validation.checks.filter((c) => !c.ok).map((c) => c.label);
      throw new Error(`Generated prototype failed validation: ${failed.join(', ')}`);
    }
  }

  return result;
}

/** Create a prototype from a written brief (infers type from keywords). */
export function createPrototypeFromBrief(brief: string, name: string): CreatePrototypeResult {
  const plan = planFromBrief(brief, name);
  return generatePrototypeFiles(plan);
}

/** Write generated files to a directory. */
export function writePrototype(result: CreatePrototypeResult, options: WritePrototypeOptions): string {
  const { dir, force = false } = options;

  if (existsSync(dir) && !force) {
    throw new Error(`Target already exists: ${dir}`);
  }

  if (options.validate !== false) {
    const report = validateGeneratedFiles(result.files);
    if (!report.ok) {
      throw new Error(`Prototype validation failed: ${report.checks.filter((c) => !c.ok).map((c) => c.label).join(', ')}`);
    }
  }

  for (const file of result.files) {
    const target = join(dir, file.path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, file.content, 'utf8');
  }

  return dir;
}

/** One-shot: create + write. */
export function scaffoldPrototype(config: CreatePrototypeConfig, dir: string): CreatePrototypeResult {
  const result = createPrototype(config);
  writePrototype(result, { dir });
  return result;
}

/** One-shot from brief. */
export function scaffoldPrototypeFromBrief(brief: string, name: string, dir: string): CreatePrototypeResult {
  const result = createPrototypeFromBrief(brief, name);
  writePrototype(result, { dir });
  return result;
}
