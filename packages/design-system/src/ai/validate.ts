/**
 * Plantasonic Design System — Validation & Compliance engine.
 *
 * Audits application source against Design System rules so applications fail
 * validation when they violate conventions (local styling, hardcoded values,
 * unknown or deprecated tokens, deprecated APIs, duplicated components).
 *
 * The engine is dependency-free and operates on plain source strings so it can
 * run in CI, build tooling, editor extensions, or an AI agent loop.
 */
import type { Registry } from './registry.ts';
import { registry as defaultRegistry } from './registry.ts';
import type { ComponentMetadata, TokenMetadata } from './metadata.ts';

export type RuleId =
  | 'no-hardcoded-color'
  | 'no-raw-color-function'
  | 'unknown-design-token'
  | 'deprecated-token'
  | 'deprecated-api'
  | 'duplicate-component';

export type Severity = 'error' | 'warning';

export interface ApplicationFile {
  path: string;
  content: string;
}

export interface Violation {
  rule: RuleId;
  severity: Severity;
  message: string;
  file?: string;
  line?: number;
  snippet?: string;
}

export interface ValidationReport {
  ok: boolean;
  filesChecked: number;
  errorCount: number;
  warningCount: number;
  violations: Violation[];
}

export interface ValidationOptions {
  registry?: Registry;
  /** Toggle rules on/off or override severity. */
  rules?: Partial<Record<RuleId, boolean | Severity>>;
}

const DEFAULT_SEVERITY: Record<RuleId, Severity> = {
  'no-hardcoded-color': 'error',
  'no-raw-color-function': 'warning',
  'unknown-design-token': 'warning',
  'deprecated-token': 'error',
  'deprecated-api': 'error',
  'duplicate-component': 'warning',
};

const HEX = /#[0-9a-fA-F]{3,8}\b/;
const RAW_COLOR_FN = /\b(?:rgba?|hsla?)\(/;
const DS_VAR = /var\(\s*(--(?:ds|ps)-[a-z0-9-]+)/gi;
const CSS_LIKE = /\.(css|scss|sass|less)$/i;
const CODE_LIKE = /\.(t|j)sx?$/i;

function normalizeFiles(input: ApplicationFile | ApplicationFile[] | string): ApplicationFile[] {
  if (typeof input === 'string') return [{ path: 'input', content: input }];
  return Array.isArray(input) ? input : [input];
}

function severityFor(rule: RuleId, options: ValidationOptions): Severity | null {
  const override = options.rules?.[rule];
  if (override === false) return null;
  if (override === undefined || override === true) return DEFAULT_SEVERITY[rule];
  return override; // 'error' | 'warning'
}

/**
 * Validate application source against Design System rules.
 *
 * @example
 * const report = validateApplication([{ path: 'app.css', content }]);
 * if (!report.ok) console.error(report.violations);
 */
export function validateApplication(
  input: ApplicationFile | ApplicationFile[] | string,
  options: ValidationOptions = {},
): ValidationReport {
  const registry = options.registry ?? defaultRegistry;
  const files = normalizeFiles(input);

  const tokens = registry.tokens() as TokenMetadata[];
  const knownVars = new Set(tokens.map((t) => t.cssVar));
  const deprecatedVars = new Set(tokens.filter((t) => t.deprecated).map((t) => t.cssVar));
  const replacementFor = new Map(tokens.map((t) => [t.cssVar, t.replacement] as const));

  const components = registry.components() as ComponentMetadata[];
  const deprecatedExports = new Map(
    components.filter((c) => c.status === 'deprecated').map((c) => [c.export, c.id] as const),
  );
  const componentExports = new Set(components.map((c) => c.export));

  const violations: Violation[] = [];
  const enabled = (rule: RuleId) => severityFor(rule, options);

  for (const file of files) {
    const isCss = CSS_LIKE.test(file.path);
    const isCode = CODE_LIKE.test(file.path);
    const lines = file.content.split('\n');

    lines.forEach((raw, i) => {
      const line = raw;
      const lineNo = i + 1;
      const snippet = line.trim().slice(0, 160);

      const hexSev = enabled('no-hardcoded-color');
      if (hexSev && HEX.test(line)) {
        violations.push({
          rule: 'no-hardcoded-color',
          severity: hexSev,
          message: 'Hardcoded hex color — use a design token (var(--ds-color-*)) instead.',
          file: file.path,
          line: lineNo,
          snippet,
        });
      }

      const rawFnSev = enabled('no-raw-color-function');
      if (rawFnSev && (isCss || isCode) && RAW_COLOR_FN.test(line) && !line.includes('var(')) {
        violations.push({
          rule: 'no-raw-color-function',
          severity: rawFnSev,
          message: 'Raw color function — prefer a design token over an inline rgb()/hsl() color.',
          file: file.path,
          line: lineNo,
          snippet,
        });
      }

      for (const match of line.matchAll(DS_VAR)) {
        const cssVar = match[1];
        if (cssVar.startsWith('--ds-l-')) continue; // layout-primitive internal vars

        const deprecatedSev = enabled('deprecated-token');
        if (deprecatedSev && deprecatedVars.has(cssVar)) {
          const repl = replacementFor.get(cssVar);
          violations.push({
            rule: 'deprecated-token',
            severity: deprecatedSev,
            message: `Deprecated token ${cssVar}${repl ? ` — use ${repl} instead.` : '.'}`,
            file: file.path,
            line: lineNo,
            snippet,
          });
          continue;
        }

        const unknownSev = enabled('unknown-design-token');
        if (unknownSev && !knownVars.has(cssVar)) {
          violations.push({
            rule: 'unknown-design-token',
            severity: unknownSev,
            message: `Unknown design token ${cssVar} — not present in the token registry.`,
            file: file.path,
            line: lineNo,
            snippet,
          });
        }
      }

      if (isCode) {
        const deprApiSev = enabled('deprecated-api');
        if (deprApiSev) {
          for (const [exportName, id] of deprecatedExports) {
            if (new RegExp(`\\b${exportName}\\b`).test(line)) {
              violations.push({
                rule: 'deprecated-api',
                severity: deprApiSev,
                message: `Deprecated API "${exportName}" (${id}) — see migration history.`,
                file: file.path,
                line: lineNo,
                snippet,
              });
            }
          }
        }

        const dupSev = enabled('duplicate-component');
        if (dupSev) {
          const def = line.match(/(?:function\s+([a-zA-Z0-9_]+)\s*\(|(?:const|let)\s+([a-zA-Z0-9_]+)\s*=\s*(?:\([^)]*\)|[a-zA-Z0-9_]+)\s*=>)/);
          const name = def?.[1] ?? def?.[2];
          if (name && componentExports.has(name)) {
            violations.push({
              rule: 'duplicate-component',
              severity: dupSev,
              message: `Local definition "${name}" duplicates a Design System component — import from plantasonic-design-system/components instead.`,
              file: file.path,
              line: lineNo,
              snippet,
            });
          }
        }
      }
    });
  }

  const errorCount = violations.filter((v) => v.severity === 'error').length;
  const warningCount = violations.filter((v) => v.severity === 'warning').length;

  return {
    ok: errorCount === 0,
    filesChecked: files.length,
    errorCount,
    warningCount,
    violations,
  };
}

/** Format a report as a human-readable migration / compliance report. */
export function formatValidationReport(report: ValidationReport): string {
  const lines: string[] = [];
  lines.push(`Design System compliance — ${report.ok ? 'PASS' : 'FAIL'}`);
  lines.push(`Files checked: ${report.filesChecked} · Errors: ${report.errorCount} · Warnings: ${report.warningCount}`);
  if (report.violations.length) {
    lines.push('');
    for (const v of report.violations) {
      const loc = v.file ? `${v.file}${v.line ? `:${v.line}` : ''}` : '';
      lines.push(`  [${v.severity}] ${v.rule} ${loc}`);
      lines.push(`    ${v.message}`);
      if (v.snippet) lines.push(`    > ${v.snippet}`);
    }
  }
  return lines.join('\n');
}
