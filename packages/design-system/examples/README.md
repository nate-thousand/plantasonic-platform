# Official Reference Examples

Version 1.0 reference implementations — each demonstrates recommended architecture for a prototype category. Every example includes a **`project.json`** specification and validates via `npm run validate:examples`.

| Example | Category | Demonstrates |
| --- | --- | --- |
| [dashboard](./dashboard/) | `data-visualization` | Standard shell, panels, data-focused layout |
| [instrument](./instrument/) | `music-instrument` | Instrument shell, sound + visual engines, MIDI |
| [creative-studio](./creative-studio/) | `creative-tool` | Creative tool shell, asset workflows |
| [generative-art](./generative-art/) | `generative-art` | Canvas-first generative visuals |
| [audio-reactive-installation](./audio-reactive-installation/) | `audio-reactive-installation` | Full AV installation pattern |
| [presentation](./presentation/) | `presentation-prototype` | Presentation mode, audience-facing UI |
| [portfolio](./portfolio/) | `portfolio-demo` | Portfolio / showcase layout |

## Generate from an example

```bash
# Copy project.json into a new directory, then:
node -e "
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { reproduceFromSpecification, parseSpecification } from './src/studio/index.ts';
const spec = parseSpecification(readFileSync('examples/generative-art/project.json','utf8'));
const r = reproduceFromSpecification(spec);
for (const f of r.files) { /* write files */ }
"
```

Or use the CLI with the same brief:

```bash
npx plantasonic create generative-art my-study
npx plantasonic spec "Audio reactive installation with MIDI" --name "Bloom Room"
```

## Validation

```bash
npm run validate:examples
```

Each example must pass `reproduceFromSpecification()` with zero validation errors.
