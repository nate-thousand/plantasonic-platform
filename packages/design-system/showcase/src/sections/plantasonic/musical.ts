import { psComponent, psSection } from '../../lib/plantasonic-ui';

export function renderPsMusical(): string {
  return psSection(
    'Musical Components',
    'Note, scale, chord, and keyboard reference UI.',
    [pianoKeyboard(), noteBadge(), scaleBadge(), chordBadge(), musicalParam()].join(''),
  );
}

function pianoKeyboard(): string {
  return psComponent({ name: 'Piano Keyboard', purpose: 'Visual piano key layout for note input display.', description: 'Compact octave reference with white/black keys.', usage: 'ps-piano + ps-piano__key modifiers', tokens: ['--ds-color-surface-raised', '--ds-color-primary'], a11y: ['Each key: button with aria-label note name', 'roving tabindex'] },
    `<div class="ps-piano" role="group" aria-label="One octave"><button type="button" class="ps-piano__key ps-piano__key--active" aria-label="C4">C</button><button type="button" class="ps-piano__key ps-piano__key--black" aria-label="C#4"></button><button type="button" class="ps-piano__key" aria-label="D4">D</button><button type="button" class="ps-piano__key ps-piano__key--black" aria-label="D#4"></button><button type="button" class="ps-piano__key" aria-label="E4">E</button><button type="button" class="ps-piano__key" aria-label="F4">F</button><button type="button" class="ps-piano__key ps-piano__key--black" aria-label="F#4"></button><button type="button" class="ps-piano__key" aria-label="G4">G</button></div>`);
}

function noteBadge(): string {
  return psComponent({ name: 'Note Badge', purpose: 'Display active or selected note.', description: 'Accent-colored note pill.', usage: 'ps-note-badge', tokens: ['--ds-color-text-accent'], a11y: ['Readable text, not color alone'] },
    `<span class="ps-note-badge">A4</span> <span class="ps-note-badge">F#3</span>`);
}

function scaleBadge(): string {
  return psComponent({ name: 'Scale Badge', purpose: 'Show active scale or mode.', description: 'Neutral scale label.', usage: 'ps-scale-badge', tokens: ['--ds-color-overlay-scrim-light'], a11y: ['Full scale name text'] },
    `<span class="ps-scale-badge">Dorian</span> <span class="ps-scale-badge">Minor Pentatonic</span>`);
}

function chordBadge(): string {
  return psComponent({ name: 'Chord Badge', purpose: 'Display detected or selected chord.', description: 'Chord name pill.', usage: 'ps-chord-badge', tokens: ['--ds-color-surface-card'], a11y: ['Chord name as text'] },
    `<span class="ps-chord-badge">Cm7</span> <span class="ps-chord-badge">Gsus4</span>`);
}

function musicalParam(): string {
  return psComponent({ name: 'Musical Parameter Display', purpose: 'Show music-theory parameter with label.', description: 'Label + mono value stack.', usage: 'ps-musical-param', tokens: ['--ds-font-family-mono'], a11y: ['label associated via structure'] },
    `<div class="ps-musical-param"><span class="ps-musical-param__label">Root</span>Db</div>`);
}
