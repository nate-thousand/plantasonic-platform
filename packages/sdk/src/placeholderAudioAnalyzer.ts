import type { AudioFeaturesSnapshot } from '@plantasonic/platform-types';

/**
 * PLACEHOLDER — platform-layer audio analyzer.
 *
 * The Sound Engine exposes `getLevel()` and `getWaveform()` but not band-separated
 * analysis. This module derives bass / mids / highs / transient features from the
 * waveform inside the platform SDK only. Replace when the Sound Engine adapter
 * exposes native FFT band data.
 */
export interface PlaceholderAnalyzerState {
  previousLevel: number;
  previousRms: number;
}

export function createPlaceholderAnalyzerState(): PlaceholderAnalyzerState {
  return { previousLevel: 0, previousRms: 0 };
}

export function analyzePlaceholderAudioFeatures(
  waveform: Float32Array,
  level: number,
  state: PlaceholderAnalyzerState,
): AudioFeaturesSnapshot {
  const amplitude = clamp01(level);

  if (waveform.length === 0) {
    const transient = clamp01(Math.abs(amplitude - state.previousLevel) * 4);
    state.previousLevel = amplitude;
    return {
      amplitude,
      bass: amplitude * 0.6,
      mids: amplitude * 0.35,
      highs: amplitude * 0.2,
      transient,
      timestamp: Date.now(),
    };
  }

  const third = Math.max(1, Math.floor(waveform.length / 3));
  let bassEnergy = 0;
  let midsEnergy = 0;
  let highsEnergy = 0;
  let sumSquares = 0;

  for (let i = 0; i < waveform.length; i++) {
    const sample = waveform[i] ?? 0;
    const square = sample * sample;
    sumSquares += square;
    if (i < third) {
      bassEnergy += square;
    } else if (i < third * 2) {
      midsEnergy += square;
    } else {
      highsEnergy += square;
    }
  }

  const rms = Math.sqrt(sumSquares / waveform.length);
  const bass = clamp01(Math.sqrt(bassEnergy / third) * 2.5);
  const mids = clamp01(Math.sqrt(midsEnergy / third) * 2.5);
  const highs = clamp01(Math.sqrt(highsEnergy / (waveform.length - third * 2 || 1)) * 2.5);
  const transient = clamp01(
    Math.max(Math.abs(amplitude - state.previousLevel), Math.abs(rms - state.previousRms)) * 5,
  );

  state.previousLevel = amplitude;
  state.previousRms = rms;

  return {
    amplitude,
    bass,
    mids,
    highs,
    transient,
    timestamp: Date.now(),
  };
}

export function zeroAudioFeatures(): AudioFeaturesSnapshot {
  return {
    amplitude: 0,
    bass: 0,
    mids: 0,
    highs: 0,
    transient: 0,
    timestamp: Date.now(),
  };
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}
