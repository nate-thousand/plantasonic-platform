/**
 * Shared Engine Architecture — installable engines, never embedded.
 */
import type { EngineId, EngineSpec } from './types.ts';

export const ENGINE_CATALOG: EngineSpec[] = [
  {
    id: 'engine.sound',
    name: 'Sound Engine',
    version: '1.0.0-beta.1',
    purpose: 'Generative audio synthesis and analysis (plantasia-sound-engine).',
    status: 'beta',
    package: 'plantasia-sound-engine',
    documentation: 'https://github.com/nate-thousand/plantasia-sound-engine',
  },
  {
    id: 'engine.visual',
    name: 'Visual Engine',
    version: '1.0.0',
    purpose: 'ASCII / canvas visual rendering (ascii-visual-engine).',
    status: 'stable',
    package: 'ascii-visual-engine',
    documentation: 'https://github.com/nate-thousand/ascii-visual-engine',
  },
  {
    id: 'engine.physics',
    name: 'Physics Engine',
    version: '0.1.0',
    purpose: '2D/3D physics simulation adapter contract.',
    status: 'experimental',
  },
  {
    id: 'engine.particle',
    name: 'Particle Engine',
    version: '0.1.0',
    purpose: 'GPU/CPU particle systems with preset-driven emitters.',
    status: 'experimental',
  },
  {
    id: 'engine.animation',
    name: 'Animation Engine',
    version: '0.1.0',
    purpose: 'Timeline and keyframe animation (pairs with motion system).',
    status: 'experimental',
    dependencies: ['engine.visual'],
  },
  {
    id: 'engine.lighting',
    name: 'Lighting Engine',
    version: '0.1.0',
    purpose: 'DMX / fixture control and scene management.',
    status: 'experimental',
    dependencies: ['engine.midi'],
  },
  {
    id: 'engine.midi',
    name: 'MIDI Engine',
    version: '0.1.0',
    purpose: 'Web MIDI input/output and learn mapping.',
    status: 'beta',
  },
  {
    id: 'engine.osc',
    name: 'OSC Engine',
    version: '0.1.0',
    purpose: 'Open Sound Control messaging for installations.',
    status: 'experimental',
  },
  {
    id: 'engine.camera',
    name: 'Camera Engine',
    version: '0.1.0',
    purpose: 'WebRTC / device camera capture for reactive visuals.',
    status: 'experimental',
    dependencies: ['engine.visual'],
  },
  {
    id: 'engine.ai',
    name: 'AI Engine',
    version: '0.1.0',
    purpose: 'LLM and generative AI provider adapter.',
    status: 'beta',
  },
];

const catalog = new Map(ENGINE_CATALOG.map((e) => [e.id, e]));

export function getEngines(): EngineSpec[] {
  return [...ENGINE_CATALOG];
}

export function getEngine(id: EngineId): EngineSpec | undefined {
  return catalog.get(id);
}

/** Resolve engine + transitive dependencies for installation. */
export function resolveEngineInstall(ids: EngineId[]): EngineSpec[] {
  const resolved = new Map<EngineId, EngineSpec>();
  const stack = [...ids];
  while (stack.length) {
    const id = stack.pop()!;
    if (resolved.has(id)) continue;
    const spec = catalog.get(id);
    if (!spec) throw new Error(`Unknown engine: ${id}`);
    resolved.set(id, spec);
    for (const dep of spec.dependencies ?? []) stack.push(dep);
  }
  return [...resolved.values()];
}

/** Default engines per prototype type feature flags. */
export function enginesForPrototype(features: { sound?: boolean; midi?: boolean }, type: string): EngineId[] {
  const ids: EngineId[] = ['engine.visual'];
  if (features.sound) ids.push('engine.sound');
  if (features.midi) ids.push('engine.midi');
  if (type === 'ai-assistant') ids.push('engine.ai');
  if (type === 'lighting-controller') ids.push('engine.lighting');
  return [...new Set(ids)];
}

/** Install instruction for package.json dependencies. */
export function installEngine(id: EngineId): { id: EngineId; package?: string; spec: EngineSpec } {
  const spec = catalog.get(id);
  if (!spec) throw new Error(`Unknown engine: ${id}`);
  return spec.package !== undefined ? { id, package: spec.package, spec } : { id, spec };
}
