/**
 * App-scoped semantic theme values — not global Design System tokens.
 * Applied via data-blueprint attribute and app-layout.scss.
 * Blueprint: signal-9
 */
export const {{APP_CONST}}_SEMANTIC_THEME = {
  signal: '#00ff9f',
  danger: '#ff3355',
  warning: '#ffcc00',
  active: '#66eeff',
  offline: '#334455',
} as const;

export type {{APP_CONST}}SemanticTheme = typeof {{APP_CONST}}_SEMANTIC_THEME;
