/**
 * Generate a complete prototype application from a {@link PrototypePlan}.
 */
import type { CreatePrototypeResult, GeneratedPrototypeFile, PrototypePlan } from './types.ts';

function engineStub(plan: PrototypePlan, engine: { id: string; file: string; description: string; enabled: boolean }): string {
  if (!engine.enabled) return '';
  const exports =
    engine.id === 'visual'
      ? `/** ${engine.description} */\nexport function initVisualEngine(canvas: HTMLCanvasElement): { destroy: () => void } {\n  const ctx = canvas.getContext('2d');\n  let raf = 0;\n  const loop = () => {\n    if (!ctx) return;\n    ctx.fillStyle = 'var(--ds-color-surface-stage)';\n    ctx.fillRect(0, 0, canvas.width, canvas.height);\n    ctx.fillStyle = 'var(--ds-color-primary)';\n    ctx.font = 'var(--ds-font-size-body) var(--ds-font-family-mono)';\n    ctx.fillText('${plan.title} — visual engine placeholder', 24, 48);\n    raf = requestAnimationFrame(loop);\n  };\n  loop();\n  return { destroy: () => cancelAnimationFrame(raf) };\n}\n`
      : engine.id === 'audio'
        ? `/** ${engine.description} */\nexport async function initAudioEngine(): Promise<{ destroy: () => void }> {\n  // TODO: Web Audio context + analyser — connect to visual mapping\n  return { destroy: () => {} };\n}\n`
        : engine.id === 'midi'
          ? `/** ${engine.description} */\nexport async function initMidiEngine(onMessage: (data: Uint8Array) => void): Promise<{ destroy: () => void }> {\n  // TODO: navigator.requestMIDIAccess()\n  void onMessage;\n  return { destroy: () => {} };\n}\n`
          : engine.id === 'input'
            ? `/** ${engine.description} */\nexport function initTouchMode(root: HTMLElement): () => void {\n  root.dataset.touch = 'true';\n  return () => delete root.dataset.touch;\n}\n`
            : `/** ${engine.description} */\nexport async function initAiEngine(): Promise<{ prompt: (text: string) => Promise<string> }> {\n  return { prompt: async (text) => \`[AI placeholder] \${text}\` };\n}\n`;

  return `// ${plan.slug} — ${engine.id} engine placeholder\n${exports}`;
}

function panelModule(panel: { id: string; title: string; description: string }): string {
  return `import { controlGroup } from 'plantasonic-design-system/components';

/** ${panel.description} */
export function render${panel.id.charAt(0).toUpperCase() + panel.id.slice(1)}Panel(): string {
  return controlGroup({
    label: '${panel.title}',
    content: '<p class="text-muted">${panel.description}</p>',
  });
}
`;
}

function mainInstrument(plan: PrototypePlan): string {
  const imports = [
    "import '@ds/css/variables.css';",
    "import './styles/main.scss';",
    "import { createApplication } from 'plantasonic-design-system/app';",
    "import { renderCanvasMount, METRIC_PRESETS, canvas2dAdapter } from 'plantasonic-design-system/instrument';",
    "import { prototypeConfig } from './prototype-config.ts';",
  ];
  const engineImports = plan.engines.filter((e) => e.enabled).map((e) => `import * as ${e.id}Engine from './engines/${e.file.replace('.ts', '')}.ts';`);
  const panelImports = plan.panels.map(
    (p) => `import { render${p.id.charAt(0).toUpperCase() + p.id.slice(1)}Panel } from './panels/${p.id}.ts';`,
  );

  const panelRegs = plan.panels
    .map((p) => {
      const fn = `render${p.id.charAt(0).toUpperCase() + p.id.slice(1)}Panel`;
      return `  .registerInspector({ id: '${p.id}', title: '${p.title}', render: ${fn} })`;
    })
    .join('\n');

  const touchBlock = plan.features.touch
    ? `\nif (prototypeConfig.features.touch) {\n  inputEngine.initTouchMode(root);\n  app.setMode('touch');\n}`
    : '';

  return `${[...imports, ...engineImports, ...panelImports].join('\n')}

const app = createApplication({
  title: prototypeConfig.title,
  variant: 'instrument',
  mode: prototypeConfig.initialMode,
  persistState: true,
});

app
  .registerWorkspace({
    id: 'main',
    label: 'Main',
    render: () => renderCanvasMount({ adapter: canvas2dAdapter }),
  })
${plan.features.sound ? "  .registerTransport({ state: { playing: false, tempo: 120 } }, { play: () => console.log('play') })" : ''}
  .registerStatus([METRIC_PRESETS.fps(() => 60)])
${panelRegs};

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root');

await app.mount(root);

${plan.renderer === 'canvas' ? "const canvas = root.querySelector('canvas');\nif (canvas instanceof HTMLCanvasElement) visualEngine.initVisualEngine(canvas);" : ''}
${plan.features.sound ? 'await audioEngine.initAudioEngine();' : ''}
${plan.features.midi ? 'await midiEngine.initMidiEngine(() => {});' : ''}${touchBlock}
`;
}

function mainStandard(plan: PrototypePlan): string {
  return `import '@ds/css/variables.css';
import './styles/main.scss';
import { renderApplicationShell, bindApplicationShell, initShellTheme } from 'plantasonic-design-system/shell';
import { prototypeConfig } from './prototype-config.ts';

initShellTheme(prototypeConfig.theme);

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root');

root.innerHTML = renderApplicationShell(prototypeConfig.shell, \`
  <main class="ps-workspace p-4" role="main">
    <h1 class="h3">\${prototypeConfig.title}</h1>
    <p class="text-secondary">\${prototypeConfig.description}</p>
    <p class="small text-muted">Prototype type: \${prototypeConfig.type}</p>
  </main>
\`);
bindApplicationShell(prototypeConfig.shell);
`;
}

function stylesScss(plan: PrototypePlan): string {
  const layers = [
    "@import '@ds/scss/bootstrap-theme';",
    "@import 'bootstrap/scss/bootstrap';",
    "@import '@ds/scss/bootstrap-components';",
    "@import '@ds/scss/bootstrap-utilities';",
    "@import '@ds/scss/plantasonic-components';",
    "@import '@ds/scss/primitives';",
    "@import '@ds/scss/components';",
    "@import '@ds/scss/motion';",
  ];
  if (plan.shellVariant === 'instrument') {
    layers.push("@import '@ds/scss/instrument';");
  } else {
    layers.push("@import '@ds/scss/navigation-framework';", "@import '@ds/scss/application-shell';");
  }

  return `${layers.join('\n')}

html, body, #root { height: 100%; margin: 0; }

body {
  background: var(--ds-color-surface-app);
  color: var(--ds-color-text-primary);
  font-family: var(--ds-font-family-sans);
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
`;
}

function prototypeConfigTs(plan: PrototypePlan): string {
  if (plan.shellVariant === 'instrument') {
    return `/** Generated prototype configuration — ${plan.type} */
export const prototypeConfig = {
  type: '${plan.type}' as const,
  title: ${JSON.stringify(plan.title)},
  description: ${JSON.stringify(plan.description)},
  layout: '${plan.layout}',
  theme: 'dark' as const,
  initialMode: ${plan.features.touch ? "'touch'" : plan.layout === 'layout.presentation' ? "'presentation'" : "'edit'"} as const,
  features: ${JSON.stringify(plan.features, null, 2)},
  components: ${JSON.stringify(plan.components)},
  patterns: ${JSON.stringify(plan.patterns)},
};
`;
  }

  return `import type { ApplicationShellConfig } from 'plantasonic-design-system/shell';

/** Generated prototype configuration — ${plan.type} */
export const prototypeConfig = {
  type: '${plan.type}' as const,
  title: ${JSON.stringify(plan.title)},
  description: ${JSON.stringify(plan.description)},
  layout: '${plan.layout}',
  theme: 'dark' as const,
  features: ${JSON.stringify(plan.features, null, 2)},
  components: ${JSON.stringify(plan.components)},
  patterns: ${JSON.stringify(plan.patterns)},
  shell: {
    id: '${plan.slug}',
    title: ${JSON.stringify(plan.title)},
    theme: 'dark',
    persistState: true,
    workspace: 'single',
    navigation: {
      title: ${JSON.stringify(plan.title)},
      groups: [{ id: 'main', label: 'Main', items: [{ id: 'home', label: 'Home', icon: '◉', active: true }] }],
    },
    commands: [{ id: 'palette', label: 'Command Palette', group: 'Navigation', shortcut: '⌘K' }],
  } satisfies ApplicationShellConfig,
};
`;
}

function validateScript(): string {
  return `#!/usr/bin/env node
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateApplication } from 'plantasonic-design-system/ai';
import { validatePrototypeStructure } from 'plantasonic-design-system/prototype';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function collect(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) collect(p, out);
    else if (/\\.(css|scss|ts|tsx)$/.test(e)) out.push({ path: p.replace(ROOT + '/', ''), content: readFileSync(p, 'utf8') });
  }
  return out;
}

const structure = validatePrototypeStructure(ROOT);
const compliance = validateApplication(collect(join(ROOT, 'src')));

console.log('Prototype validation —', structure.ok && compliance.ok ? 'PASS' : 'FAIL');
for (const c of structure.checks) console.log(\`  [\${c.ok ? '✓' : '✗'}] \${c.label}\${c.message ? ': ' + c.message : ''}\`);
console.log(\`  Compliance: \${compliance.errorCount} errors, \${compliance.warningCount} warnings\`);
if (!structure.ok || compliance.errorCount > 0) process.exit(1);
`;
}

/** Generate all files for a resolved plan (does not write to disk). */
export function generatePrototypeFiles(plan: PrototypePlan): CreatePrototypeResult {
  const files: GeneratedPrototypeFile[] = [];

  files.push({
    path: 'package.json',
    content: JSON.stringify(
      {
        name: plan.slug,
        private: true,
        version: '0.1.0',
        type: 'module',
        scripts: {
          dev: 'vite',
          build: 'tsc -b && vite build',
          preview: 'vite preview',
          validate: 'node scripts/validate.mjs',
        },
        dependencies: {
          bootstrap: '5.0.2',
          'plantasonic-design-system': '__DS_DEPENDENCY__',
        },
        devDependencies: {
          sass: '^1.89.2',
          typescript: '^5.8.3',
          vite: '^6.3.5',
        },
      },
      null,
      2,
    ) + '\n',
  });

  files.push({
    path: 'vite.config.ts',
    content: `import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: [
      { find: '@ds', replacement: path.resolve(__dirname, 'node_modules/plantasonic-design-system') },
      {
        find: 'plantasonic-design-system/shell',
        replacement: path.resolve(__dirname, 'node_modules/plantasonic-design-system/src/shell/index.ts'),
      },
      {
        find: 'plantasonic-design-system/app',
        replacement: path.resolve(__dirname, 'node_modules/plantasonic-design-system/src/app/index.ts'),
      },
      {
        find: 'plantasonic-design-system/instrument',
        replacement: path.resolve(__dirname, 'node_modules/plantasonic-design-system/src/instrument/index.ts'),
      },
      {
        find: 'plantasonic-design-system/ai',
        replacement: path.resolve(__dirname, 'node_modules/plantasonic-design-system/src/ai/index.ts'),
      },
      {
        find: 'plantasonic-design-system/prototype',
        replacement: path.resolve(__dirname, 'node_modules/plantasonic-design-system/src/prototype/index.ts'),
      },
      {
        find: 'plantasonic-design-system/components',
        replacement: path.resolve(__dirname, 'node_modules/plantasonic-design-system/src/components/index.ts'),
      },
    ],
  },
});
`,
  });

  files.push({
    path: 'tsconfig.json',
    content: JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2022',
          module: 'ESNext',
          moduleResolution: 'bundler',
          strict: true,
          skipLibCheck: true,
          noEmit: true,
          allowImportingTsExtensions: true,
        },
        include: ['src'],
      },
      null,
      2,
    ) + '\n',
  });

  files.push({
    path: 'index.html',
    content: `<!DOCTYPE html>
<html lang="en" data-theme="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="dark light" />
    <title>${plan.title}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
`,
  });

  files.push({
    path: 'vercel.json',
    content: JSON.stringify({ buildCommand: 'npm run build', outputDirectory: 'dist', framework: 'vite' }, null, 2) + '\n',
  });

  files.push({ path: '.gitignore', content: 'node_modules\ndist\n.DS_Store\n*.local\n' });

  files.push({ path: 'src/styles/main.scss', content: stylesScss(plan) });
  files.push({ path: 'src/prototype-config.ts', content: prototypeConfigTs(plan) });
  files.push({
    path: 'src/main.ts',
    content: plan.shellVariant === 'instrument' ? mainInstrument(plan) : mainStandard(plan),
  });

  for (const engine of plan.engines) {
    if (!engine.enabled) continue;
    files.push({ path: `src/engines/${engine.file}`, content: engineStub(plan, engine) });
  }

  for (const panel of plan.panels) {
    files.push({ path: `src/panels/${panel.id}.ts`, content: panelModule(panel) });
  }

  files.push({ path: 'scripts/validate.mjs', content: validateScript() });

  if (plan.features.documentation) {
    files.push({
      path: 'README.md',
      content: `# ${plan.title}

${plan.description}

**Prototype type:** \`${plan.type}\`  
**Layout:** \`${plan.layout}\`  
**Generated by:** Plantasonic Prototype Platform

## Stack

- [Plantasonic Design System](https://github.com/nate-thousand/plantasonic-design-system) — tokens, theme, ${plan.shellVariant === 'instrument' ? 'instrument shell' : 'application shell'}, components, motion
- Vite + TypeScript

## Commands

\`\`\`bash
npm install
npm run dev        # development
npm run validate   # design system compliance
npm run build      # production build
\`\`\`

## Structure

- \`src/prototype-config.ts\` — layout, features, registry references
- \`src/engines/\` — engine placeholders (implement your domain logic here)
- \`src/panels/\` — inspector panels using Design System components
- \`scripts/validate.mjs\` — token, layout, and compliance checks

## Roadmap

See [ROADMAP.md](./ROADMAP.md).
`,
    });

    files.push({
      path: 'ROADMAP.md',
      content: `# ${plan.title} — Roadmap

${plan.roadmap.map((item, i) => `${i + 1}. ${item}`).join('\n')}
`,
    });

    files.push({
      path: 'CHANGELOG.md',
      content: `# Changelog

## [0.1.0] — ${new Date().toISOString().slice(0, 10)}

### Added

- Initial prototype scaffold (\`${plan.type}\`) from Plantasonic Prototype Platform
- Design System: tokens, theme, layout, components, motion, accessibility defaults
- Validation and Vercel deployment config
`,
    });

    files.push({
      path: 'docs/VALIDATION_CHECKLIST.md',
      content: `# Validation Checklist

${plan.validationChecklist.map((item) => `- [ ] ${item}`).join('\n')}

Run automated checks: \`npm run validate\`
`,
    });

    if (plan.brief) {
      files.push({
        path: 'docs/SPEC.md',
        content: `# Specification

## Brief

${plan.brief}

## Resolved plan

| Field | Value |
| --- | --- |
| Type | \`${plan.type}\` |
| Layout | \`${plan.layout}\` |
| Renderer | \`${plan.renderer}\` |
| Sound | ${plan.features.sound} |
| MIDI | ${plan.features.midi} |
| Touch | ${plan.features.touch} |

## Components

${plan.components.map((c) => `- \`${c}\``).join('\n')}

## Panels

${plan.panels.map((p) => `- **${p.title}** — ${p.description}`).join('\n') || '_None_'}
`,
      });
    }
  }

  return { plan, files };
}
