import { writeFileSync } from 'node:fs';
import { buildVariablesCss, CSS_OUTPUT, validateTokens } from './lib/tokens.mjs';

try {
  const validation = validateTokens();
  if (!validation.ok) {
    console.error('Validation failed — CSS not written.');
    process.exit(1);
  }

  const css = buildVariablesCss();
  writeFileSync(CSS_OUTPUT, css, 'utf8');

  const postBuild = validateTokens();
  if (!postBuild.ok) {
    console.error('Post-build validation failed.');
    process.exit(1);
  }

  console.log('✓ Generated css/variables.css');
  console.log(`  CSS variables: ${postBuild.cssVarCount}`);
  console.log(`  Light theme overrides: ${countLightOverrides(css)}`);
  console.log('✓ Post-build validation passed');
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}

function countLightOverrides(css) {
  const match = css.match(/\[data-theme="light"\]\s*\{([^}]*)\}/s);
  if (!match) return 0;
  return (match[1].match(/--/g) ?? []).length;
}
