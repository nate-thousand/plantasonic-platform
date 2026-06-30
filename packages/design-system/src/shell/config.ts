import type { ApplicationShellConfig } from './types';
import { EXAMPLE_SHELL } from './types';

export function mergeShellConfig(config: Partial<ApplicationShellConfig> = {}): ApplicationShellConfig {
  return {
    ...EXAMPLE_SHELL,
    ...config,
    navigation: { ...EXAMPLE_SHELL.navigation, ...config.navigation },
    regions: { ...EXAMPLE_SHELL.regions, ...config.regions },
    commands: config.commands ?? config.navigation?.commands ?? EXAMPLE_SHELL.commands ?? [],
  };
}
