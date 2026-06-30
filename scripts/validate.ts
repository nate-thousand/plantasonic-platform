/**
 * Validate — placeholder workspace validation interface
 *
 * Future: unified validation runner for platform + apps + templates
 */

export interface ValidateOptions {
  /** Validate specific package or app by name */
  target?: string;
  /** Include template placeholders */
  templates?: boolean;
  /** Include examples */
  examples?: boolean;
  /** Strict mode — warnings fail validation */
  strict?: boolean;
}

export interface ValidateResult {
  passed: boolean;
  checks: Array<{ id: string; passed: boolean; message: string }>;
}

/** Placeholder — not implemented. Use pnpm validate:reference and docs/VALIDATION_CHECKLIST.md */
export async function validate(_options: ValidateOptions = {}): Promise<ValidateResult> {
  throw new Error(
    'scripts/validate.ts is not implemented. See docs/VALIDATION_CHECKLIST.md',
  );
}
