/**
 * Plantasonic Design System — Component library (Layer 1), slice 1.
 *
 * Framework-agnostic, token-driven render functions. Every component returns
 * an HTML string, consumes design tokens (no hardcoded values), supports
 * dark/light themes via tokens, and ships accessible roles/labels.
 *
 * Styling: import `plantasonic-design-system/scss/components.scss` after the
 * Bootstrap layers and `plantasonic-components.scss`.
 */

export { button, iconButton } from './buttons.ts';
export type { ButtonOptions, ButtonVariant, IconButtonOptions } from './buttons.ts';

export { toolbar, toolbarGroup } from './toolbar.ts';
export type { ToolbarOptions, ToolbarGroupOptions } from './toolbar.ts';

export { panel, panelHeader } from './panel.ts';
export type { PanelOptions, PanelHeaderOptions } from './panel.ts';

export { card, section, controlGroup, surface } from './containers.ts';
export type {
  CardOptions,
  SectionOptions,
  ControlGroupOptions,
  SurfaceOptions,
  SurfaceLevel,
} from './containers.ts';

export { badge, statusIndicator } from './indicators.ts';
export type { BadgeOptions, BadgeVariant, StatusIndicatorOptions, StatusKind } from './indicators.ts';

export type { Size } from './types.ts';

/** All component names exposed by this slice — for documentation and tests. */
export const COMPONENT_NAMES = [
  'button',
  'iconButton',
  'toolbar',
  'toolbarGroup',
  'panel',
  'panelHeader',
  'surface',
  'card',
  'badge',
  'statusIndicator',
  'section',
  'controlGroup',
] as const;

export type ComponentName = (typeof COMPONENT_NAMES)[number];
