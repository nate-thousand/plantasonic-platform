import 'plantasonic-design-system/css/variables.css';
import './styles/index.scss';

import { mountInstrumentApp } from '@plantasonic/platform-demo/instrument-app';

import { plantasonicAppContent } from './plantasonicAppContent.js';

const container = document.querySelector<HTMLElement>('#app');

if (!container) {
  throw new Error('Plantasonic mount point #app not found');
}

void mountInstrumentApp(container, plantasonicAppContent).catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  container.innerHTML = `<p class="text-danger p-3" role="alert">Plantasonic failed to start: ${message}</p>`;
  console.error('[plantasonic-reference]', error);
});
