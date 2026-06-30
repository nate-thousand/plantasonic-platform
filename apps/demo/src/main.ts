import 'plantasonic-design-system/css/variables.css';
import './styles/index.scss';

import { mountDemo } from './app.js';

const container = document.querySelector<HTMLElement>('#app');

if (!container) {
  throw new Error('Demo mount point #app not found');
}

void mountDemo(container).catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  container.innerHTML = `<p class="text-danger p-3" role="alert">Demo failed to start: ${message}</p>`;
  console.error('[platform-demo]', error);
});
