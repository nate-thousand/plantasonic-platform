# Plugin Guide

Plugins extend the Design System without modifying core source. A plugin contributes metadata (components, layouts, patterns, themes, tokens), commands, documentation, and AI integrations. Contributions are applied to a `Registry`, keeping the core registry pure and composable.

```typescript
import { definePlugin, createPluginHost } from 'plantasonic-design-system/ai';
```

---

## Authoring a plugin

```typescript
import { definePlugin, defineComponent } from 'plantasonic-design-system/ai';

export default definePlugin({
  name: 'midi-tools',
  version: '0.1.0',
  description: 'MIDI learn + mapping UI.',
  contributes: {
    components: [
      defineComponent({
        id: 'component.midiLearn',
        name: 'MIDI Learn',
        kind: 'component',
        export: 'midiLearn',
        version: '0.1.0',
        purpose: 'Bind a control to an incoming MIDI message.',
        category: 'controls',
        status: 'experimental',
        source: 'midi-tools',
        supportedThemes: ['dark', 'light'],
      }),
    ],
    commands: [{ id: 'midi.learn', label: 'MIDI Learn', shortcut: 'L' }],
    documentation: [{ id: 'midi.readme', title: 'MIDI Tools', content: '…' }],
    ai: [{ id: 'midi.prompts', kind: 'prompt', description: 'MIDI mapping prompt pack.' }],
  },
});
```

## Installing plugins

```typescript
import { createPluginHost } from 'plantasonic-design-system/ai';
import midiTools from './plugins/midi-tools';

const host = createPluginHost().use(midiTools);

host.registry.get('component.midiLearn'); // available
host.commands;                            // contributed commands
host.documentation;                       // contributed docs
host.ai;                                   // AI integrations
```

The host starts from a fresh copy of the default registry, so plugin contributions never mutate the global singleton.

## Dependencies

Declare prerequisites with `dependsOn`; installation throws if a dependency is missing:

```typescript
definePlugin({ name: 'b', version: '1.0.0', dependsOn: ['a'], contributes: {} });
```

## Contribution surface

| Field | Contributes |
| --- | --- |
| `components` | `ComponentMetadata[]` |
| `layouts` | `LayoutMetadata[]` |
| `patterns` | `PatternMetadata[]` |
| `themes` | `ThemeMetadata[]` |
| `tokens` | `TokenMetadata[]` |
| `commands` | Command palette entries |
| `documentation` | Markdown docs |
| `ai` | AI integrations (prompts, MCP tools, generators, context) |

## Rules

- **Never modify core source** — contribute through the registry.
- **Namespace ids** to avoid collisions (e.g. `component.midiLearn`).
- **Run validation** against `host.registry` so plugin elements are governed by the same rules.
