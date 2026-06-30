import {
  createVisualEngineAdapter,
  type PlatformApplication,
} from '@plantasonic/platform';
import type { VisualEngineAdapter } from '@plantasonic/platform-types';

const VISUAL_PARAMS = [
  { name: 'density', label: 'Density', default: 1 },
  { name: 'speed', label: 'Speed', default: 0.5 },
  { name: 'glitchAmount', label: 'Glitch', default: 0.1 },
  { name: 'trailAmount', label: 'Trails', default: 0.3 },
] as const;

/** Visual parameter controls for the inspector panel */
export function renderVisualParameterPanel(): string {
  return VISUAL_PARAMS.map(
    ({ name, label, default: def }) => `
    <div class="mb-3">
      <label class="form-label small text-muted" for="visual-param-${name}">${label}</label>
      <input type="range" class="form-range" id="visual-param-${name}" data-demo-visual-param="${name}" min="0" max="1" step="0.01" value="${def}" disabled>
    </div>`,
  ).join('');
}

export function showVisualError(root: HTMLElement, message: string): void {
  const el = root.querySelector<HTMLElement>('[data-demo-visual-error]');
  if (!el) return;
  el.hidden = false;
  el.textContent = message;
}

export function clearVisualError(root: HTMLElement): void {
  const el = root.querySelector<HTMLElement>('[data-demo-visual-error]');
  if (!el) return;
  el.hidden = true;
  el.textContent = '';
}

export function setVisualControlsEnabled(root: HTMLElement, enabled: boolean): void {
  root.querySelectorAll<HTMLInputElement>('[data-demo-visual-param]').forEach((input) => {
    input.disabled = !enabled;
  });
}

/** Mount visual engine into the Design System stage canvas slot */
export async function mountVisualStage(
  root: HTMLElement,
  visual: VisualEngineAdapter,
): Promise<void> {
  const mount =
    root.querySelector<HTMLElement>('[data-ps-canvas-mount]') ??
    root.querySelector<HTMLElement>('[data-ps-region="stage"]');
  if (!mount) {
    throw new Error('Stage canvas mount not found');
  }
  mount.innerHTML = '';
  await visual.mount({ element: mount });
}

/** Observe stage region resize and forward to visual adapter */
export function bindVisualResize(
  root: HTMLElement,
  visual: VisualEngineAdapter,
): () => void {
  const stage = root.querySelector<HTMLElement>('[data-ps-region="stage"]');
  if (!stage) return () => {};

  const applySize = (): void => {
    const rect = stage.getBoundingClientRect();
    visual.resize(rect.width, rect.height);
  };

  const observer = new ResizeObserver(() => {
    applySize();
  });
  observer.observe(stage);

  const onWindowResize = (): void => {
    applySize();
  };
  window.addEventListener('resize', onWindowResize);
  applySize();

  return () => {
    observer.disconnect();
    window.removeEventListener('resize', onWindowResize);
  };
}

/** Wire visual parameter sliders */
export function wireVisualControls(
  root: HTMLElement,
  visual: VisualEngineAdapter,
): void {
  root.querySelectorAll<HTMLInputElement>('[data-demo-visual-param]').forEach((input) => {
    input.addEventListener('input', () => {
      const name = input.dataset.demoVisualParam;
      if (!name) return;
      void visual.updateParameter(name, Number(input.value)).catch((error: unknown) => {
        showVisualError(root, error instanceof Error ? error.message : String(error));
      });
    });
  });
}

/** Create and initialize the platform visual adapter */
export async function createDemoVisualAdapter(
  app: PlatformApplication,
): Promise<VisualEngineAdapter> {
  const visual = createVisualEngineAdapter({ eventBus: app.eventBus });
  await visual.init();
  return visual;
}
