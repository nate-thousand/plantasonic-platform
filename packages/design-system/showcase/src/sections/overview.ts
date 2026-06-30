import {
  BOOTSTRAP_VERSION,
  BUILD_TIME,
  COMPONENT_COUNT,
  CSS_VAR_MAP,
  DS_VERSION,
  GIT_COMMIT,
  NAV,
} from '../data/catalog';
import { TOKEN_COUNTS } from '../lib/meta';
import { countTokens, getTokenValue } from '../lib/tokens';
import { docBlock, sectionHeader } from '../lib/ui';

export function renderOverview(): string {
  const tokenCount = countTokens();
  return `
    ${sectionHeader('Overview', 'Canonical visual reference for the Plantasonic ecosystem.')}
    ${docBlock({
      purpose: 'Living documentation, component explorer, and visual QA baseline — not a product application.',
      usage: 'Implement every new design feature here first. Product apps match showcased patterns exactly.',
      bestPractices: [
        'Switch themes before shipping UI',
        'Use token inspector on reference components',
        'Compare side-by-side with product implementation',
      ],
      dos: [
        'Match token usage shown here in product apps',
        'Verify both dark and light themes',
        'Run visual comparison for every new component',
      ],
      donts: [
        'Copy hex values into application code',
        'Ship UI that diverges without design review',
        'Import styles from the Plantasonic app',
      ],
      implementationNotes: [
        'Consumes foundation.tokens.json, theme.*.tokens.json, css/variables.css only',
        'No duplicated tokens or application-specific styling',
      ],
    })}
    <div class="row g-3 mb-4">
      <div class="col-sm-6 col-xl-3">
        <div class="card ds-stat-card h-100" data-ds-tokens="--ds-color-primary">
          <div class="card-body">
            <div class="ds-overline text-muted mb-1">Design System</div>
            <div class="h4 mb-0 font-monospace">v${DS_VERSION}</div>
          </div>
        </div>
      </div>
      <div class="col-sm-6 col-xl-3">
        <div class="card ds-stat-card h-100">
          <div class="card-body">
            <div class="ds-overline text-muted mb-1">Git commit</div>
            <div class="h5 mb-0 font-monospace">${GIT_COMMIT}</div>
          </div>
        </div>
      </div>
      <div class="col-sm-6 col-xl-3">
        <div class="card ds-stat-card h-100">
          <div class="card-body">
            <div class="ds-overline text-muted mb-1">Build</div>
            <div class="small font-monospace">${new Date(BUILD_TIME).toLocaleString()}</div>
          </div>
        </div>
      </div>
      <div class="col-sm-6 col-xl-3">
        <div class="card ds-stat-card h-100">
          <div class="card-body">
            <div class="ds-overline text-muted mb-1">Bootstrap</div>
            <div class="h5 mb-0 font-monospace">${BOOTSTRAP_VERSION}</div>
          </div>
        </div>
      </div>
      <div class="col-sm-6 col-xl-3">
        <div class="card ds-stat-card h-100">
          <div class="card-body">
            <div class="ds-overline text-muted mb-1">CSS variables</div>
            <div class="h4 mb-0">${tokenCount}</div>
          </div>
        </div>
      </div>
      <div class="col-sm-6 col-xl-3">
        <div class="card ds-stat-card h-100">
          <div class="card-body">
            <div class="ds-overline text-muted mb-1">Token JSON leaves</div>
            <div class="h4 mb-0">${TOKEN_COUNTS.total}</div>
          </div>
        </div>
      </div>
      <div class="col-sm-6 col-xl-3">
        <div class="card ds-stat-card h-100">
          <div class="card-body">
            <div class="ds-overline text-muted mb-1">Components</div>
            <div class="h4 mb-0">${COMPONENT_COUNT}</div>
          </div>
        </div>
      </div>
      <div class="col-sm-6 col-xl-3">
        <div class="card ds-stat-card h-100">
          <div class="card-body">
            <div class="ds-overline text-muted mb-1">Sections</div>
            <div class="h4 mb-0">${NAV.length}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="card mb-4">
      <div class="card-header d-flex justify-content-between align-items-center">
        <span>Quick navigation</span>
        <span class="small text-muted">Use search in sidebar · Theme in header</span>
      </div>
      <div class="card-body">
        <div class="row g-2">
          ${NAV.map((n) => `<div class="col-md-4 col-lg-3"><a href="#${n.id}" class="btn btn-outline-secondary btn-sm w-100 ds-nav-link" data-route="${n.id}">${n.label}</a></div>`).join('')}
        </div>
      </div>
    </div>
    <div class="alert alert-info mb-0">
      <strong>Design validation workflow:</strong> find the matching section → match tokens and layout → switch themes → compare side-by-side → do not ship divergent UI without review.
    </div>`;
}

export function renderTokens(): string {
  const rows = Object.entries(CSS_VAR_MAP)
    .map(([path, cssVar]) => {
      const value = getTokenValue(path);
      return `
      <tr data-ds-inspect data-ds-tokens="${cssVar}" data-search="${path} ${cssVar}">
        <td><code>${path}</code></td>
        <td><code>${cssVar}</code></td>
        <td><code>${value}</code></td>
      </tr>`;
    })
    .join('');

  return `
    ${sectionHeader('Design Tokens', 'Complete mapping from token paths to CSS custom properties.')}
    ${docBlock({
      purpose: 'Single catalog of semantic token names and runtime values.',
      usage: 'Reference token paths in code. Values resolve from css/variables.css at runtime.',
      bestPractices: ['Prefer semantic tokens over foundation primitives in UI code'],
      dos: ['Use --ds-* and --ps-* variables', 'Edit tokens/*.json then npm run build'],
      donts: ['Hardcode resolved hex values', 'Edit variables.css manually'],
      implementationNotes: ['Sources: foundation.tokens.json + theme.dark/light.tokens.json'],
    })}
    <div class="table-responsive">
      <table class="table table-sm table-hover" id="token-table">
        <thead><tr><th>Token path</th><th>CSS variable</th><th>Resolved value</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}
