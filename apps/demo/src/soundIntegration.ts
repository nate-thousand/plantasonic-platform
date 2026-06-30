import {
  createSoundEngineAdapter,
  type PlatformApplication,
} from '@plantasonic/platform';
import type { SoundEngineAdapter, VisualEngineAdapter } from '@plantasonic/platform-types';
import { bindTransport } from 'plantasonic-design-system/instrument';

import {
  clearVisualError,
  setVisualControlsEnabled,
  showVisualError,
} from './visualIntegration.js';
import {
  clearBridgeError,
  setBridgeControlsEnabled,
  showBridgeError,
  startBridgeIfEnabled,
  stopBridge,
} from './bridgeIntegration.js';
import { setPerformanceControlsEnabled } from './performanceIntegration.js';
import type { AudioReactiveBridge } from '@plantasonic/platform-types';

/** Sound inspector parameter controls using Bootstrap form-range */
export function renderParameterPanel(): string {
  const ECOLOGY_PARAMS = ['growth', 'bloom', 'roots', 'mold', 'bacteria'] as const;
  const ecologySliders = ECOLOGY_PARAMS.map(
    (name) => `
    <div class="mb-3">
      <label class="form-label small text-muted text-capitalize" for="param-${name}">${name}</label>
      <input type="range" class="form-range" id="param-${name}" data-demo-param="${name}" min="0" max="1" step="0.01" value="0.5" disabled>
    </div>`,
  ).join('');

  return `
    ${ecologySliders}
    <div class="mb-2">
      <label class="form-label small text-muted" for="param-tempo">Tempo (BPM)</label>
      <input type="range" class="form-range" id="param-tempo" data-demo-param="tempo" min="40" max="180" step="1" value="72" disabled>
      <span class="small text-muted" data-demo-tempo-value>72 BPM</span>
    </div>
  `;
}

function showSoundError(root: HTMLElement, message: string): void {
  const el = root.querySelector<HTMLElement>('[data-demo-sound-error]');
  if (!el) return;
  el.hidden = false;
  el.textContent = message;
}

function clearSoundError(root: HTMLElement): void {
  const el = root.querySelector<HTMLElement>('[data-demo-sound-error]');
  if (!el) return;
  el.hidden = true;
  el.textContent = '';
}

function setParameterControlsEnabled(root: HTMLElement, enabled: boolean): void {
  root.querySelectorAll<HTMLInputElement>('[data-demo-param]').forEach((input) => {
    input.disabled = !enabled;
  });
}

export function setEngineControlsEnabled(root: HTMLElement, enabled: boolean): void {
  setParameterControlsEnabled(root, enabled);
  setVisualControlsEnabled(root, enabled);
  setBridgeControlsEnabled(root, enabled);
  setPerformanceControlsEnabled(root, enabled);
}

/** Shared transport actions for UI and performance controls */
export function createEngineTransportHandlers(
  root: HTMLElement,
  app: PlatformApplication,
  sound: SoundEngineAdapter,
  visual: VisualEngineAdapter,
  bridge: AudioReactiveBridge,
) {
  const runPlay = async (): Promise<void> => {
    clearSoundError(root);
    clearVisualError(root);
    clearBridgeError(root);
    await Promise.all([sound.start(), visual.start()]);
    await startBridgeIfEnabled(root, bridge);
    app.start();
    setEngineControlsEnabled(root, true);
  };

  const runStop = async (): Promise<void> => {
    clearSoundError(root);
    clearVisualError(root);
    clearBridgeError(root);
    await stopBridge(bridge);
    await Promise.all([sound.stop(), visual.stop()]);
    app.stop();
  };

  let playing = false;

  return {
    onPlay: runPlay,
    onStop: runStop,
    onToggle: async (): Promise<void> => {
      if (playing) {
        await runStop();
        playing = false;
      } else {
        await runPlay();
        playing = true;
      }
    },
  };
}

/** Wire sound adapter error handling and parameter controls */
export function wireEngineDemo(
  root: HTMLElement,
  app: PlatformApplication,
  sound: SoundEngineAdapter,
): void {
  app.eventBus.on('sound', (event) => {
    if (event.type === 'sound:error') {
      const payload = event.payload as { message?: string } | undefined;
      showSoundError(root, payload?.message ?? 'Sound engine error');
      return;
    }
    clearSoundError(root);
  });

  app.eventBus.on('visual', (event) => {
    if (event.type === 'visual:error') {
      const payload = event.payload as { message?: string } | undefined;
      showVisualError(root, payload?.message ?? 'Visual engine error');
    }
  });

  root.querySelectorAll<HTMLInputElement>('[data-demo-param]').forEach((input) => {
    input.addEventListener('input', () => {
      const name = input.dataset.demoParam;
      if (!name) return;
      const value = Number(input.value);
      if (name === 'tempo') {
        const label = root.querySelector('[data-demo-tempo-value]');
        if (label) label.textContent = `${value} BPM`;
      }
      void sound.updateParameter(name, value).catch((error: unknown) => {
        showSoundError(root, error instanceof Error ? error.message : String(error));
      });
    });
  });
}

/** Create and initialize the platform sound adapter (no audio unlock) */
export async function createDemoSoundAdapter(
  app: PlatformApplication,
): Promise<SoundEngineAdapter> {
  const sound = createSoundEngineAdapter({ eventBus: app.eventBus });
  await sound.init();
  return sound;
}

/** Bind transport play/stop to sound + visual engines, bridge, and platform lifecycle */
export function bindEngineTransport(
  root: HTMLElement,
  app: PlatformApplication,
  sound: SoundEngineAdapter,
  visual: VisualEngineAdapter,
  bridge: AudioReactiveBridge,
): () => void {
  return bindTransport(root, {
    play: (state) => {
      void (async () => {
        try {
          clearSoundError(root);
          clearVisualError(root);
          clearBridgeError(root);
          if (state.playing) {
            await Promise.all([sound.start(), visual.start()]);
            await startBridgeIfEnabled(root, bridge);
            app.start();
            setEngineControlsEnabled(root, true);
          } else {
            await stopBridge(bridge);
            await Promise.all([sound.stop(), visual.stop()]);
            app.pause();
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          showSoundError(root, message);
          showVisualError(root, message);
          showBridgeError(root, message);
        }
      })();
    },
    stop: () => {
      void (async () => {
        try {
          clearSoundError(root);
          clearVisualError(root);
          clearBridgeError(root);
          await stopBridge(bridge);
          await Promise.all([sound.stop(), visual.stop()]);
          app.stop();
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          showSoundError(root, message);
          showVisualError(root, message);
          showBridgeError(root, message);
        }
      })();
    },
  });
}
