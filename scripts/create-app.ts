/**
 * Create App — TypeScript interface for the unified app generator.
 *
 * Implementation: packages/create-plantasonic-app/lib/create-app.mjs
 *
 * CLI:
 *   pnpm plantasonic create <prototype-type> <app-slug>
 *   pnpm create:app <app-slug> [--type instrument]
 */

export interface CreateAppOptions {
  /** kebab-case app slug */
  slug: string;
  /** Prototype type from templates/ */
  prototypeType:
    | 'instrument'
    | 'audio-reactive'
    | 'generative-art'
    | 'installation'
    | 'visual-synth'
    | 'portfolio-demo'
    | 'research';
  /** Display name */
  name?: string;
  /** Vite dev port */
  port?: number;
  /** Output directory (default: apps/<slug>) */
  output?: string;
  /** Overwrite existing directory */
  force?: boolean;
}

export interface CreateAppResult {
  success: boolean;
  outputPath: string;
  packageName: string;
  prototypeType: string;
  warnings: string[];
}

/** Implemented types available today */
export const ACTIVE_PROTOTYPE_TYPES = ['instrument', 'audio-reactive'] as const;

/**
 * Delegates to the Node generator. Run via CLI rather than importing at runtime.
 *
 * @example
 * pnpm plantasonic create audio-reactive my-app
 */
export async function createApp(_options: CreateAppOptions): Promise<CreateAppResult> {
  throw new Error(
    'Use the CLI: pnpm plantasonic create <prototype-type> <app-slug>\n' +
      'Legacy: pnpm create:app <slug> [--type instrument]',
  );
}
