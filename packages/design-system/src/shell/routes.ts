import type { CommandItemConfig, NavGroupConfig, NavItemConfig, NavigationConfig, ShellCommand, ShellRoute } from './types';

function findNavItem(items: NavItemConfig[], id: string): NavItemConfig | undefined {
  for (const item of items) {
    if (item.id === id) return item;
    if (item.children?.length) {
      const nested = findNavItem(item.children, id);
      if (nested) return nested;
    }
  }
  return undefined;
}

function cloneGroups(groups: NavGroupConfig[]): NavGroupConfig[] {
  return groups.map((g) => ({
    ...g,
    items: g.items.map((item) => {
      const cloned: NavItemConfig = { ...item };
      if (item.children?.length) {
        cloned.children = item.children.map((c) => ({ ...c }));
      }
      return cloned;
    }),
  }));
}

/** Wire route paths into matching nav items and register navigation commands. */
export function mergeRoutesIntoNavigation(
  navigation: NavigationConfig,
  routes: ShellRoute[] = [],
): { navigation: NavigationConfig; routeCommands: ShellCommand[] } {
  if (!routes.length) {
    return { navigation, routeCommands: [] };
  }

  const groups = cloneGroups(navigation.groups);

  for (const route of routes) {
    for (const group of groups) {
      const item = findNavItem(group.items, route.id);
      if (item) {
        item.href = route.path;
        break;
      }
    }
  }

  const routeCommands: ShellCommand[] = routes.map((route) => ({
    id: `route:${route.id}`,
    label: `Go to ${route.label}`,
    group: 'Pages',
    keywords: [route.path, route.label, route.id],
    action: () => {
      if (route.path.startsWith('#')) {
        window.location.hash = route.path.slice(1);
      } else if (route.path.startsWith('/')) {
        window.location.hash = route.path.slice(1);
      } else {
        window.location.hash = route.path;
      }
      document.dispatchEvent(
        new CustomEvent('ps-shell-navigate', { detail: { routeId: route.id, path: route.path } }),
      );
    },
  }));

  const mergedCommands: CommandItemConfig[] = [...(navigation.commands ?? [])];
  for (const cmd of routeCommands) {
    if (!mergedCommands.some((c) => c.id === cmd.id)) mergedCommands.push(cmd);
  }

  return {
    navigation: { ...navigation, groups, commands: mergedCommands },
    routeCommands,
  };
}

export function collectRouteSearchItems(routes: ShellRoute[] = []): string[] {
  return routes.flatMap((r) => [r.label, r.path]);
}
