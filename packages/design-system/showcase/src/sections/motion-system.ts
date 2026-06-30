import { MOTION_DURATION_VAR, MOTION_EASING_VAR, MOTION_PRESET_NAMES } from '@ds/motion';
import { button } from '@ds/components';
import { grid } from '@ds/primitives';
import { demoCard, docBlock, sectionHeader } from '../lib/ui';

function tokenRow(name: string, cssVar: string): string {
  return `<tr>
    <td><code class="small">${name}</code></td>
    <td><code class="small text-muted">${cssVar}</code></td>
    <td style="font-family: var(--ds-font-family-mono)"><span data-ds-css-value="${cssVar}">var(${cssVar})</span></td>
  </tr>`;
}

function presetTile(preset: string): string {
  return `<div class="ds-motion-tile" style="display:flex; flex-direction:column; gap: var(--ds-space-2); align-items:center; padding: var(--ds-space-3); background: var(--ds-color-surface-card); border:1px solid var(--ds-color-border-subtle); border-radius: var(--ds-radius-default)">
    <div class="ds-motion-demo-target" data-ds-motion-target style="inline-size: 3rem; block-size: 3rem; background: var(--ds-color-primary); border-radius: var(--ds-radius-default)"></div>
    <code class="small">${preset}</code>
    ${button({ label: 'Play', variant: 'secondary', size: 'sm', attrs: `data-ds-animate="${preset}"` })}
  </div>`;
}

export function renderMotionSystem(): string {
  const durationRows = Object.entries(MOTION_DURATION_VAR)
    .map(([name, cssVar]) => tokenRow(`motion.duration.${name}`, cssVar))
    .join('');
  const easingRows = Object.entries(MOTION_EASING_VAR)
    .map(([name, cssVar]) => tokenRow(`motion.easing.${name}`, cssVar))
    .join('');

  const presetGrid = grid({
    gap: '3',
    minItemWidth: '8rem',
    content: MOTION_PRESET_NAMES.map(presetTile).join(''),
  });

  const utilityDemo = `
    <p class="small text-muted">CSS-only utilities re-trigger by toggling the class:</p>
    <div class="ds-l-inline" style="gap: var(--ds-space-3); flex-wrap: wrap">
      ${['fade-in', 'slide-up', 'scale-in', 'expand'].map((u) => `
        <div style="display:flex; flex-direction:column; gap: var(--ds-space-2); align-items:center">
          <div class="ds-motion-util-target" style="inline-size:3rem; block-size:3rem; background: var(--ds-color-accent); border-radius: var(--ds-radius-default)"></div>
          ${button({ label: `.ds-animate--${u}`, variant: 'ghost', size: 'sm', attrs: `data-ds-animate-class="ds-animate--${u}"` })}
        </div>`).join('')}
    </div>`;

  return `
    ${sectionHeader('Motion System', 'Layer 3 — token-driven motion primitives via the Web Animations API, with reduced-motion support and an optional GSAP adapter.')}
    ${docBlock({
      purpose: 'A single, consistent, accessible motion language shared across every application.',
      usage: "import { animate, prefersReducedMotion } from 'plantasonic-design-system/motion'",
      bestPractices: [
        'Use presets (fade, slideUp, modalIn…) instead of bespoke keyframes',
        'Always allow reduced motion — animate() resolves instantly when reduced',
      ],
      dos: ['Drive durations/easings from motion tokens', 'Use scss/motion.scss utilities for CSS-only cases'],
      donts: ['Hardcode ms/easing in app code', 'Animate without honoring prefers-reduced-motion'],
      implementationNotes: ['Toggle the header "Reduced motion" switch to verify graceful degradation'],
    })}

    ${demoCard(
      'Motion tokens',
      `<div class="table-responsive"><table class="table table-sm align-middle mb-0">
        <thead><tr><th>Token</th><th>CSS variable</th><th>Value</th></tr></thead>
        <tbody>${durationRows}${easingRows}</tbody>
      </table></div>`,
      ['--ds-motion-duration-base', '--ds-motion-easing-standard'],
    )}
    ${demoCard('Imperative presets — animate(el, preset)', presetGrid, ['--ds-motion-easing-spring'])}
    ${demoCard('Declarative utilities — scss/motion.scss', utilityDemo, ['--ds-motion-duration-base'])}`;
}
