import foundation from '@ds/tokens/foundation.tokens.json';
import themeDark from '@ds/tokens/theme.dark.tokens.json';
import themeLight from '@ds/tokens/theme.light.tokens.json';

function countTokenLeaves(node: unknown): number {
  if (typeof node === 'object' && node !== null && '$value' in node && !Array.isArray(node)) return 1;
  if (typeof node !== 'object' || node === null || Array.isArray(node)) return 0;
  let n = 0;
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('$')) continue;
    n += countTokenLeaves(value);
  }
  return n;
}

export const TOKEN_COUNTS = {
  foundation: countTokenLeaves(foundation),
  dark: countTokenLeaves(themeDark),
  light: countTokenLeaves(themeLight),
  total: countTokenLeaves(foundation) + countTokenLeaves(themeDark),
};

export const FILE_PATHS = {
  foundation: 'tokens/foundation.tokens.json',
  themeDark: 'tokens/theme.dark.tokens.json',
  themeLight: 'tokens/theme.light.tokens.json',
  css: 'css/variables.css',
  bootstrapTheme: 'scss/bootstrap-theme.scss',
  cssBridge: 'scss/css-theme-bridge.scss',
};
