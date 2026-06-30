/**
 * Generate Docs — placeholder documentation generator interface
 *
 * Future: cross-link docs, generate API index, sync PACKAGE_RESPONSIBILITIES
 */

export interface GenerateDocsOptions {
  /** Output directory (default: docs/) */
  outputDir?: string;
  /** Regenerate SDK reference from packages/sdk exports */
  sdk?: boolean;
  /** Update cross-reference index */
  index?: boolean;
}

export interface GenerateDocsResult {
  filesWritten: string[];
  warnings: string[];
}

/** Placeholder — not implemented */
export async function generateDocs(
  _options: GenerateDocsOptions = {},
): Promise<GenerateDocsResult> {
  throw new Error('scripts/generate-docs.ts is not implemented.');
}
