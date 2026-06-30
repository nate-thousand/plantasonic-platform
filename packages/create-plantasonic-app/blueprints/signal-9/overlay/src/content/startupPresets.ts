/**
 * Signal 9 startup preset catalog — extended metadata beyond PresetBundle schema.
 * Blueprint: signal-9
 */
export const {{APP_CONST}}_STARTUP_PRESETS = [
  {
    id: 'broadcast',
    title: 'Broadcast',
    description: 'Baseline resistance carrier — radio static boot sequence on the CRT grid.',
    mood: 'transmission boot',
    colorAccent: '#00ff9f',
    soundMapping: {
      presetId: 'ambient',
      placeholders: { radioNoise: 0.45, tapeDelay: 0.25, lowPulse: 0.3, broadcastDrone: 0.35 },
    },
    visualMapping: {
      presetId: 'ambient',
      placeholders: { crtScanlines: 0.15, gridHorizon: 0.65, monochromePalette: 0.4, transmissionNoise: 0.2 },
    },
  },
  {
    id: 'interference',
    title: 'Interference',
    description: 'Corrupted transmission static — CRT noise and scanline glitch bursts.',
    mood: 'static disruption',
    colorAccent: '#66eeff',
    soundMapping: {
      presetId: 'mold',
      placeholders: { radioNoise: 0.9, interferenceBursts: 0.8, tapeDelay: 0.35 },
    },
    visualMapping: {
      presetId: 'mold',
      placeholders: { signalInterference: 0.9, crtScanlines: 0.5, glitchPulses: 0.8, transmissionNoise: 0.6 },
    },
  },
  {
    id: 'jammer',
    title: 'Jammer',
    description: 'Grid pulse jamming — broken sub pulses and alarm-tone transients.',
    mood: 'grid resistance',
    colorAccent: '#ffcc00',
    soundMapping: {
      presetId: 'bacteria',
      placeholders: { lowPulse: 0.85, interferenceBursts: 0.55, broadcastDrone: 0.4 },
    },
    visualMapping: {
      presetId: 'bacteria',
      placeholders: { gridHorizon: 0.75, glitchPulses: 0.55, monochromePalette: 0.55 },
    },
  },
  {
    id: 'uplink',
    title: 'Uplink',
    description: 'Resistance uplink burst — tape-delay motion through the broadcast grid.',
    mood: 'encrypted burst',
    colorAccent: '#a78bfa',
    soundMapping: {
      presetId: 'mutation',
      placeholders: { tapeDelay: 0.65, lowPulse: 0.45, broadcastDrone: 0.5 },
    },
    visualMapping: {
      presetId: 'mutation',
      placeholders: { gridHorizon: 0.7, signalInterference: 0.35, transmissionNoise: 0.22 },
    },
  },
  {
    id: 'blackout',
    title: 'Blackout',
    description: 'Total grid collapse — encrypted silence before the next broadcast wave.',
    mood: 'collapse',
    colorAccent: '#ff3355',
    soundMapping: {
      presetId: 'drone',
      placeholders: { broadcastDrone: 0.95, lowPulse: 0.6, interferenceBursts: 0.9 },
    },
    visualMapping: {
      presetId: 'drone',
      placeholders: { monochromePalette: 0.95, crtScanlines: 0.6, glitchPulses: 0.9, gridHorizon: 0.95 },
    },
  },
] as const;
