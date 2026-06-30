export type ViewportPreset = 'desktop' | 'tablet' | 'mobile' | 'free';

const WIDTHS: Record<Exclude<ViewportPreset, 'free'>, number> = {
  desktop: 1280,
  tablet: 768,
  mobile: 375,
};

export function applyViewport(preset: ViewportPreset, viewportEl: HTMLElement, widthInput?: HTMLInputElement): void {
  if (preset === 'free') {
    viewportEl.style.maxWidth = '';
    viewportEl.dataset.viewport = 'free';
    return;
  }
  const w = WIDTHS[preset];
  viewportEl.style.maxWidth = `${w}px`;
  viewportEl.dataset.viewport = preset;
  if (widthInput) widthInput.value = String(w);
}

export function bindViewportControls(
  viewportEl: HTMLElement,
  buttons: NodeListOf<HTMLButtonElement>,
  widthInput: HTMLInputElement | null,
): void {
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const preset = btn.dataset.viewport as ViewportPreset;
      buttons.forEach((b) => b.classList.toggle('active', b === btn));
      applyViewport(preset, viewportEl, widthInput ?? undefined);
    });
  });

  widthInput?.addEventListener('input', () => {
    const w = Number(widthInput.value);
    if (w > 200) {
      viewportEl.style.maxWidth = `${w}px`;
      viewportEl.dataset.viewport = 'free';
      buttons.forEach((b) => b.classList.remove('active'));
    }
  });
}
