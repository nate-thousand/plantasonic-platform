/**
 * Create App — TypeScript interface for the unified app generator.
 *
 * Implementation: packages/create-plantasonic-app/lib/create-app.mjs
 *
 * CLI:
 *   pnpm plantasonic create <prototype-type> <app-slug> --concept <blueprint-or-concept-id>
 */

export interface CreateAppOptions {
  slug: string;
  prototypeType: 'instrument' | 'audio-reactive' | 'visual-synth' | 'generative-art' | 'installation' | 'portfolio-demo' | 'research';
  /** Blueprint or concept template id — controls app identity and startup experience */
  concept?: 'signal-9' | 'plantasonic' | 'flowers';
  name?: string;
  port?: number;
  output?: string;
  force?: boolean;
}

export interface CreateAppResult {
  success: boolean;
  outputPath: string;
  packageName: string;
  prototypeType: string;
  conceptId?: string;
  blueprintId?: string;
  warnings: string[];
}

export const ACTIVE_PROTOTYPE_TYPES = ['instrument', 'audio-reactive', 'visual-synth'] as const;
export const ACTIVE_BLUEPRINTS = ['signal-9'] as const;
export const ACTIVE_CONCEPT_TEMPLATES = ['plantasonic', 'flowers'] as const;

export async function createApp(_options: CreateAppOptions): Promise<CreateAppResult> {
  throw new Error(
    'Use the CLI: pnpm plantasonic create <prototype-type> <app-slug> --concept <id>\n' +
      'Legacy: pnpm create:app <slug> [--type instrument] [--concept plantasonic]',
  );
}
