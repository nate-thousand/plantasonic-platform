/**
 * Audit — placeholder ecosystem audit interface
 *
 * Future: dependency boundary checks, duplication detection, thin-app audit
 */

export interface AuditOptions {
  /** Audit application repos (paths) */
  apps?: string[];
  /** Check for duplicated DS/engine code */
  duplication?: boolean;
  /** Verify dependency rules from ARCHITECTURE.md */
  boundaries?: boolean;
}

export interface AuditFinding {
  severity: 'error' | 'warning' | 'info';
  rule: string;
  path: string;
  message: string;
}

export interface AuditResult {
  findings: AuditFinding[];
  passed: boolean;
}

/** Placeholder — not implemented */
export async function audit(_options: AuditOptions = {}): Promise<AuditResult> {
  throw new Error('scripts/audit.ts is not implemented.');
}
