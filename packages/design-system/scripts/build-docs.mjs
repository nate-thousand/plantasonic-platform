import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'docs/generated');
const INDEX = join(OUT_DIR, 'INDEX.md');

const sections = [
  ['Architecture', '../platform/ARCHITECTURE.md'],
  ['Folder Structure', '../platform/FOLDER_STRUCTURE.md'],
  ['Theme System', '../platform/THEME_SYSTEM.md'],
  ['Bootstrap Integration', '../platform/BOOTSTRAP.md'],
  ['Component Usage', '../platform/COMPONENTS.md'],
  ['Token Usage', '../platform/TOKENS.md'],
  ['Accessibility', '../platform/ACCESSIBILITY.md'],
  ['Versioning', '../platform/VERSIONING.md'],
  ['Migration Guides', '../platform/MIGRATION.md'],
  ['Examples', '../platform/EXAMPLES.md'],
  ['FAQ', '../platform/FAQ.md'],
  ['AI Architecture', '../platform/AI_ARCHITECTURE.md'],
  ['Metadata Specification', '../platform/METADATA_SPECIFICATION.md'],
  ['Registry Guide', '../platform/REGISTRY_GUIDE.md'],
  ['Validation Guide', '../platform/VALIDATION_GUIDE.md'],
  ['Generator Guide', '../platform/GENERATOR_GUIDE.md'],
  ['Plugin Guide', '../platform/PLUGIN_GUIDE.md'],
  ['Application Compliance', '../platform/APPLICATION_COMPLIANCE_GUIDE.md'],
  ['Prototype Platform', '../platform/PROTOTYPE_PLATFORM_GUIDE.md'],
  ['Prototype Templates', '../platform/PROTOTYPE_TEMPLATE_GUIDE.md'],
  ['CLI Guide', '../platform/CLI_GUIDE.md'],
  ['AI Spec Guide', '../platform/AI_SPEC_GUIDE.md'],
  ['Prototype SDK', '../platform/PROTOTYPE_SDK_GUIDE.md'],
  ['Generated App Architecture', '../platform/GENERATED_APP_ARCHITECTURE.md'],
  ['Prototype Migration', '../platform/PROTOTYPE_MIGRATION_GUIDE.md'],
  ['Platform Architecture', '../platform/PLATFORM_ARCHITECTURE_GUIDE.md'],
  ['Ecosystem Plugins', '../platform/ECOSYSTEM_PLUGIN_GUIDE.md'],
  ['Engine Integration', '../platform/ENGINE_INTEGRATION_GUIDE.md'],
  ['Asset Pipeline', '../platform/ASSET_PIPELINE_GUIDE.md'],
  ['Workflow Automation', '../platform/WORKFLOW_AUTOMATION_GUIDE.md'],
  ['Project Registry', '../platform/PROJECT_REGISTRY_GUIDE.md'],
  ['Deployment', '../platform/DEPLOYMENT_GUIDE.md'],
  ['Quality Assurance', '../platform/QUALITY_ASSURANCE_GUIDE.md'],
  ['Creative Studio', '../platform/CREATIVE_STUDIO_GUIDE.md'],
  ['Project Specification', '../platform/PROJECT_SPECIFICATION_GUIDE.md'],
  ['Workspace', '../platform/WORKSPACE_GUIDE.md'],
  ['Automation', '../platform/AUTOMATION_GUIDE.md'],
  ['Knowledge Repository', '../platform/KNOWLEDGE_REPOSITORY_GUIDE.md'],
  ['Portfolio Management', '../platform/PORTFOLIO_MANAGEMENT_GUIDE.md'],
  ['Studio Migration', '../platform/STUDIO_MIGRATION_GUIDE.md'],
  ['Studio Architecture', '../platform/STUDIO_ARCHITECTURE_GUIDE.md'],
  ['API Reference', '../platform/API_REFERENCE.md'],
  ['Application Development', '../platform/APPLICATION_DEVELOPMENT_GUIDE.md'],
  ['Release Guide', '../platform/RELEASE_GUIDE.md'],
  ['Governance', '../platform/GOVERNANCE.md'],
  ['Platform Audit Report', '../platform/PLATFORM_AUDIT_REPORT.md'],
  ['Tokens (generated)', './TOKENS.md'],
  ['Components (generated)', './COMPONENTS.md'],
  ['AI Catalogs (generated)', './ai/README.md'],
];

mkdirSync(OUT_DIR, { recursive: true });

const lines = [
  '# Plantasonic Design System — Documentation Index',
  '',
  'Generated index. Run `npm run docs` to refresh generated pages.',
  '',
  '## Platform guides',
  '',
  ...sections.map(([title, href]) => `- [${title}](${href})`),
  '',
  '## Core references',
  '',
  '- [Vision and Scope](../VISION_AND_SCOPE.md)',
  '- [Design Principles](../DESIGN_PRINCIPLES.md)',
  '- [Brand Guidelines](../BRAND_GUIDELINES.md)',
  '',
  '## AI-first UI',
  '',
  '- [AI Design Guide](../AI_DESIGN_GUIDE.md)',
  '- [V0 Guidelines](../V0_GUIDELINES.md)',
  '- [Prompt Library](../PROMPTS/README.md)',
  '',
];

writeFileSync(INDEX, lines.join('\n'), 'utf8');
console.log(`✓ ${INDEX}`);
