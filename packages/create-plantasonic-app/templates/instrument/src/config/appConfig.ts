import type { ApplicationConfig } from '@plantasonic/platform-types';

import { defaultWorkspaceConfig } from './workspaceConfig.js';

export const {{APP_CAMEL}}AppConfig: ApplicationConfig = {
  id: '{{APP_ID}}',
  name: '{{APP_NAME}}',
  description: '{{APP_DESCRIPTION}}',
  workspace: defaultWorkspaceConfig,
  initialStatus: 'idle',
};
