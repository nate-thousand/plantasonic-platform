# Official Toolchain

Reference for the tools officially supported in the Plantasonic AI first development workflow. Each tool has defined boundaries — what it owns, where it begins, and where it ends.

See [AI_WORKFLOW.md](./AI_WORKFLOW.md) for the end-to-end development flow.

---

## Figma

**Role:** Design source

**Begins:** Visual exploration, layout design, component specification, interaction prototyping.

**Ends:** At design handoff. Figma does not produce production code or platform configuration.

**Best practices:**

- Use Plantasonic design tokens as Figma variables where possible
- Reference Design System component names in frame and layer naming
- Annotate Creative Workspace regions (Stage, Transport, Inspector, etc.)
- Keep application-specific creative content separate from shell chrome
- Export assets to application `assets/` directories, not into platform packages

---

## Figma MCP

**Role:** Design-to-implementation bridge

**Begins:** When design context is needed inside Cursor (screenshots, component structure, token hints).

**Ends:** When structured design context is available to the agent. MCP does not write application code or modify the platform.

**Best practices:**

- Connect Figma MCP in Cursor before starting implementation tasks
- Use `get_design_context` for specific frames, not entire files
- Cross-reference MCP output against Design System component exports
- Treat MCP hints as input to review, not authoritative implementation specs
- Prefer Code Connect mappings when available

---

## Plantasonic Design System

**Location:** `packages/design-system/`

**Role:** UI source of truth — tokens, shell, Creative Workspace layouts

**Begins:** Where visual language, component APIs, and layout presets are defined.

**Ends:** At the package import boundary. Applications consume `plantasonic-design-system`; they do not copy or fork DS source.

**Best practices:**

- Import tokens via `css/variables.css` and theme SCSS layers
- Use `renderApplicationShell()` and `renderCreativeWorkspace()` — do not rebuild shell layout
- Map Figma components to existing DS exports before generating new UI
- Make reusable DS changes in `packages/design-system/`; do not patch locally in application repos
- Design tokens override ad-hoc styling in generated or hand-written code

---

## v0

**Role:** UI generation

**Website:** [v0.dev](https://v0.dev)

**Begins:** When initial UI scaffolding is needed from design intent or prompts.

**Ends:** At generated code output. v0 does not integrate with platform SDK, engines, or deployment.

**Best practices:**

- Include Design System and token constraints in prompts
- Generate isolated components first; integrate into platform mount structure in Cursor
- Never merge v0 output without adapting imports to `@plantasonic/*` packages
- Prefer regenerating a component over manually diverging from DS patterns
- Use v0 for layout and composition drafts, not for engine wiring or state management

---

## Cursor

**Role:** Primary implementation environment

**Begins:** All development work — scaffolding, integration, review, iteration.

**Ends:** At git commit. Cursor is the IDE and agent host, not the deployment or design system.

**Best practices:**

- Enable `.cursor/rules/plantasonic-platform.md` (always-on platform rules)
- Use `skills/` workflows for prototype creation, migration, and release tasks
- Run `pnpm build` and `pnpm typecheck` before committing
- Review all AI-generated diffs against platform architecture boundaries
- Use Figma MCP and platform docs as context, not as substitutes for validation
- Keep changes in the creative layer unless explicitly extending platform SDK

---

## GitHub

**Role:** Version control and collaboration

**Begins:** When code is ready for review, history, and release tracking.

**Ends:** At merge to main. GitHub does not deploy or run applications.

**Best practices:**

- Use pull requests for all changes, including AI-generated code
- Attach Vercel preview URLs to PR descriptions
- Follow [CONTRIBUTING.md](./CONTRIBUTING.md) checklist
- Keep platform, application, and design system repos separate
- Tag platform releases in CHANGELOG; reference platform version in application PRs when relevant

---

## Vercel

**Role:** Deployment and preview hosting

**Begins:** When an application repository is connected for hosting.

**Ends:** At the deployed URL. Vercel does not manage application logic, engines, or design tokens.

**Best practices:**

- Enable preview deployments for every pull request
- Use preview URLs for design and stakeholder review before merge
- Configure environment variables per environment (preview vs. production)
- Deploy production from the main branch only
- Keep platform repo documentation-only on Vercel unless hosting a demo app

---

## Plantasonic Platform

**Repository:** `plantasonic-platform` (this repo)

**Role:** AI First Application Platform — SDK, generator, Design System, Theme System, engines, skills, docs, validation

**Begins:** Where application orchestration, engine adapters, preset bundles, and workspace persistence are defined.

**Ends:** At the SDK and generator API boundary. Applications consume; they do not duplicate orchestration logic.

**Best practices:**

- Scaffold apps with `pnpm plantasonic create <type> <name>`
- Mount via platform SDK; customize creative layer only
- Route all engine interaction through platform adapters
- Extend via plugins and preset bundles, not by bypassing managers
- Run validation checklist before release
- Do not modify engines from platform PRs unless explicitly scoped

**Key packages:**

| Package | Purpose |
|---------|---------|
| `@plantasonic/platform` | Orchestration SDK |
| `@plantasonic/platform-types` | Shared contracts |
| `@plantasonic/create-app` | Prototype generator |
| `plantasonic-design-system` | Design System workspace package |
| `themes/` | Reusable theme catalog |

---

## Plantasonic Design Tokens

**Location:** `packages/design-system/` (CSS variables, SCSS theme layers) and `themes/` (reusable theme catalog)

**Role:** Visual source of truth across design and code

**Begins:** In Figma variables and Design System token files.

**Ends:** At the CSS custom property boundary in application stylesheets.

**Best practices:**

- Reference tokens by name, not hard-coded hex/spacing values
- Sync Figma variables with DS token updates
- Reject generated UI that introduces parallel color/spacing systems
- Use token names in v0 prompts for consistent output

---

## Tool boundary summary

| Tool | Owns | Does not own |
|------|------|--------------|
| Figma | Design intent, layouts, annotations | Code, platform config |
| Figma MCP | Design context transfer | Implementation |
| Design System | Tokens, shell, components | Application creative content |
| v0 | UI draft generation | Platform integration |
| Cursor | Implementation, review, iteration | Deployment, design tokens |
| GitHub | History, PRs, collaboration | Runtime hosting |
| Vercel | Preview and production hosting | Application logic |
| Platform | Orchestration, engines, presets | UI components, design tokens |

## Related documents

- [AI_WORKFLOW.md](./AI_WORKFLOW.md) — end-to-end workflow
- [PLATFORM_OVERVIEW.md](./PLATFORM_OVERVIEW.md) — ecosystem map
- [ARCHITECTURE.md](./ARCHITECTURE.md) — layer model
- [PACKAGE_RESPONSIBILITIES.md](./PACKAGE_RESPONSIBILITIES.md) — ownership boundaries
