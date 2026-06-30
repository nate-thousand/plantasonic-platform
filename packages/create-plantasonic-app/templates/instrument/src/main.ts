import 'plantasonic-design-system/css/variables.css';
import './styles/index.scss';

import { mountInstrumentApp } from '@plantasonic/platform-demo/instrument-app';

import { {{APP_CAMEL}}AppContent } from './appContent.js';

const container = document.querySelector<HTMLElement>('#app');

if (!container) {
  throw new Error('Mount point #app not found');
}

void mountInstrumentApp(container, {{APP_CAMEL}}AppContent).catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  container.innerHTML = `<p class="text-danger p-3" role="alert">{{APP_NAME}} failed to start: ${message}</p>`;
  console.error('[{{EVENT_SOURCE}}]', error);
});
