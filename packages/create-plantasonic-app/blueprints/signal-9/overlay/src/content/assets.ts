/**
 * Signal 9 asset placeholder hooks — replace paths when production assets are ready.
 * Blueprint: signal-9
 */
export const {{APP_CONST}}_ASSETS = {
  logo: 'assets/logo.svg',
  background: 'assets/background.jpg',
  loadingAnimation: 'assets/loading.json',
  introAnimation: 'assets/intro.json',
  audioPack: 'assets/audio/',
  videoPack: 'assets/video/',
} as const;

export type {{APP_CONST}}Assets = typeof {{APP_CONST}}_ASSETS;
