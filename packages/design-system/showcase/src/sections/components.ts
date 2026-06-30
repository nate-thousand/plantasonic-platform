import {
  badge,
  button,
  card,
  controlGroup,
  iconButton,
  panel,
  section as componentSection,
  statusIndicator,
  toolbar,
  toolbarGroup,
} from '@ds/components';
import { inline, stack } from '@ds/primitives';
import { demoCard, docBlock, sectionHeader } from '../lib/ui';

export function renderComponents(): string {
  const buttons = inline({
    gap: '2',
    wrap: true,
    content: [
      button({ label: 'Primary', variant: 'primary' }),
      button({ label: 'Secondary', variant: 'secondary' }),
      button({ label: 'Ghost', variant: 'ghost' }),
      button({ label: 'Subtle', variant: 'subtle' }),
      button({ label: 'Danger', variant: 'danger' }),
      button({ label: 'Loading', variant: 'primary', loading: true }),
      button({ label: 'Disabled', variant: 'secondary', disabled: true }),
      button({ label: 'With icon', variant: 'primary', icon: '▶' }),
    ].join(''),
  });

  const iconButtons = inline({
    gap: '2',
    content: [
      iconButton({ icon: '▶', ariaLabel: 'Play', variant: 'primary' }),
      iconButton({ icon: '⏸', ariaLabel: 'Pause', variant: 'secondary' }),
      iconButton({ icon: '⏹', ariaLabel: 'Stop', variant: 'ghost' }),
      iconButton({ icon: '◉', ariaLabel: 'Record', variant: 'danger', size: 'lg' }),
    ].join(''),
  });

  const toolbarDemo = toolbar({
    label: 'Transport',
    content: [
      toolbarGroup({ content: [iconButton({ icon: '⏮', ariaLabel: 'Previous' }), iconButton({ icon: '▶', ariaLabel: 'Play', variant: 'primary' }), iconButton({ icon: '⏭', ariaLabel: 'Next' })].join('') }),
      toolbarGroup({ divider: true, label: 'View', content: [button({ label: 'Mixer', variant: 'ghost', size: 'sm' }), button({ label: 'Stage', variant: 'ghost', size: 'sm' })].join('') }),
    ].join(''),
  });

  const badges = inline({
    gap: '2',
    wrap: true,
    content: [
      badge({ label: 'Default' }),
      badge({ label: 'Accent', variant: 'accent' }),
      badge({ label: 'Success', variant: 'success', dot: true }),
      badge({ label: 'Warning', variant: 'warning' }),
      badge({ label: 'Error', variant: 'error' }),
      badge({ label: 'Info', variant: 'info', pill: true }),
    ].join(''),
  });

  const statuses = stack({
    gap: '2',
    content: [
      statusIndicator({ status: 'online', label: 'Engine online', pulse: true }),
      statusIndicator({ status: 'busy', label: 'Rendering' }),
      statusIndicator({ status: 'idle', label: 'Idle' }),
      statusIndicator({ status: 'error', label: 'Audio device error' }),
      statusIndicator({ status: 'offline', label: 'Disconnected' }),
    ].join(''),
  });

  const cardDemo = card({
    title: 'Bloom',
    subtitle: 'Generative preset',
    content: '<p class="small text-muted mb-0">A living patch that grows over time.</p>',
    actions: iconButton({ icon: '★', ariaLabel: 'Favorite', size: 'sm' }),
    footer: button({ label: 'Load preset', variant: 'primary', size: 'sm' }),
  });

  const panelDemo = panel({
    title: 'Inspector',
    collapsible: true,
    content: '<p class="small text-muted mb-0">Panel body content slot.</p>',
    actions: iconButton({ icon: '⧉', ariaLabel: 'Float panel', size: 'sm' }),
  });

  const sectionDemo = componentSection({
    id: 'demo-section',
    title: 'Sound',
    description: 'Grouped controls for the audio ecosystem.',
    actions: button({ label: 'Reset', variant: 'ghost', size: 'sm' }),
    content: controlGroup({
      label: 'Density',
      direction: 'row',
      content: [button({ label: '−', variant: 'secondary', size: 'sm' }), button({ label: '+', variant: 'secondary', size: 'sm' })].join(''),
    }),
  });

  return `
    ${sectionHeader('Component Library', 'Layer 1 (slice 1) — token-driven, accessible, framework-agnostic render functions.')}
    ${docBlock({
      purpose: 'Stop applications from hand-building UI controls — compose these instead.',
      usage: "import { button, card, panel } from 'plantasonic-design-system/components'",
      bestPractices: ['Provide accessible labels for icon-only controls', 'Use semantic variants, not hardcoded colors'],
      dos: ['Reuse themed components across apps', 'Compose components inside primitives'],
      donts: ['Recreate buttons/cards per app', 'Override token colors inline'],
      implementationNotes: ['Reuses .ps-* + Bootstrap surfaces; new styles live in scss/components.scss'],
    })}

    ${demoCard('Button — variants, sizes, states', buttons, ['--ds-color-primary'])}
    ${demoCard('IconButton — square, labelled', iconButtons, ['--ps-touch-target'])}
    ${demoCard('Toolbar + ToolbarGroup', toolbarDemo, ['--ds-color-surface-nav'])}
    ${demoCard('Badge', badges, ['--ds-color-accent'])}
    ${demoCard('StatusIndicator', statuses, ['--ds-color-success'])}
    ${demoCard('Card', cardDemo, ['--ds-color-surface-card'])}
    ${demoCard('Panel + PanelHeader', panelDemo, ['--ds-color-surface-raised'])}
    ${demoCard('Section + ControlGroup', sectionDemo, ['--ds-color-text-muted'])}`;
}
