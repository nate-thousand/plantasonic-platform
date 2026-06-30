import {
  createPerformanceControlManager,
  DEFAULT_PERFORMANCE_MAPPINGS,
  type PlatformApplication,
  type PerformanceControlManagerWithContext,
  type PresetBundleRegistryWithContext,
} from '@plantasonic/platform';
import type {
  AudioReactiveBridge,
  ControlMapping,
  SoundEngineAdapter,
  VisualEngineAdapter,
} from '@plantasonic/platform-types';

/** Performance inspector panel markup */
export function renderPerformancePanel(): string {
  const mappingRows = DEFAULT_PERFORMANCE_MAPPINGS.slice(0, 8)
    .map(
      (mapping) =>
        `<li class="small text-muted">${mapping.source} ${String(mapping.sourceValue)} → ${mapping.target} (${mapping.targetId})</li>`,
    )
    .join('');

  return `
    <div class="form-check form-switch mb-3">
      <input class="form-check-input" type="checkbox" id="performance-enabled" data-demo-performance-enabled disabled>
      <label class="form-check-label small" for="performance-enabled">Performance Mode</label>
    </div>
    <button type="button" class="btn btn-sm btn-outline-secondary w-100 mb-3" data-demo-midi-connect disabled>
      Connect MIDI
    </button>
    <p class="small mb-1"><span class="text-muted">MIDI:</span> <span data-demo-midi-status>Unavailable</span></p>
    <p class="small mb-1"><span class="text-muted">Device:</span> <span data-demo-midi-device>—</span></p>
    <p class="small mb-2"><span class="text-muted">Active notes:</span> <span data-demo-active-notes>—</span></p>
    <p class="small text-muted mb-1">Mappings (sample)</p>
    <ul class="list-unstyled mb-0 ps-2">${mappingRows}</ul>
    <p class="small text-muted mt-2 mb-0" data-demo-performance-hint>Enable performance mode after Play. Keys A–G = notes, 1–5 = bundles, Space = toggle.</p>
  `;
}

function showPerformanceError(root: HTMLElement, message: string): void {
  const el = root.querySelector<HTMLElement>('[data-demo-performance-error]');
  if (!el) return;
  el.hidden = false;
  el.textContent = message;
}

function clearPerformanceError(root: HTMLElement): void {
  const el = root.querySelector<HTMLElement>('[data-demo-performance-error]');
  if (!el) return;
  el.hidden = true;
  el.textContent = '';
}

export function setPerformanceControlsEnabled(root: HTMLElement, enabled: boolean): void {
  root.querySelectorAll<HTMLInputElement>('[data-demo-performance-enabled]').forEach((input) => {
    input.disabled = !enabled;
  });
  root.querySelectorAll<HTMLButtonElement>('[data-demo-midi-connect]').forEach((button) => {
    button.disabled = !enabled;
  });
}

function updatePerformanceStatus(
  root: HTMLElement,
  performance: PerformanceControlManagerWithContext,
): void {
  const status = performance.getStatus();
  const midiStatus = root.querySelector('[data-demo-midi-status]');
  const midiDevice = root.querySelector('[data-demo-midi-device]');
  const activeNotes = root.querySelector('[data-demo-active-notes]');

  if (midiStatus) {
    if (!status.midi.supported) {
      midiStatus.textContent = 'Not supported (keyboard fallback)';
    } else if (status.midi.connected) {
      midiStatus.textContent = 'Connected';
    } else {
      midiStatus.textContent = 'Not connected';
    }
  }

  if (midiDevice) {
    midiDevice.textContent =
      status.midi.deviceNames.length > 0 ? status.midi.deviceNames.join(', ') : '—';
  }

  if (activeNotes) {
    const notes = [
      ...status.keyboard.activeNotes,
      ...status.midi.activeNotes.map((note) => String(note)),
    ];
    activeNotes.textContent = notes.length > 0 ? notes.join(', ') : '—';
  }
}

export interface EngineTransportHandlers {
  onPlay: () => Promise<void>;
  onStop: () => Promise<void>;
  onToggle: () => Promise<void>;
}

/** Create and wire the platform performance control manager */
export async function createDemoPerformanceControls(
  app: PlatformApplication,
  root: HTMLElement,
  sound: SoundEngineAdapter,
  visual: VisualEngineAdapter,
  bridge: AudioReactiveBridge,
  bundleRegistry: PresetBundleRegistryWithContext,
  transport: EngineTransportHandlers,
): Promise<PerformanceControlManagerWithContext> {
  const performance = createPerformanceControlManager({ eventBus: app.eventBus });
  await performance.init();

  performance.setContext({
    sound,
    visual,
    bridge,
    presetBundles: bundleRegistry,
    onTransportPlay: transport.onPlay,
    onTransportStop: transport.onStop,
    onTransportToggle: transport.onToggle,
    onWorkspaceAction: async (action) => {
      if (action === 'focus-inspector') {
        const inspector = root.querySelector('[data-ps-cw-surface="inspector"]');
        inspector?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    },
    onUIAction: async (action, value) => {
      if (action === 'bridge-toggle' && typeof value === 'boolean') {
        bridge.updateMapping({ enabled: value });
      }
    },
  });

  await performance.start();
  return performance;
}

/** Wire performance panel controls and status updates */
export function wirePerformanceControls(
  root: HTMLElement,
  app: PlatformApplication,
  performance: PerformanceControlManagerWithContext,
): () => void {
  app.eventBus.on('performance', (event) => {
    if (event.type === 'performance:error') {
      const payload = event.payload as { message?: string } | undefined;
      showPerformanceError(root, payload?.message ?? 'Performance control error');
      return;
    }
    clearPerformanceError(root);
    updatePerformanceStatus(root, performance);
  });

  root.querySelector<HTMLInputElement>('[data-demo-performance-enabled]')?.addEventListener(
    'change',
    (event) => {
      const enabled = (event.target as HTMLInputElement).checked;
      performance.enablePerformanceMode(enabled);
      updatePerformanceStatus(root, performance);
    },
  );

  root.querySelector<HTMLButtonElement>('[data-demo-midi-connect]')?.addEventListener('click', () => {
    void (async () => {
      try {
        clearPerformanceError(root);
        const ok = await performance.requestMIDIAccess();
        if (!ok) {
          showPerformanceError(root, 'MIDI access denied or unavailable — keyboard fallback active');
        }
        updatePerformanceStatus(root, performance);
      } catch (error) {
        showPerformanceError(root, error instanceof Error ? error.message : String(error));
      }
    })();
  });

  const interval = window.setInterval(() => {
    updatePerformanceStatus(root, performance);
  }, 400);

  updatePerformanceStatus(root, performance);

  return () => {
    window.clearInterval(interval);
  };
}

export function formatMappingList(mappings: ControlMapping[]): string {
  return mappings
    .filter((mapping) => mapping.enabled !== false)
    .map((mapping) => `${mapping.source}:${String(mapping.sourceValue)}→${mapping.targetId}`)
    .join(' · ');
}
