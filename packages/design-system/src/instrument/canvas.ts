/**
 * Canvas mount system — swap renderers without changing layout.
 *
 * Applications describe a renderer as a `CanvasAdapter` and call `mountCanvas`.
 * The framework owns the lifecycle (create → resize via ResizeObserver →
 * visibility → destroy) and device-pixel-ratio handling. Built-in adapters
 * cover Canvas2D / HTML / Image / Video; WebGL / Three / Pixi / ASCII / SVG /
 * Mixed are supplied by the application as adapters (shipped adapters land in a
 * later release).
 */

export type CanvasType =
  | 'canvas2d'
  | 'webgl'
  | 'svg'
  | 'html'
  | 'three'
  | 'pixi'
  | 'ascii'
  | 'video'
  | 'image'
  | 'mixed';

export type CanvasContext = {
  /** Element the renderer draws into. */
  host: HTMLElement;
  /** CSS pixel width. */
  width: number;
  /** CSS pixel height. */
  height: number;
  /** Device pixel ratio. */
  dpr: number;
};

export type CanvasAdapter<T = unknown> = {
  type: CanvasType;
  /** Create the renderer; return an optional handle passed to later hooks. */
  create: (ctx: CanvasContext) => T;
  /** Called whenever the host resizes (debounced via ResizeObserver). */
  resize?: (handle: T, ctx: CanvasContext) => void;
  /** Called when stage visibility changes (tab hidden / scrolled offscreen). */
  visibility?: (handle: T, visible: boolean) => void;
  /** Tear down the renderer and release resources. */
  destroy?: (handle: T) => void;
};

export type CanvasMount<T = unknown> = {
  type: CanvasType;
  handle: T;
  host: HTMLElement;
  /** Force a resize pass. */
  resize: () => void;
  /** Destroy the renderer and detach observers. */
  destroy: () => void;
};

function measure(host: HTMLElement): CanvasContext {
  const rect = typeof host.getBoundingClientRect === 'function' ? host.getBoundingClientRect() : { width: 0, height: 0 };
  const dpr = typeof window !== 'undefined' && window.devicePixelRatio ? window.devicePixelRatio : 1;
  return { host, width: Math.round(rect.width), height: Math.round(rect.height), dpr };
}

function resolveHost(stageEl: HTMLElement): HTMLElement {
  const mount = stageEl.querySelector?.('[data-ps-canvas-mount]');
  return (mount as HTMLElement) ?? stageEl;
}

/**
 * Mount a renderer into a stage element (or its `[data-ps-canvas-mount]` slot).
 * Returns a `CanvasMount` with `resize()` and `destroy()`.
 */
export function mountCanvas<T = unknown>(stageEl: HTMLElement, adapter: CanvasAdapter<T>): CanvasMount<T> {
  const host = resolveHost(stageEl);
  let ctx = measure(host);
  const handle = adapter.create(ctx);

  const doResize = () => {
    ctx = measure(host);
    adapter.resize?.(handle, ctx);
  };

  let ro: ResizeObserver | undefined;
  if (typeof ResizeObserver === 'function') {
    ro = new ResizeObserver(() => doResize());
    ro.observe(host);
  }

  let io: IntersectionObserver | undefined;
  const onVisibility = () => {
    const visible = typeof document === 'undefined' || document.visibilityState !== 'hidden';
    adapter.visibility?.(handle, visible);
  };
  if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
    document.addEventListener('visibilitychange', onVisibility);
  }
  if (typeof IntersectionObserver === 'function') {
    io = new IntersectionObserver((entries) => {
      for (const entry of entries) adapter.visibility?.(handle, entry.isIntersecting);
    });
    io.observe(host);
  }

  return {
    type: adapter.type,
    handle,
    host,
    resize: doResize,
    destroy: () => {
      ro?.disconnect();
      io?.disconnect();
      if (typeof document !== 'undefined' && typeof document.removeEventListener === 'function') {
        document.removeEventListener('visibilitychange', onVisibility);
      }
      adapter.destroy?.(handle);
    },
  };
}

// ── Built-in adapters ────────────────────────────────────────────────────────

/** Canvas2D adapter. `draw` is called on create and resize with the 2D context. */
export function canvas2dAdapter(
  draw: (g: CanvasRenderingContext2D, ctx: CanvasContext) => void,
): CanvasAdapter<HTMLCanvasElement> {
  return {
    type: 'canvas2d',
    create: (ctx) => {
      const canvas = ctx.host.ownerDocument.createElement('canvas');
      ctx.host.appendChild(canvas);
      applyCanvasSize(canvas, ctx);
      const g = canvas.getContext('2d');
      if (g) draw(g, ctx);
      return canvas;
    },
    resize: (canvas, ctx) => {
      applyCanvasSize(canvas, ctx);
      const g = canvas.getContext('2d');
      if (g) draw(g, ctx);
    },
    destroy: (canvas) => canvas.remove(),
  };
}

function applyCanvasSize(canvas: HTMLCanvasElement, ctx: CanvasContext): void {
  canvas.width = Math.max(1, Math.round(ctx.width * ctx.dpr));
  canvas.height = Math.max(1, Math.round(ctx.height * ctx.dpr));
  canvas.style.width = '100%';
  canvas.style.height = '100%';
}

/** HTML adapter — render arbitrary markup into the mount. */
export function htmlAdapter(html: string): CanvasAdapter<HTMLElement> {
  return {
    type: 'html',
    create: (ctx) => {
      const layer = ctx.host.ownerDocument.createElement('div');
      layer.className = 'ps-canvas-mount__layer';
      layer.innerHTML = html;
      ctx.host.appendChild(layer);
      return layer;
    },
    destroy: (layer) => layer.remove(),
  };
}

/** Image adapter. */
export function imageAdapter(src: string, alt = ''): CanvasAdapter<HTMLImageElement> {
  return {
    type: 'image',
    create: (ctx) => {
      const img = ctx.host.ownerDocument.createElement('img');
      img.src = src;
      img.alt = alt;
      ctx.host.appendChild(img);
      return img;
    },
    destroy: (img) => img.remove(),
  };
}

/** Video adapter. */
export function videoAdapter(
  src: string,
  options: { loop?: boolean; muted?: boolean; autoplay?: boolean } = {},
): CanvasAdapter<HTMLVideoElement> {
  return {
    type: 'video',
    create: (ctx) => {
      const video = ctx.host.ownerDocument.createElement('video');
      video.src = src;
      video.loop = options.loop ?? true;
      video.muted = options.muted ?? true;
      video.autoplay = options.autoplay ?? true;
      video.playsInline = true;
      ctx.host.appendChild(video);
      return video;
    },
    visibility: (video, visible) => {
      if (!visible) video.pause();
      else if (options.autoplay ?? true) void video.play?.().catch(() => {});
    },
    destroy: (video) => {
      video.pause?.();
      video.remove();
    },
  };
}
