import {
  center,
  cluster,
  container,
  cover,
  flow,
  frame,
  grid,
  inline,
  inset,
  sidebar,
  split,
  stack,
  surface,
} from '@ds/primitives';
import { demoCard, docBlock, sectionHeader } from '../lib/ui';

function box(label: string): string {
  return `<div style="background: var(--ds-color-surface-overlay); color: var(--ds-color-text-secondary); border-radius: var(--ds-radius-sm); padding: var(--ds-space-2); font-size: var(--ds-font-size-caption); text-align: center;">${label}</div>`;
}

export function renderPrimitives(): string {
  const boxes = (n: number) => Array.from({ length: n }, (_, i) => box(`Item ${i + 1}`)).join('');

  return `
    ${sectionHeader('Layout Primitives', 'Layer 9 — low-level, composable, token-driven building blocks rendered as framework-agnostic HTML strings.')}
    ${docBlock({
      purpose: 'Provide the structural foundation every application layout and component is built from.',
      usage: "import { stack, grid, sidebar } from 'plantasonic-design-system/primitives'",
      bestPractices: [
        'Compose primitives instead of writing bespoke fl/grid CSS',
        'Pass spacing via the gap token props (0–8) — never hardcode',
      ],
      dos: ['Use Stack/Inline/Cluster for flow', 'Use Sidebar/Split/Grid for page regions'],
      donts: ['Add margins to children for spacing', 'Hardcode widths/gaps in pixels'],
      implementationNotes: ['Each primitive sets --ds-l-* custom properties consumed by scss/primitives.scss'],
    })}

    ${demoCard('Stack — vertical rhythm', stack({ gap: '3', content: boxes(3) }), ['--ds-space-3'])}
    ${demoCard('Inline — horizontal row', inline({ gap: '2', content: boxes(4) }), ['--ds-space-2'])}
    ${demoCard('Cluster — wrapping group', cluster({ gap: '2', content: boxes(8) }), ['--ds-space-2'])}
    ${demoCard('Grid — responsive auto-fill', grid({ gap: '3', minItemWidth: '8rem', content: boxes(6) }), ['--ds-space-3'])}
    ${demoCard(
      'Sidebar — fixed side + fluid main',
      sidebar({ gap: '3', side: '10rem', sidebarContent: box('Sidebar'), mainContent: box('Main content region') }),
      ['--ds-space-3'],
    )}
    ${demoCard(
      'Split — ratio columns',
      split({ gap: '3', fraction: 0.33, startContent: box('1 / 3'), endContent: box('2 / 3') }),
      ['--ds-space-3'],
    )}
    ${demoCard('Frame — fixed aspect ratio (16 / 9)', frame({ ratio: '16 / 9', content: box('16 / 9 media') }))}
    ${demoCard('Center — centered measure', center({ maxWidth: '24rem', content: box('Centered, max 24rem') }))}
    ${demoCard(
      'Cover — header / centered main / footer',
      `<div style="height: 12rem; border: 1px dashed var(--ds-color-border-subtle); border-radius: var(--ds-radius-default)">${cover(
        { minHeight: '12rem', headerContent: box('Header'), mainContent: box('Centered main'), footerContent: box('Footer') },
      )}</div>`,
    )}
    ${demoCard('Container — max-width wrapper', container({ maxWidth: '30rem', content: box('Max 30rem, auto margins') }))}
    ${demoCard(
      'Surface — token-driven box',
      inline({
        gap: '3',
        content: [
          surface({ level: 'sunken', content: 'sunken' }),
          surface({ level: 'default', content: 'default' }),
          surface({ level: 'raised', content: 'raised' }),
          surface({ level: 'overlay', content: 'overlay' }),
        ].join(''),
      }),
      ['--ds-color-surface-raised'],
    )}
    ${demoCard('Inset — uniform padding', inset({ padding: '5', content: box('Inset padding (space 5)') }), ['--ds-space-5'])}
    ${demoCard('Flow — spacing between children', flow({ gap: '3', content: `${box('First')}${box('Second')}${box('Third')}` }), [
      '--ds-space-3',
    ])}`;
}
