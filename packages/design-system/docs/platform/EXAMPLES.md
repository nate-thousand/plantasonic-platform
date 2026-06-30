# Examples

## Create a new app

```bash
npx plantasonic create my-synth --template react-vite
cd my-synth
npm run dev
```

## List templates

```bash
npx plantasonic list
```

## Local design system development

```bash
git clone https://github.com/nate-thousand/plantasonic-design-system.git
cd plantasonic-design-system
npm run build
cd showcase && npm install && cd ..
npm run showcase:dev
```

## Point a starter at a local checkout

In generated app `package.json`:

```json
"plantasonic-design-system": "file:../plantasonic-design-system"
```

## Full generate pipeline

```bash
npm run generate
npm run docs
npm run quality
npm run test
```
