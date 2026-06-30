import type { ShellCommand } from './types';

export class CommandRegistry {
  private commands = new Map<string, ShellCommand>();

  register(command: ShellCommand): void {
    this.commands.set(command.id, command);
  }

  registerAll(commands: ShellCommand[]): void {
    commands.forEach((c) => this.register(c));
  }

  get(id: string): ShellCommand | undefined {
    return this.commands.get(id);
  }

  list(): ShellCommand[] {
    return [...this.commands.values()];
  }

  search(query: string): ShellCommand[] {
    const q = query.trim().toLowerCase();
    if (!q) return this.list();
    return this.list().filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.group.toLowerCase().includes(q) ||
        c.keywords?.some((k) => k.toLowerCase().includes(q)),
    );
  }

  execute(id: string): boolean {
    const cmd = this.commands.get(id);
    if (!cmd?.action) return false;
    cmd.action();
    return true;
  }
}

export const globalCommandRegistry = new CommandRegistry();
