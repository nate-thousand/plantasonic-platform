import type { ApplicationConfig } from '@plantasonic/platform-types';

import { defaultWorkspaceConfig } from './workspaceConfig.js';

/** Plantasonic application identity — creative direction and app metadata only */
export const plantasonicAppConfig: ApplicationConfig = {
  id: 'plantasonic',
  name: 'Plantasonic',
  description:
    'Generative audio-visual flora — rebuilt as a thin consumer of @plantasonic/platform.',
  workspace: defaultWorkspaceConfig,
  initialStatus: 'idle',
};
