import {
  createAudioReactiveBridge,
  DEFAULT_AUDIO_REACTIVE_MAPPINGS,
  type PlatformApplication,
} from '@plantasonic/platform';
import type {
  AudioFeature,
  AudioReactiveBridge,
  SoundEngineAdapter,
  VisualEngineAdapter,
} from '@plantasonic/platform-types';

const MAPPING_FEATURES: AudioFeature[] = [
  'bass',
  'mids',
  'highs',
  'amplitude',
  'transient',
];

const FEATURE_LABELS: Record<AudioFeature, string> = {
  bass: 'Bass → Density',
  mids: 'Mids → Motion',
  highs: 'Highs → Brightness',
  amplitude: 'Amplitude → Scale',
  transient: 'Transient → Glitch',
};

/** Audio reactive inspector panel markup */
export function renderAudioReactivePanel(): string {
  const mappingSliders = MAPPING_FEATURES.map((feature) => {
    const defaultAmount =
      DEFAULT_AUDIO_REACTIVE_MAPPINGS.find((mapping) => mapping.feature === feature)?.amount ??
      0.4;
    return `
    <div class="mb-2">
      <label class="form-label small text-muted" for="bridge-map-${feature}">${FEATURE_LABELS[feature]}</label>
      <input type="range" class="form-range" id="bridge-map-${feature}" data-demo-bridge-map="${feature}" min="0" max="1" step="0.01" value="${defaultAmount}" disabled>
    </div>`;
  }).join('');

  return `
    <div class="form-check form-switch mb-3">
      <input class="form-check-input" type="checkbox" id="bridge-enabled" data-demo-bridge-enabled disabled>
      <label class="form-check-label small" for="bridge-enabled">Audio Reactive</label>
    </div>
    ${mappingSliders}
    <div class="mb-2">
      <label class="form-label small text-muted" for="bridge-sensitivity">Sensitivity</label>
      <input type="range" class="form-range" id="bridge-sensitivity" data-demo-bridge-sensitivity min="0" max="1" step="0.01" value="0.75" disabled>
    </div>
    <div class="mb-2">
      <label class="form-label small text-muted" for="bridge-smoothing">Smoothing</label>
      <input type="range" class="form-range" id="bridge-smoothing" data-demo-bridge-smoothing min="0" max="1" step="0.01" value="0.65" disabled>
    </div>
    <p class="small text-muted mb-0" data-demo-bridge-status>Bridge idle</p>
  `;
}

export function showBridgeError(root: HTMLElement, message: string): void {
  const el = root.querySelector<HTMLElement>('[data-demo-bridge-error]');
  if (!el) return;
  el.hidden = false;
  el.textContent = message;
}

export function clearBridgeError(root: HTMLElement): void {
  const el = root.querySelector<HTMLElement>('[data-demo-bridge-error]');
  if (!el) return;
  el.hidden = true;
  el.textContent = '';
}

export function setBridgeControlsEnabled(root: HTMLElement, enabled: boolean): void {
  root.querySelectorAll<HTMLInputElement>('[data-demo-bridge-enabled]').forEach((input) => {
    input.disabled = !enabled;
  });
  root.querySelectorAll<HTMLInputElement>(
    '[data-demo-bridge-map], [data-demo-bridge-sensitivity], [data-demo-bridge-smoothing]',
  ).forEach((input) => {
    input.disabled = !enabled;
  });
}

function formatBridgeStatus(bridge: AudioReactiveBridge): string {
  const status = bridge.getStatus();
  const amp = status.lastFeatures?.amplitude;
  const ampText = amp !== undefined ? ` · amp ${amp.toFixed(2)}` : '';
  const state = status.running
    ? status.enabled
      ? 'running'
      : 'active (disabled)'
    : status.connected
      ? 'connected'
      : 'idle';
  return `Bridge ${state}${ampText} · ${status.framesProcessed} frames`;
}

export function updateBridgeStatusLabel(root: HTMLElement, bridge: AudioReactiveBridge): void {
  const label = root.querySelector<HTMLElement>('[data-demo-bridge-status]');
  if (label) {
    label.textContent = formatBridgeStatus(bridge);
  }
}

function readMappingsFromUi(root: HTMLElement) {
  return DEFAULT_AUDIO_REACTIVE_MAPPINGS.map((mapping) => {
    const input = root.querySelector<HTMLInputElement>(
      `[data-demo-bridge-map="${mapping.feature}"]`,
    );
    const amount = input ? Number(input.value) : mapping.amount;
    return { ...mapping, amount };
  });
}

function applyBridgeConfigFromUi(root: HTMLElement, bridge: AudioReactiveBridge): void {
  const enabled = root.querySelector<HTMLInputElement>('[data-demo-bridge-enabled]')?.checked ?? false;
  const sensitivity = Number(
    root.querySelector<HTMLInputElement>('[data-demo-bridge-sensitivity]')?.value ?? 0.75,
  );
  const smoothing = Number(
    root.querySelector<HTMLInputElement>('[data-demo-bridge-smoothing]')?.value ?? 0.65,
  );
  bridge.updateMapping({
    enabled,
    sensitivity,
    smoothing,
    mappings: readMappingsFromUi(root),
  });
}

/** Create, initialize, and connect the audio reactive bridge */
export async function createDemoAudioReactiveBridge(
  app: PlatformApplication,
  sound: SoundEngineAdapter,
  visual: VisualEngineAdapter,
): Promise<AudioReactiveBridge> {
  const bridge = createAudioReactiveBridge({ eventBus: app.eventBus });
  await bridge.init();
  bridge.connect(sound, visual);
  return bridge;
}

/** Wire bridge controls and status updates */
export function wireAudioReactiveBridge(
  root: HTMLElement,
  app: PlatformApplication,
  bridge: AudioReactiveBridge,
  sound: SoundEngineAdapter,
  visual: VisualEngineAdapter,
): () => void {
  app.eventBus.on('bridge', (event) => {
    if (event.type === 'bridge:error') {
      const payload = event.payload as { message?: string } | undefined;
      showBridgeError(root, payload?.message ?? 'Bridge error');
      return;
    }
    clearBridgeError(root);
    updateBridgeStatusLabel(root, bridge);
  });

  root.querySelector<HTMLInputElement>('[data-demo-bridge-enabled]')?.addEventListener(
    'change',
    () => {
      applyBridgeConfigFromUi(root, bridge);
      updateBridgeStatusLabel(root, bridge);
      const enabled = bridge.getStatus().enabled;
      const soundPlaying = sound.getStatus().playing;
      const visualPlaying = visual.getStatus().playing;
      if (enabled && soundPlaying && visualPlaying && !bridge.getStatus().running) {
        void startBridgeIfEnabled(root, bridge);
      }
    },
  );

  root.querySelectorAll<HTMLInputElement>('[data-demo-bridge-map]').forEach((input) => {
    input.addEventListener('input', () => {
      applyBridgeConfigFromUi(root, bridge);
      updateBridgeStatusLabel(root, bridge);
    });
  });

  root.querySelector<HTMLInputElement>('[data-demo-bridge-smoothing]')?.addEventListener(
    'input',
    () => {
      applyBridgeConfigFromUi(root, bridge);
      updateBridgeStatusLabel(root, bridge);
    },
  );

  root.querySelector<HTMLInputElement>('[data-demo-bridge-sensitivity]')?.addEventListener(
    'input',
    () => {
      applyBridgeConfigFromUi(root, bridge);
      updateBridgeStatusLabel(root, bridge);
    },
  );

  const interval = window.setInterval(() => {
    updateBridgeStatusLabel(root, bridge);
  }, 500);

  updateBridgeStatusLabel(root, bridge);

  return () => {
    window.clearInterval(interval);
  };
}

/** Start bridge loop during playback; reactive mapping applies only when enabled */
export async function startBridgeIfEnabled(
  root: HTMLElement,
  bridge: AudioReactiveBridge,
): Promise<void> {
  applyBridgeConfigFromUi(root, bridge);
  try {
    clearBridgeError(root);
    if (!bridge.getStatus().running) {
      await bridge.start();
    }
    updateBridgeStatusLabel(root, bridge);
  } catch (error) {
    showBridgeError(root, error instanceof Error ? error.message : String(error));
  }
}

/** Stop bridge loop */
export async function stopBridge(bridge: AudioReactiveBridge): Promise<void> {
  await bridge.stop();
}
