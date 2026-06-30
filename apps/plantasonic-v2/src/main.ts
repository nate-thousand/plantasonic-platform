import 'plantasonic-design-system/css/variables.css';
import './styles/index.scss';

import { mountInstrumentApp } from '@plantasonic/platform-demo/instrument-app';

import { plantasonicV2AppContent } from './appContent.js';

const container = document.querySelector<HTMLElement>('#app');

if (!container) {
  throw new Error('Mount point #app not found');
}

void mountInstrumentApp(container, plantasonicV2AppContent).catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  container.innerHTML = `<p class="text-danger p-3" role="alert">Plantasonic failed to start: ${message}</p>`;
  console.error('[plantasonic-v2]', error);
});
