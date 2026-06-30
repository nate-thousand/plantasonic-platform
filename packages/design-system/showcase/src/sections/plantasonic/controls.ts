import { psComponent, psSection } from '../../lib/plantasonic-ui';

const T = ['--ds-color-primary', '--ps-slider-thumb', '--ps-touch-target', '--ds-color-surface-input'];

export function renderPsControls(): string {
  return psSection(
    'Controls',
    'Tactile instrument controls — knobs, sliders, toggles, and parameter inputs.',
    [
      knob(), linearSlider(), verticalSlider(), toggle(), segmented(),
      buttonGroup(), stepper(), numericInput(), paramChip(), valueDisplay(),
    ].join(''),
  );
}

function knob(): string {
  return psComponent({
    name: 'Rotary Knob',
    purpose: 'Primary tactile control for continuous parameters.',
    description: 'CSS-only rotary reference with conic fill and indicator cap.',
    usage: 'Wrap in application logic for drag/keyboard value changes. Set --ps-knob-value 0–100.',
    variants: ['compact', 'comfortable', 'expanded'],
    states: ['default', 'hover', 'focus', 'active', 'disabled'],
    tokens: ['--ps-touch-target', '--ds-color-primary', '--ds-color-surface-input'],
    bootstrap: ['d-flex', 'flex-column', 'align-items-center'],
    a11y: ['role="slider"', 'aria-valuemin/max/now', 'tabindex="0"', 'aria-label'],
  }, `<div class="d-flex flex-wrap gap-4 align-items-end">
    <div><div class="ps-knob ps--comfortable" role="slider" tabindex="0" aria-label="Filter cutoff" aria-valuemin="0" aria-valuemax="100" aria-valuenow="65" style="--ps-knob-value:65"><div class="ps-knob__ring"></div><div class="ps-knob__indicator"></div><div class="ps-knob__cap"></div></div><span class="ps-knob__label">Cutoff</span></div>
    <div><div class="ps-knob ps--compact ps-is-disabled" style="--ps-knob-value:30"><div class="ps-knob__ring"></div><div class="ps-knob__indicator"></div><div class="ps-knob__cap"></div></div><span class="ps-knob__label">Disabled</span></div>
  </div>`);
}

function linearSlider(): string {
  return psComponent({
    name: 'Linear Slider',
    purpose: 'Horizontal continuous value control.',
    description: 'Track + fill + thumb using product slider tokens.',
    usage: 'Set --ps-slider-value. Pair with label and numeric readout.',
    variants: ['compact', 'comfortable'],
    states: ['default', 'hover', 'focus', 'disabled'],
    tokens: ['--ps-slider-track', '--ps-slider-thumb'],
    a11y: ['Associated label', 'aria-valuenow on input alternative'],
  }, `<div class="ps-slider ps--comfortable" style="--ps-slider-value:65"><span class="small text-muted">Gain</span><div class="ps-slider__track"><div class="ps-slider__fill"></div><div class="ps-slider__thumb"></div></div><span class="ps-slider__label">65%</span></div>`);
}

function verticalSlider(): string {
  return psComponent({
    name: 'Vertical Slider',
    purpose: 'Vertical continuous control for mixer-style layouts.',
    description: 'Rotated slider track pattern using ps-slider--vertical.',
    usage: 'Use in control clusters and dock layouts.',
    tokens: ['--ps-slider-track', '--ps-slider-thumb'],
    a11y: ['Min touch target height', 'Visible focus on container'],
  }, `<div class="ps-slider ps-slider--vertical" style="--ps-slider-value:72"><div class="ps-slider__track"><div class="ps-slider__fill"></div><div class="ps-slider__thumb"></div></div></div>`);
}

function toggle(): string {
  return psComponent({
    name: 'Toggle',
    purpose: 'Binary on/off control with instrument feel.',
    description: 'Custom toggle distinct from Bootstrap switch.',
    usage: 'Add ps-toggle--on for selected state.',
    states: ['off', 'on', 'disabled'],
    tokens: ['--ds-color-primary', '--ds-color-surface-input'],
    a11y: ['role="switch"', 'aria-checked', 'keyboard Space to toggle'],
  }, `<div class="d-flex gap-3"><div class="ps-toggle ps-toggle--on" role="switch" aria-checked="true" tabindex="0"><div class="ps-toggle__track"><div class="ps-toggle__thumb"></div></div><span class="ps-toggle__label">Sync</span></div>
    <div class="ps-toggle ps-is-disabled" role="switch" aria-checked="false"><div class="ps-toggle__track"><div class="ps-toggle__thumb"></div></div><span class="ps-toggle__label">Off</span></div></div>`);
}

function segmented(): string {
  return psComponent({
    name: 'Segmented Control',
    purpose: 'Mutually exclusive mode selection.',
    description: 'Inline segmented button group with selected state.',
    usage: 'One ps-segmented__item--selected at a time.',
    states: ['default', 'selected', 'focus'],
    tokens: ['--ds-color-surface-overlay', '--ds-shadow-sm'],
    a11y: ['role="radiogroup"', 'roving tabindex on items'],
  }, `<div class="ps-segmented" role="radiogroup" aria-label="Waveform"><button type="button" class="ps-segmented__item ps-segmented__item--selected">Sine</button><button type="button" class="ps-segmented__item">Saw</button><button type="button" class="ps-segmented__item">Square</button></div>`);
}

function buttonGroup(): string {
  return psComponent({
    name: 'Button Group',
    purpose: 'Grouped related actions with shared chrome.',
    description: 'Uses Bootstrap btn-group with Plantasonic transport styling.',
    usage: 'Combine ps-transport-btn for instrument actions.',
    tokens: ['--ds-color-surface-raised', '--ps-touch-target'],
    bootstrap: ['btn-group'],
    a11y: ['role="group"', 'aria-label'],
  }, `<div class="btn-group" role="group" aria-label="Quantize"><button type="button" class="ps-transport-btn ps-transport-btn--active">1/4</button><button type="button" class="ps-transport-btn">1/8</button><button type="button" class="ps-transport-btn">1/16</button></div>`);
}

function stepper(): string {
  return psComponent({
    name: 'Stepper',
    purpose: 'Increment/decrement numeric values.',
    description: 'Compact +/- control with centered value.',
    usage: 'Wire click handlers in application layer.',
    tokens: ['--ps-touch-target', '--ds-color-surface-raised'],
    a11y: ['button type with aria-label on +/-', 'aria-live on value'],
  }, `<div class="ps-stepper"><button type="button" class="ps-stepper__btn" aria-label="Decrease">−</button><span class="ps-stepper__value">4</span><button type="button" class="ps-stepper__btn" aria-label="Increase">+</button></div>`);
}

function numericInput(): string {
  return psComponent({
    name: 'Numeric Input',
    purpose: 'Direct numeric entry for precise values.',
    description: 'Bootstrap form-control with mono tabular nums.',
    usage: 'Use inputmode="decimal" for mobile keypads.',
    tokens: ['--ds-color-surface-input', '--ds-font-family-mono'],
    bootstrap: ['form-control'],
    a11y: ['label', 'input type="number"', 'aria-describedby for units'],
  }, `<label class="form-label" for="ps-num">BPM</label><input id="ps-num" type="number" class="form-control font-monospace" value="120" min="40" max="240" style="max-width:6rem" />`);
}

function paramChip(): string {
  return psComponent({
    name: 'Parameter Chip',
    purpose: 'Compact label + value for dense parameter rows.',
    description: 'Inline chip showing parameter name and current value.',
    usage: 'Click to focus associated control.',
    tokens: ['--ds-color-text-accent', '--ds-color-surface-overlay'],
    a11y: ['button or interactive chip with aria-label'],
  }, `<button type="button" class="ps-param-chip"><span>Detune</span><span class="ps-param-chip__value">+7¢</span></button>`);
}

function valueDisplay(): string {
  return psComponent({
    name: 'Value Display',
    purpose: 'Read-only numeric or text readout.',
    description: 'Monospace tabular display for live values.',
    usage: 'Update text from application state; no logic here.',
    variants: ['compact', 'default', 'expanded'],
    tokens: ['--ds-font-family-mono', '--ds-color-text-primary'],
    a11y: ['aria-live="polite" when value changes in apps'],
  }, `<div class="d-flex gap-4 align-items-baseline"><span class="ps-value-display ps-value-display--compact">0.72</span><span class="ps-value-display">120.00</span><span class="ps-value-display ps-value-display--expanded">440</span></div>`);
}
