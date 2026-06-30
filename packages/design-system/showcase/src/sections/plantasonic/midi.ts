import { psComponent, psSection } from '../../lib/plantasonic-ui';

export function renderPsMidi(): string {
  return psSection(
    'MIDI Components',
    'MIDI status and activity UI — no Web MIDI implementation.',
    [midiStatus(), deviceCard(), learnIndicator(), activityIndicator(), velocityMeter(), aftertouchIndicator()].join(''),
  );
}

function midiStatus(): string {
  return psComponent({ name: 'MIDI Status', purpose: 'Show MIDI connection state.', description: 'Status dot + label pattern.', usage: 'Combine ps-status-dot with text.', tokens: ['--ds-color-success'], a11y: ['Text label required, not color alone'] },
    `<div class="d-flex align-items-center gap-2"><span class="ps-status-dot ps-status-dot--active"></span><span class="small">MIDI connected · 2 devices</span></div>`);
}

function deviceCard(): string {
  return psComponent({ name: 'MIDI Device Card', purpose: 'Represent a connected MIDI device.', description: 'Selectable card with name and port.', usage: 'ps-midi-card', tokens: ['--ds-color-surface-card'], a11y: ['button or listitem role', 'aria-selected when active'] },
    `<div class="ps-midi-card ps-is-selected" tabindex="0"><div class="ps-midi-card__name">Arturia KeyLab 61</div><div class="ps-midi-card__meta">Input · Channel 1</div></div>`);
}

function learnIndicator(): string {
  return psComponent({ name: 'MIDI Learn Indicator', purpose: 'Show MIDI learn mode active.', description: 'Pulsing dashed border badge.', usage: 'ps-midi-learn', tokens: ['--ds-color-border-focus', '--ds-color-text-accent'], a11y: ['aria-live="assertive" when learn starts'] },
    `<span class="ps-midi-learn">MIDI Learn — move a control</span>`);
}

function activityIndicator(): string {
  return psComponent({ name: 'MIDI Activity Indicator', purpose: 'Visualize incoming MIDI traffic.', description: 'Animated bar visualization.', usage: 'ps-midi-activity', tokens: ['--ds-color-primary'], a11y: ['Decorative; pair with text for screen readers'] },
    `<div class="ps-midi-activity" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div>`);
}

function velocityMeter(): string {
  return psComponent({ name: 'Velocity Meter', purpose: 'Show note velocity intensity.', description: 'Vertical meter for velocity.', usage: 'ps-meter in narrow column', tokens: ['--ds-color-primary'], a11y: ['aria-valuetext with velocity number'] },
    `<div class="d-flex align-items-end gap-2"><div class="ps-meter" style="width:1.5rem;height:4rem"><div class="ps-meter__bar" style="width:100%;height:82%"></div></div><span class="small font-monospace">vel 104</span></div>`);
}

function aftertouchIndicator(): string {
  return psComponent({ name: 'Aftertouch Indicator', purpose: 'Show poly/channel pressure.', description: 'Parameter chip style pressure readout.', usage: 'ps-param-chip pattern', tokens: ['--ds-color-text-accent'], a11y: ['Label "Aftertouch" visible'] },
    `<span class="ps-param-chip"><span>Aftertouch</span><span class="ps-param-chip__value">0.64</span></span>`);
}
