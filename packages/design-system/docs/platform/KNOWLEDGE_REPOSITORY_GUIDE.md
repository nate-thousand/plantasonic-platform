# Knowledge Repository Guide

Centralized knowledge — architecture decisions, migrations, debt, principles — shared across projects.

## Record knowledge

```typescript
import { recordDecision, recordTechnicalDebt, knowledgeRepository } from 'plantasonic-design-system/studio';

recordDecision({
  id: 'adr.instrument-shell',
  title: 'Instrument shell for creative apps',
  body: 'Canvas-first shell variant for audiovisual instruments.',
  projectId: 'plantasonic',
  tags: ['architecture', 'shell'],
});

recordTechnicalDebt({
  id: 'debt.midi-learn-ui',
  title: 'MIDI learn UI incomplete',
  body: 'Learn mode needs visual feedback.',
  projectId: 'plantasonic',
});
```

## Query

```typescript
knowledgeRepository.search('instrument');
knowledgeRepository.byType('principle');
knowledgeRepository.byProject('plantasonic');
exportKnowledge(); // full export for AI context
```

Seeded principles: token-first styling, lightweight platform clients, spec-authoritative projects.

Export: `generated/studio/knowledge.json`
