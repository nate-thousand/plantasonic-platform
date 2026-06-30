import { PLANTASONIC_M3_COMPONENTS } from '../data/catalog';
import { docBlock, sectionHeader } from '../lib/ui';

export function renderPlantasonic(): string {
  return `
    ${sectionHeader('Plantasonic Components', 'Milestone 3 — not started.')}
    ${docBlock({
      purpose: 'Reference implementations for instrument-specific UI (knob, dock, stage, presets, etc.).',
      usage: 'Complete Milestone 2 (Bootstrap Reference) before building these components.',
      dos: ['Finish Bootstrap validation first', 'Implement each component here before product apps'],
      donts: ['Import from Plantasonic app repo', 'Start Milestone 3 before Bootstrap reference is validated'],
      implementationNotes: [
        `${PLANTASONIC_M3_COMPONENTS.length} components planned for Milestone 3`,
        PLANTASONIC_M3_COMPONENTS.join(', '),
      ],
    })}
    <div class="alert alert-warning mb-0">
      <strong>Milestone 3 pending.</strong> Bootstrap Reference (Milestone 2) must be complete and validated first.
      Use the Bootstrap category pages in the sidebar.
    </div>`;
}
