import {
  renderColors,
  renderMotion,
  renderOverview,
  renderRadius,
  renderShadows,
  renderSpacing,
  renderTypography,
} from './foundations.js';
import { renderComponents } from './components.js';
import {
  renderBsButtons,
  renderBsCards,
  renderBsDialogs,
  renderBsDisclosure,
  renderBsFeedback,
  renderBsForms,
  renderBsLists,
  renderBsNavigation,
  renderBsSelection,
  renderBsTables,
  renderBsUtilities,
} from './bootstrap.js';

/** @type {Record<string, () => string>} */
export const SECTIONS = {
  overview: renderOverview,
  colors: renderColors,
  typography: renderTypography,
  spacing: renderSpacing,
  radius: renderRadius,
  shadows: renderShadows,
  motion: renderMotion,
  components: renderComponents,
  'bs-buttons': renderBsButtons,
  'bs-forms': renderBsForms,
  'bs-selection': renderBsSelection,
  'bs-navigation': renderBsNavigation,
  'bs-cards': renderBsCards,
  'bs-lists': renderBsLists,
  'bs-tables': renderBsTables,
  'bs-feedback': renderBsFeedback,
  'bs-disclosure': renderBsDisclosure,
  'bs-dialogs': renderBsDialogs,
  'bs-utilities': renderBsUtilities,
};
