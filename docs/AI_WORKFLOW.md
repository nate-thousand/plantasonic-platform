# AI First Development Workflow

Official development workflow for building Plantasonic applications with AI-assisted tools from design through production deployment.

## Overview

Plantasonic is designed as the standard foundation for AI first applications. The workflow connects design, UI generation, implementation, version control, and deployment into a single pipeline where each tool has a clear role and handoff point.

`v0.12.0` marks **Foundation Complete**: the Platform owns reusable orchestration, engines, Design System, Theme System, templates, AI workflow, and documentation. `plantasonic-xyz` is the independent reference application; Signal 9 is the independent first product application.

Permanent rule: the Plantasonic Platform is completely application agnostic. Applications consume the Platform and are developed, versioned, and deployed independently.

```
Figma
    ↓
Figma MCP
    ↓
Plantasonic Design System
    ↓
v0
    ↓
Cursor
    ↓
Plantasonic Platform
    ↓
GitHub
    ↓
Vercel Preview
    ↓
Production
```

See [TOOLCHAIN.md](./TOOLCHAIN.md) for tool-specific responsibilities and best practices.

## Platform principles

These principles govern every step of the workflow:

1. **Plantasonic remains the source of truth** — applications are thin consumers of the platform SDK, generator, and orchestration layer. Generated or imported code must conform to platform architecture, not replace it.

2. **Design tokens remain the source of truth** — visual language flows from `packages/design-system` tokens, variables, and the platform `themes/` catalog. Figma designs and generated UI must align with published tokens, not introduce parallel styling systems.

3. **Generated UI is integrated, not copied blindly** — v0 output is a starting point. Components are adapted to use Design System primitives, platform mount APIs, and existing shell patterns before merge.

4. **AI generated code is reviewed before merging** — Cursor-assisted implementation still requires human review against platform conventions, validation checklists, and architecture boundaries.

5. **Reusable platform components are preferred over generated duplicates** — if the Design System or platform already provides a component, use it. Do not regenerate equivalent UI in application code.

## Recommended development flow

### 1. Design

Start in Figma using Plantasonic design tokens and component patterns. Define layouts, states, and interaction intent for the application shell and creative workspace surfaces.

**Handoff:** annotated Figma frames with token references and component mappings.

### 2. Design handoff (Figma MCP)

Use Figma MCP in Cursor to read design context directly from Figma files. This bridges design and implementation without manual spec transcription.

**Handoff:** structured design context (screenshots, component hints, token mappings) available to the agent in Cursor.

### 3. Platform alignment (Plantasonic Design System)

Map Figma components to Design System exports — shell variants, Creative Workspace presets, tokens (`css/variables.css`), and Bootstrap/theme SCSS layers. Confirm which surfaces are platform-owned vs. application creative layer.

**Handoff:** component mapping document or inline comments identifying DS imports for each UI region.

### 4. UI generation (v0)

Use [v0](https://v0.dev) to generate initial UI scaffolding from design intent. Provide Design System context and token constraints in prompts. Treat output as draft code, not production-ready components.

**Handoff:** generated React/component code ready for integration review.

### 5. Implementation (Cursor)

Implement and integrate in Cursor — the primary development environment for Plantasonic. Use platform skills, `.cursor/rules`, and agent workflows to scaffold apps, wire engines, and align generated UI with platform patterns.

Typical steps:

```bash
pnpm plantasonic create audio-reactive my-app --concept plantasonic
pnpm --filter @plantasonic/my-app dev
```

Customize the creative layer only in an independent application repository. Mount via platform SDK; import Design System via package paths; choose reusable themes from the platform theme catalog where applicable.

**Handoff:** working application branch with validation passing.

### 6. Platform integration

Wire the application through `@plantasonic/platform`:

- Mount via `mountInstrumentApp()` or template-specific bootstrap
- Register preset bundles, plugins, and workspace config in the creative layer
- Route sound, visual, and audio-reactive adapters through platform managers
- Run validation: `pnpm validate` and [VALIDATION_CHECKLIST.md](./VALIDATION_CHECKLIST.md)

**Handoff:** validated thin app consuming platform orchestration.

### 7. Version control (GitHub)

Push to GitHub and open a pull request. PRs are the review gate for AI-generated and hand-written code alike.

PR checklist:

- [ ] `pnpm build` passes
- [ ] `pnpm typecheck` passes
- [ ] No duplicated Design System or engine source
- [ ] Generated UI adapted to platform components
- [ ] Docs updated if workflow or API surface changed

### 8. Deployment (Vercel)

Connect the repository to Vercel. Every pull request receives a **preview deployment** for visual and functional review before merge. Production deploys from the main branch.

**Handoff:** reviewed preview URL attached to PR → merge → production.

## When to use each phase

| Phase | Use when |
|-------|----------|
| Figma | Defining new UI, layouts, or visual language |
| Figma MCP | Translating Figma designs into implementation context |
| Design System | Mapping designs to tokens and shell components |
| v0 | Bootstrapping new UI regions or prototyping layouts quickly |
| Cursor | All implementation, integration, and iteration |
| Platform | Orchestration, engines, presets, persistence |
| GitHub | Review, collaboration, and release history |
| Vercel | Preview and production deployment |

## Related documents

- [TOOLCHAIN.md](./TOOLCHAIN.md) — official toolchain reference
- [PLATFORM_OVERVIEW.md](./PLATFORM_OVERVIEW.md) — ecosystem home
- [APPLICATION_GUIDE.md](./APPLICATION_GUIDE.md) — building thin apps
- [GENERATOR_GUIDE.md](./GENERATOR_GUIDE.md) — scaffolding applications
- [VALIDATION_CHECKLIST.md](./VALIDATION_CHECKLIST.md) — release checks
- [CONTRIBUTING.md](./CONTRIBUTING.md) — pull request guidelines
