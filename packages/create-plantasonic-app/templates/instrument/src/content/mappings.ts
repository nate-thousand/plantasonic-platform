/**
 * Default transport tempo and bridge reference for {{APP_NAME}}.
 */
export const {{APP_CONST}}_DEFAULT_TEMPO = {{DEFAULT_TEMPO}};

export const {{APP_CONST}}_BRIDGE_REFERENCE = {
  bass: { target: 'density' as const, amount: 0.45 },
  mids: { target: 'motion' as const, amount: 0.4 },
  highs: { target: 'brightness' as const, amount: 0.35 },
  amplitude: { target: 'scale' as const, amount: 0.3 },
  transient: { target: 'glitch' as const, amount: 0.25 },
};
