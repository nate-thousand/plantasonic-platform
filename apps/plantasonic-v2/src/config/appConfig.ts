import type { ApplicationConfig } from '@plantasonic/platform-types';

import { defaultWorkspaceConfig } from './workspaceConfig.js';

export const plantasonicV2AppConfig: ApplicationConfig = {
  id: 'plantasonic-v2',
  name: 'Plantasonic',
  description:
    'Generative audio-visual flora — thin consumer of @plantasonic/platform (v2 replacement scaffold).',
  workspace: defaultWorkspaceConfig,
  initialStatus: 'idle',
};
