import {
  renderBootstrap,
  renderBsButtons,
  renderBsCards,
  renderBsDialogs,
  renderBsDisclosure,
  renderBsFeedback,
  renderBsFloating,
  renderBsForms,
  renderBsLists,
  renderBsNavigation,
  renderBsSelection,
  renderBsTables,
  renderBsUtilities,
} from './bootstrap/index';
import {
  renderColors,
  renderMotion,
  renderRadius,
  renderShadows,
  renderSpacing,
  renderTypography,
} from './foundations';
import { renderOverview, renderTokens } from './overview';
import { renderPrimitives } from './primitives';
import { renderComponents } from './components';
import { renderMotionSystem } from './motion-system';
import {
  renderCreativeCanvas,
  renderCreativeFloating,
  renderCreativeIO,
  renderCreativeModes,
  renderCreativeRegions,
  renderCreativeSDK,
  renderCreativeTransport,
  renderInstrumentShellSection,
} from './creative';
import {
  renderCreativeWorkspaceInstrument,
  renderCreativeWorkspaceOverview,
  renderCreativeWorkspacePresets,
} from './creative-workspace';
import { renderDeveloper } from './developer';
import {
  renderAccessibility,
  renderChangelog,
  renderThemes,
} from './reference';
import {
  renderNavAppShell,
  renderNavBreadcrumbs,
  renderNavCommandPalette,
  renderNavDock,
  renderNavInspector,
  renderNavKeyboard,
  renderNavMotion,
  renderNavOverview,
  renderNavPanels,
  renderNavRail,
  renderNavResponsive,
  renderNavSearch,
  renderNavSidebar,
  renderNavTopbar,
  renderNavWorkspace,
} from './navigation';
import {
  renderShellAppFrame,
  renderShellDocks,
  renderShellKeyboard,
  renderShellNotifications,
  renderShellOverlays,
  renderShellOverview,
  renderShellPanels,
  renderShellResponsive,
  renderShellTheme,
  renderShellWindowState,
  renderShellWorkspace,
} from './application-shell';

export type SectionRenderer = () => string;

export const SECTIONS: Record<string, SectionRenderer> = {
  overview: renderOverview,
  tokens: renderTokens,
  colors: renderColors,
  typography: renderTypography,
  spacing: renderSpacing,
  radius: renderRadius,
  shadows: renderShadows,
  motion: renderMotion,
  primitives: renderPrimitives,
  components: renderComponents,
  'motion-system': renderMotionSystem,
  'instrument-shell': renderInstrumentShellSection,
  'creative-workspace': renderCreativeWorkspaceOverview,
  'creative-workspace-instrument': renderCreativeWorkspaceInstrument,
  'creative-workspace-presets': renderCreativeWorkspacePresets,
  'creative-regions': renderCreativeRegions,
  'creative-transport': renderCreativeTransport,
  'creative-canvas': renderCreativeCanvas,
  'creative-floating': renderCreativeFloating,
  'creative-modes': renderCreativeModes,
  'creative-io': renderCreativeIO,
  'creative-sdk': renderCreativeSDK,
  bootstrap: renderBootstrap,
  'bs-buttons': renderBsButtons,
  'bs-forms': renderBsForms,
  'bs-selection': renderBsSelection,
  'bs-navigation': renderBsNavigation,
  'bs-cards': renderBsCards,
  'bs-lists': renderBsLists,
  'bs-tables': renderBsTables,
  'bs-feedback': renderBsFeedback,
  'bs-disclosure': renderBsDisclosure,
  'bs-floating': renderBsFloating,
  'bs-dialogs': renderBsDialogs,
  'bs-utilities': renderBsUtilities,
  'nav-overview': renderNavOverview,
  'nav-app-shell': renderNavAppShell,
  'nav-sidebar': renderNavSidebar,
  'nav-rail': renderNavRail,
  'nav-topbar': renderNavTopbar,
  'nav-dock': renderNavDock,
  'nav-inspector': renderNavInspector,
  'nav-workspace': renderNavWorkspace,
  'nav-panels': renderNavPanels,
  'nav-command-palette': renderNavCommandPalette,
  'nav-search': renderNavSearch,
  'nav-breadcrumbs': renderNavBreadcrumbs,
  'nav-responsive': renderNavResponsive,
  'nav-keyboard': renderNavKeyboard,
  'nav-motion': renderNavMotion,
  'shell-overview': renderShellOverview,
  'shell-app-frame': renderShellAppFrame,
  'shell-workspace': renderShellWorkspace,
  'shell-docks': renderShellDocks,
  'shell-panels': renderShellPanels,
  'shell-overlays': renderShellOverlays,
  'shell-notifications': renderShellNotifications,
  'shell-theme': renderShellTheme,
  'shell-keyboard': renderShellKeyboard,
  'shell-responsive': renderShellResponsive,
  'shell-window-state': renderShellWindowState,
  accessibility: renderAccessibility,
  themes: renderThemes,
  developer: renderDeveloper,
  changelog: renderChangelog,
};

export function renderSection(id: string): string {
  const fn = SECTIONS[id] ?? SECTIONS.overview;
  return fn();
}

export { renderSection as default };
