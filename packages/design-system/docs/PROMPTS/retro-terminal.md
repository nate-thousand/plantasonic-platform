# Retro Terminal UI

```text
Build a [React + Vite | HTML/CSS] retro terminal interface for a Plantasonic application (e.g. Signal 9).

Layout:
- Full-screen terminal stage (--ds-color-surface-stage) as primary display
- Minimal top bar: session title, connection status (mono readout)
- Optional bottom input line for commands (prompt > )
- Side panel optional for file tree or log — collapsible, does not dominate

Aesthetic:
- Monospace throughout: var(--ds-font-family-mono)
- Theme via data-theme="retro" — all colors from var(--ds-color-*) overrides, NOT hardcoded amber/green hex
- CRT/scanline effects on stage content only — not on Bootstrap control chrome
- Blinking cursor using CSS animation with prefers-reduced-motion fallback (solid cursor)

Content:
- [Terminal output: log lines, ASCII art region, command responses]
- [Status line: var(--ds-font-size-caption) — e.g. CONNECTED | 9600 BAUD | UTC 12:00]

Design System: Plantasonic Design System
Stack: Bootstrap 5.0.2 + CSS custom properties (--ds-*, --ps-*)
Theme: data-theme="retro" (app-provided semantic overrides on --ds-* variables)

Visual:
- Stage: var(--ds-color-surface-stage)
- Terminal text: var(--ds-color-text-primary) on stage; var(--ds-color-text-accent) for prompts
- Control chrome (if any): standard var(--ds-color-surface-nav) — retro skin applies to stage, not buttons
- Line height: var(--ds-line-height-body) for readability

Rules:
- App theme file maps retro colors to semantic roles — components never reference #33ff33 directly
- Bootstrap .form-control for command input; .btn for actions outside terminal stream
- Semantic HTML: <pre> or <code> for output; live region aria-live="polite" for new lines
- Keyboard: Enter submits command; focus visible on input
- Respect prefers-reduced-motion — disable scanline flicker and blink
- Compatible with design system dark/light themes when data-theme switches
```
