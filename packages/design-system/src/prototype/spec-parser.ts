/**
 * Convert a written brief into a resolved {@link PrototypePlan}.
 *
 * Keyword detection augments explicit {@link CreatePrototypeConfig} fields so
 * AI agents and humans can describe intent in prose.
 */
import { getPrototypeTypeSpec } from './catalog.ts';
import type { CreatePrototypeConfig, PrototypeLayoutId, PrototypePlan, PrototypeRenderer, PrototypeType } from './types.ts';

function slugify(name: string): string {
  return name
    .trim()
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .toLowerCase();
}

/** Turn CLI slug "flower-study" into display title "Flower Study". */
function displayTitle(name: string): string {
  if (/[\s]/.test(name.trim()) || /[A-Z]/.test(name)) return name.trim();
  return name
    .split('-')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function detectType(brief: string): PrototypeType | null {
  const b = brief.toLowerCase();
  const rules: Array<[RegExp, PrototypeType]> = [
    [/audio reactive|reactive installation|ambient sound|sound reactive/, 'audio-reactive-installation'],
    [/generative art|generative visual|algorithmic art/, 'generative-art'],
    [/visual synth|video synth|vj/, 'visual-synth'],
    [/music instrument|synthesizer|instrument prototype|playable/, 'music-instrument'],
    [/ai assistant|chatbot|copilot|llm/, 'ai-assistant'],
    [/interactive object|physical object|touch object/, 'interactive-object'],
    [/lighting|dmx|fixture|light controller/, 'lighting-controller'],
    [/portfolio|showcase|case study/, 'portfolio-demo'],
    [/presentation|demo day|keynote|audience facing/, 'presentation-prototype'],
    [/creative tool|authoring|studio tool/, 'creative-tool'],
    [/data viz|data visualization|dashboard|chart/, 'data-visualization'],
    [/research|experiment|hypothesis|lab/, 'research-experiment'],
  ];
  for (const [re, type] of rules) {
    if (re.test(b)) return type;
  }
  return null;
}

function detectFlags(brief: string) {
  const b = brief.toLowerCase();
  return {
    sound: /\b(audio|sound|microphone|ambient|listen)\b/.test(b),
    midi: /\bmidi\b/.test(b),
    touch: /\b(touch|gesture|tablet|kiosk)\b/.test(b),
    fullscreen: /\b(fullscreen|full screen|full-bleed|immersive)\b/.test(b),
    performance: /\b(performance control|transport|play|pause)\b/.test(b),
    assets: /\b(asset|upload|image|flower|media library)\b/.test(b),
  };
}

function layoutFromBrief(brief: string, shellVariant: 'standard' | 'instrument'): PrototypeLayoutId | undefined {
  const b = brief.toLowerCase();
  if (/\bfullscreen\b|\bfull screen\b|\bcanvas only\b/.test(b)) return 'layout.canvas';
  if (/\bpresentation\b|\baudience\b/.test(b)) return 'layout.presentation';
  if (/\bstudio\b|\bauthoring\b/.test(b)) return 'layout.studio';
  if (/\bdashboard\b/.test(b)) return 'layout.dashboard';
  if (/\bportfolio\b|\blanding\b/.test(b)) return 'layout.landing';
  if (/\bresearch\b|\bworkspace\b/.test(b)) return 'layout.workspace';
  if (shellVariant === 'instrument') return 'layout.instrument';
  return undefined;
}

/** Parse brief text into partial config (type + feature flags). */
export function parseBrief(brief: string): Partial<CreatePrototypeConfig> {
  const type = detectType(brief);
  const flags = detectFlags(brief);
  const partial: Partial<CreatePrototypeConfig> = { brief };
  if (type) partial.type = type;
  if (flags.sound) partial.sound = true;
  if (flags.midi) partial.midi = true;
  if (flags.touch) partial.touch = true;
  partial.documentation = true;
  return partial;
}

/** Merge catalog defaults, explicit config, and brief into a full plan. */
export function resolvePrototypePlan(config: CreatePrototypeConfig): PrototypePlan {
  const fromBrief = config.brief ? parseBrief(config.brief) : {};
  const type = config.type ?? fromBrief.type;
  if (!type) throw new Error('Prototype type is required (set type or include detectable keywords in brief).');

  const spec = getPrototypeTypeSpec(type);
  const name = config.name;
  const slug = slugify(name);
  const title = displayTitle(name);
  const shellVariant = spec.shellVariant;

  const layout =
    config.layout ??
    (config.brief ? layoutFromBrief(config.brief, shellVariant) : undefined) ??
    spec.defaultLayout;

  const renderer = config.renderer ?? spec.defaultRenderer;
  const features = {
    sound: config.sound ?? fromBrief.sound ?? spec.defaults.sound,
    midi: config.midi ?? fromBrief.midi ?? spec.defaults.midi,
    touch: config.touch ?? fromBrief.touch ?? spec.defaults.touch,
    documentation: config.documentation ?? fromBrief.documentation ?? spec.defaults.documentation,
  };

  const panels = [...spec.panels];
  if (config.brief && detectFlags(config.brief).assets) {
    panels.push({ id: 'assets', title: 'Assets', description: 'Uploaded media and asset library.' });
  }
  if (features.midi && !panels.some((p) => p.id === 'midi')) {
    panels.push({ id: 'midi', title: 'MIDI', description: 'Device input and learn mapping.' });
  }

  const engines = [
    { id: 'visual' as const, file: 'visual.ts', description: 'Canvas / visual renderer adapter.', enabled: renderer === 'canvas' },
    { id: 'audio' as const, file: 'audio.ts', description: 'Web Audio analysis and playback.', enabled: features.sound },
    { id: 'midi' as const, file: 'midi.ts', description: 'Web MIDI input adapter.', enabled: features.midi },
    { id: 'input' as const, file: 'input.ts', description: 'Unified pointer / touch input.', enabled: features.touch },
    { id: 'ai' as const, file: 'ai.ts', description: 'AI provider adapter.', enabled: type === 'ai-assistant' },
  ];

  const validationChecklist = [
    'Design System dependency resolves (plantasonic-design-system)',
    'Token CSS imported (@ds/css/variables.css)',
    'Theme initialized (dark default)',
    `Layout matches type: ${layout}`,
    'No hardcoded hex colors in src/styles/',
    'npm run validate passes',
    'npm run build passes',
  ];
  if (features.sound) validationChecklist.push('Audio engine placeholder present in src/engines/audio.ts');
  if (features.midi) validationChecklist.push('MIDI adapter placeholder present');
  if (features.touch) validationChecklist.push('Touch / presentation mode considered');

  const roadmap = [...spec.roadmap];
  if (config.brief) roadmap.unshift(`Implement brief: ${config.brief.slice(0, 120)}${config.brief.length > 120 ? '…' : ''}`);

  return {
    type,
    name,
    slug,
    title,
    description: spec.purpose,
    layout,
    shellVariant,
    renderer,
    features,
    components: spec.components,
    panels,
    engines,
    patterns: spec.patterns,
    roadmap,
    validationChecklist,
    brief: config.brief,
  };
}

/** Build a plan entirely from a written brief (infers type when possible). */
export function planFromBrief(brief: string, name: string): PrototypePlan {
  const partial = parseBrief(brief);
  if (!partial.type) {
    throw new Error(
      'Could not infer prototype type from brief. Include keywords (e.g. "audio reactive", "generative art", "music instrument") or pass an explicit type.',
    );
  }
  return resolvePrototypePlan({
    type: partial.type,
    name,
    sound: partial.sound,
    midi: partial.midi,
    touch: partial.touch,
    documentation: true,
    brief,
  });
}
