/**
 * Default transport tempo and bridge reference for {{APP_NAME}}.
 *
 * Audio→visual mappings live on each PresetBundle.audioReactive.mappings entry.
 * Tune sensitivity/smoothing per bundle in presetBundles.ts.
 */
export const {{APP_CONST}}_DEFAULT_TEMPO = {{DEFAULT_TEMPO}};

/** Reference mapping set — mirrors platform DEFAULT_AUDIO_REACTIVE_MAPPINGS */
export const {{APP_CONST}}_BRIDGE_REFERENCE = {
  bass: { target: 'density' as const, amount: 0.45 },
  mids: { target: 'motion' as const, amount: 0.4 },
  highs: { target: 'brightness' as const, amount: 0.35 },
  amplitude: { target: 'scale' as const, amount: 0.3 },
  transient: { target: 'glitch' as const, amount: 0.25 },
};
