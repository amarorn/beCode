export interface Command {
  id: string;
  label: string;
  category?: string;
  handler: (...args: any[]) => void | Promise<void>;
  permissionCheck?: () => boolean | Promise<boolean>;
  keybinding?: string; // Example: "CmdOrCtrl+P"
}

export class CommandRegistry {
  private commands = new Map<string, Command>();

  registerCommand(command: Command) {
    if (this.commands.has(command.id)) {
      console.warn(`Command ${command.id} is already registered. Overwriting.`);
    }
    this.commands.set(command.id, command);
  }

  getCommand(id: string): Command | undefined {
    return this.commands.get(id);
  }

  getCommands(): Command[] {
    return Array.from(this.commands.values());
  }

  async executeCommand(id: string, ...args: any[]): Promise<void> {
    const cmd = this.commands.get(id);
    if (!cmd) {
      throw new Error(`Command not found: ${id}`);
    }

    if (cmd.permissionCheck) {
      const isAllowed = await cmd.permissionCheck();
      if (!isAllowed) {
        console.warn(`Permission denied for command: ${id}`);
        return;
      }
    }

    try {
      await cmd.handler(...args);
      // Log for observability (usage frequency)
      console.debug(`[Command Registry] Executed: ${id}`);
    } catch (error) {
      // Log for observability (failures per handler)
      console.error(`[Command Registry] Error executing ${id}:`, error);
      throw error;
    }
  }
}

export const globalCommandRegistry = new CommandRegistry();
