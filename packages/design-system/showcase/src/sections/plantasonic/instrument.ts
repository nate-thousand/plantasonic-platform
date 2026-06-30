import { psComponent, psSection } from '../../lib/plantasonic-ui';

export function renderPsInstrument(): string {
  return psSection(
    'Instrument Components',
    'Transport, timing, status, and metering — visual reference only.',
    [
      transportBar(), playBtn(), stopBtn(), pauseBtn(), recordBtn(),
      tempoDisplay(), timeDisplay(), statusIndicator(), levelMeter(), stereoMeter(), cpuMeter(),
    ].join(''),
  );
}

function transportBar(): string {
  return psComponent({
    name: 'Transport Bar',
    purpose: 'Primary playback control strip.',
    description: 'Dock-height bar with transport buttons and displays.',
    usage: 'Compose ps-transport-btn and display components.',
    tokens: ['--ps-dock-height', '--ds-color-surface-dock'],
    a11y: ['aria-label on bar', 'distinct button labels'],
  }, `<div class="ps-transport" role="toolbar" aria-label="Transport">
    <button type="button" class="ps-transport-btn ps-transport-btn--primary ps-transport-btn--active" aria-label="Play">▶</button>
    <button type="button" class="ps-transport-btn" aria-label="Pause">⏸</button>
    <button type="button" class="ps-transport-btn" aria-label="Stop">■</button>
    <button type="button" class="ps-transport-btn ps-transport-btn--record" aria-label="Record">●</button>
    <span class="ps-tempo-display">120 BPM</span>
    <span class="ps-time-display">01:24.8</span>
  </div>`);
}

function playBtn(): string {
  return psComponent({ name: 'Play Button', purpose: 'Start playback.', description: 'Primary transport action.', usage: 'ps-transport-btn--primary', tokens: ['--ds-color-primary'], a11y: ['aria-label="Play"', 'aria-pressed when active'] },
    `<button type="button" class="ps-transport-btn ps-transport-btn--primary" aria-label="Play">▶</button>`);
}

function stopBtn(): string {
  return psComponent({ name: 'Stop Button', purpose: 'Stop playback.', description: 'Square stop icon.', usage: 'ps-transport-btn', tokens: ['--ds-color-surface-raised'], a11y: ['aria-label="Stop"'] },
    `<button type="button" class="ps-transport-btn" aria-label="Stop">■</button>`);
}

function pauseBtn(): string {
  return psComponent({ name: 'Pause Button', purpose: 'Pause playback.', description: 'Pause icon transport control.', usage: 'ps-transport-btn', tokens: ['--ps-touch-target'], a11y: ['aria-label="Pause"', 'aria-pressed when paused'] },
    `<button type="button" class="ps-transport-btn ps-transport-btn--active" aria-label="Pause" aria-pressed="true">⏸</button>`);
}

function recordBtn(): string {
  return psComponent({ name: 'Record Button', purpose: 'Arm recording.', description: 'Red-accent record control.', usage: 'ps-transport-btn--record', tokens: ['--ds-color-error'], a11y: ['aria-label="Record"', 'aria-pressed when recording'] },
    `<button type="button" class="ps-transport-btn ps-transport-btn--record ps-transport-btn--active" aria-label="Record">●</button>`);
}

function tempoDisplay(): string {
  return psComponent({ name: 'Tempo Display', purpose: 'Show current BPM.', description: 'Monospace tempo readout.', usage: 'ps-tempo-display', tokens: ['--ds-font-family-mono', '--ds-color-surface-input'], a11y: ['aria-live="polite" in apps'] },
    `<span class="ps-tempo-display">128.0 BPM</span>`);
}

function timeDisplay(): string {
  return psComponent({ name: 'Time Display', purpose: 'Show transport position.', description: 'Monospace timecode.', usage: 'ps-time-display', tokens: ['--ds-font-family-mono'], a11y: ['aria-live="off" unless actively changing'] },
    `<span class="ps-time-display">00:42.016</span>`);
}

function statusIndicator(): string {
  return psComponent({ name: 'Status Indicator', purpose: 'Show system/connection state.', description: 'Colored dot with optional pulse.', usage: 'ps-status-dot + modifier', tokens: ['--ds-color-success', '--ds-color-warning', '--ds-color-error'], a11y: ['aria-label describing status text adjacent'] },
    `<div class="d-flex gap-3 align-items-center"><span class="ps-status-dot ps-status-dot--active"></span><span class="small">Running</span><span class="ps-status-dot ps-status-dot--warning"></span><span class="small">CPU high</span></div>`);
}

function levelMeter(): string {
  return psComponent({ name: 'Level Meter', purpose: 'Single-channel level visualization.', description: 'Horizontal meter bar.', usage: 'Set width on ps-meter__bar inline or via CSS var.', tokens: ['--ds-color-primary', '--ds-color-surface-sunken'], a11y: ['role="meter"', 'aria-valuenow/min/max'] },
    `<div class="ps-meter" role="meter" aria-valuenow="65" aria-valuemin="0" aria-valuemax="100" aria-label="Output level"><div class="ps-meter__bar" style="width:65%"></div></div>`);
}

function stereoMeter(): string {
  return psComponent({ name: 'Stereo Meter', purpose: 'Dual-channel level visualization.', description: 'L/R meter pair.', usage: 'ps-meter--stereo', tokens: ['--ds-color-primary'], a11y: ['Label L/R channels'] },
    `<div class="ps-meter ps-meter--stereo"><div class="ps-meter" aria-hidden="true"><div class="ps-meter__bar" style="width:80%"></div></div><div class="ps-meter" aria-hidden="true"><div class="ps-meter__bar" style="width:55%"></div></div></div>`);
}

function cpuMeter(): string {
  return psComponent({ name: 'CPU Meter', purpose: 'Performance load indicator.', description: 'Warning-colored CPU bar.', usage: 'ps-meter--cpu', tokens: ['--ds-color-warning'], a11y: ['aria-label="CPU usage"'] },
    `<div class="ps-meter ps-meter--cpu" style="max-width:12rem"><div class="ps-meter__bar" style="width:38%"></div></div><span class="small text-muted ms-2">38%</span>`);
}
