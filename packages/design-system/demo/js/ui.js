/**
 * @param {string} title
 * @param {string} [subtitle]
 */
export function sectionHeader(title, subtitle) {
  return `
    <header class="mb-4">
      <h2 class="h2 mb-1">${title}</h2>
      ${subtitle ? `<p class="text-secondary mb-0">${subtitle}</p>` : ''}
    </header>`;
}

/**
 * @param {string} title
 * @param {string} body
 * @param {string[]} [tokens]
 */
export function demoCard(title, body, tokens = []) {
  const tokenAttr = tokens.length ? ` data-ds-tokens="${tokens.join(',')}"` : '';
  return `
    <div class="card ds-demo-card mb-4"${tokenAttr}>
      <div class="card-header py-2">
        <span class="small fw-semibold">${title}</span>
        ${tokens.length ? `<code class="small ms-2 text-muted">${tokens.join(', ')}</code>` : ''}
      </div>
      <div class="card-body">${body}</div>
    </div>`;
}

/**
 * @param {string} cssVar
 * @param {string} [label]
 */
export function colorSwatch(cssVar, label) {
  const name = label ?? cssVar.replace(/^--ds-color-/, '').replace(/^--/, '');
  return `
    <div class="col-sm-6 col-lg-4 col-xl-3">
      <div class="card h-100" style="--swatch-color: var(${cssVar})">
        <div class="ds-swatch__color"></div>
        <div class="card-body p-2">
          <div class="small fw-semibold">${name}</div>
          <code class="small d-block text-muted">${cssVar}</code>
        </div>
      </div>
    </div>`;
}

/**
 * @param {string} cssVar
 */
export function cssVarValue(cssVar) {
  return getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim() || '—';
}
