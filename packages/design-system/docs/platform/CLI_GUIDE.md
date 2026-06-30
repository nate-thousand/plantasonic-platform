# CLI Guide

The `plantasonic` CLI ships with the Design System package (`bin/plantasonic`).

## Commands

| Command | Description |
| --- | --- |
| `plantasonic create <name>` | Starter app (default template: `react-vite`) |
| `plantasonic create <name> --template nextjs` | Starter app with template |
| `plantasonic create <type> <name>` | **Prototype** with Design System defaults |
| `plantasonic spec "<brief>" --name "<title>"` | Prototype from written brief |
| `plantasonic list` | Prototype types + starter templates |
| `plantasonic list prototypes` | Prototype types only |
| `plantasonic list templates` | Starter templates only |

## Prototype workflow

```bash
pnpm create plantasonic generative-art flower-study
# equivalent:
npx plantasonic create generative-art flower-study

npx plantasonic create visual-synth signal-grid --dir ../experiments
npx plantasonic create music-instrument "Pad Lab" --no-install
```

## Spec workflow

```bash
npx plantasonic spec \
  "Create an audio reactive flower installation using uploaded flower assets, ambient sound, MIDI support, fullscreen visuals, and performance controls." \
  --name "Bloom Room"
```

Optional explicit type when brief is ambiguous:

```bash
npx plantasonic spec "Custom experiment" --name "Lab" --type research-experiment
```

## Flags

| Flag | Applies to | Description |
| --- | --- | --- |
| `--dir`, `-d` | create | Output directory (default `.`) |
| `--template`, `-t` | create (starters) | Template id |
| `--no-install` | create | Skip `npm install` |
| `--name`, `-n` | spec | Display name (required) |
| `--type`, `-t` | spec | Force prototype type |

## Local Design System path

When developing the Design System alongside a prototype:

```bash
PLANTASONIC_DS_PATH=/path/to/plantasonic-design-system \
  npx plantasonic create generative-art test-app --no-install
```

This sets the generated `package.json` dependency to `file:…` instead of GitHub.

## Validation

Inside a generated prototype:

```bash
npm run validate   # structure + design system compliance
npm run build      # production build
```

Validate all 12 types from the Design System repo:

```bash
npm run validate:prototypes
```
