import { validateTokens, formatValidationErrors } from './lib/tokens.mjs';

const result = validateTokens();

if (result.ok) {
  console.log('✓ Token validation passed');
  console.log(`  CSS variables: ${result.cssVarCount}`);
  console.log(`  Dark theme tokens: ${result.tokenCount.dark}`);
  console.log(`  Light theme tokens: ${result.tokenCount.light}`);
  process.exit(0);
}

console.error(formatValidationErrors(result));
process.exit(1);
