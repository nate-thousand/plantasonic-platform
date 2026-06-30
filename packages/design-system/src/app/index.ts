/**
 * Application SDK — `plantasonic-design-system/app`.
 *
 * `createApplication(config)` lets a creative application initialize itself with
 * configuration instead of custom wiring. The app provides business logic,
 * domain models, content, and engine integrations; everything else (shell,
 * regions, transport UI, inspector layout, status display, floating behavior,
 * input plumbing) comes from the Design System.
 *
 *   const app = createApplication({ title: 'My Instrument' });
 *   app.registerWorkspace({ id: 'main', render: () => renderCanvasMount() })
 *      .registerTransport({ state: { tempo: 120 } }, { play: () => engine.start() })
 *      .registerInspector({ id: 'props', title: 'Properties', render: () => '…' })
 *      .registerStatus([METRIC_PRESETS.fps(() => sampler.fps())]);
 *   await app.mount(document.getElementById('root'));
 *
 * The SDK keeps shell rendering behind a dynamic import so this module stays
 * framework-agnostic and unit-testable without a DOM.
 */

import type { ApplicationShellConfig, ShellMode, ShellVariant, InstrumentConfig } from '../shell/types';
import {
  type TransportConfig,
  type TransportHandlers,
  type InspectorPanel,
  type InspectorRegistry,
  type Metric,
  type MetricsRegistry,
  type InputAdapter,
  type InputManager,
  renderTransport,
  bindTransport,
  createInspector,
  createMetrics,
  startMetricsLoop,
  createInputManager,
  bindFloating,
  bindInspector,
  renderCanvasMount,
  setShellMode,
} from '../instrument/index.ts';

export type WorkspaceDefinition = {
  id: string;
  label?: string;
  render: () => string;
};

export type CreateApplicationConfig = Partial<ApplicationShellConfig> & {
  /** Defaults to `'instrument'`. */
  variant?: ShellVariant;
};

export type ApplicationController = {
  registerWorkspace(workspace: WorkspaceDefinition): ApplicationController;
  registerPanels(panels: InspectorPanel[]): ApplicationController;
  registerInspector(panel: InspectorPanel): ApplicationController;
  registerTransport(config: TransportConfig, handlers?: TransportHandlers): ApplicationController;
  registerStatus(metrics: Metric[]): ApplicationController;
  registerCommands(commands: NonNullable<ApplicationShellConfig['commands']>): ApplicationController;
  registerInput(adapter: InputAdapter): ApplicationController;
  setMode(mode: ShellMode): ApplicationController;
  getWorkspaces(): WorkspaceDefinition[];
  buildInstrument(): InstrumentConfig;
  getConfig(): ApplicationShellConfig;
  mount(root: HTMLElement): Promise<ApplicationController>;
  unmount(): void;
  readonly input: InputManager;
  readonly inspector: InspectorRegistry;
  readonly metrics: MetricsRegistry;
};

export function createApplication(config: CreateApplicationConfig = { title: 'Instrument' }): ApplicationController {
  const workspaces = new Map<string, WorkspaceDefinition>();
  let activeWorkspace = '';
  const inspector = createInspector();
  const metrics = createMetrics();
  const input = createInputManager();
  let transportConfig: TransportConfig | null = null;
  let transportHandlers: TransportHandlers = {};
  const adapters: InputAdapter[] = [];
  let commands = config.commands ?? [];
  let mode: ShellMode = config.mode ?? config.instrument?.mode ?? 'edit';

  const cleanups: Array<() => void> = [];
  let mountedRoot: HTMLElement | null = null;

  const controller: ApplicationController = {
    registerWorkspace(workspace) {
      workspaces.set(workspace.id, workspace);
      if (!activeWorkspace) activeWorkspace = workspace.id;
      return controller;
    },
    registerPanels(panels) {
      for (const panel of panels) inspector.registerPanel(panel);
      return controller;
    },
    registerInspector(panel) {
      inspector.registerPanel(panel);
      return controller;
    },
    registerTransport(cfg, handlers = {}) {
      transportConfig = cfg;
      transportHandlers = handlers;
      return controller;
    },
    registerStatus(list) {
      for (const metric of list) metrics.registerMetric(metric);
      return controller;
    },
    registerCommands(list) {
      commands = [...commands, ...list];
      return controller;
    },
    registerInput(adapter) {
      adapters.push(adapter);
      return controller;
    },
    setMode(next) {
      mode = next;
      if (mountedRoot) {
        setShellMode(mountedRoot.querySelector('[data-ps-instrument]'), next, {
          shellId: config.id,
          persist: config.persistState,
        });
      }
      return controller;
    },
    getWorkspaces() {
      return [...workspaces.values()];
    },
    buildInstrument() {
      const ws = activeWorkspace ? workspaces.get(activeWorkspace) : undefined;
      const stage = ws ? ws.render() : renderCanvasMount();
      const transport = transportConfig ? renderTransport(transportConfig) : undefined;
      const status = metrics.getMetrics().length ? metrics.renderStatusBar() : undefined;
      const aside = inspector.getPanels().length ? inspector.render() : undefined;
      return {
        ...config.instrument,
        mode,
        stage: config.instrument?.stage ?? stage,
        ...(transport !== undefined ? { transport } : {}),
        ...(status !== undefined ? { status } : {}),
        ...(aside !== undefined ? { aside } : {}),
      };
    },
    getConfig() {
      return {
        title: 'Instrument',
        navigation: { title: config.title ?? 'Instrument', groups: [] },
        ...config,
        variant: config.variant ?? 'instrument',
        mode,
        commands,
        instrument: controller.buildInstrument(),
      } as ApplicationShellConfig;
    },
    async mount(root) {
      mountedRoot = root;
      const cfg = controller.getConfig();
      const shell = await import('../shell/index');
      root.innerHTML = shell.renderApplicationShell(cfg);
      shell.bindApplicationShell(cfg);

      if (transportConfig || transportConfig === null) {
        cleanups.push(bindTransport(root, transportHandlers, transportConfig?.state));
      }
      cleanups.push(bindFloating(root, { persist: !!config.persistState, storageKey: config.id ?? 'ps-floating' }));
      cleanups.push(bindInspector(root));
      if (metrics.getMetrics().length) cleanups.push(startMetricsLoop(root, metrics));

      input.attach(root);
      for (const adapter of adapters) cleanups.push(input.registerAdapter(adapter));

      return controller;
    },
    unmount() {
      for (const fn of cleanups.splice(0)) fn();
      input.destroy();
      mountedRoot = null;
    },
    get input() {
      return input;
    },
    get inspector() {
      return inspector;
    },
    get metrics() {
      return metrics;
    },
  };

  return controller;
}
