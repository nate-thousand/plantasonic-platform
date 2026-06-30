/**
 * Release — placeholder release orchestration interface
 *
 * Future: version bump, changelog, tag, publish prep
 */

export interface ReleaseOptions {
  /** Semver target version */
  version: string;
  /** Packages to include in release */
  packages?: string[];
  /** Dry run — no file writes */
  dryRun?: boolean;
}

export interface ReleaseResult {
  success: boolean;
  version: string;
  notes: string[];
}

/** Placeholder — not implemented */
export async function release(_options: ReleaseOptions): Promise<ReleaseResult> {
  throw new Error('scripts/release.ts is not implemented.');
}
