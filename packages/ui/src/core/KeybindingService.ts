import { CommandRegistry } from './CommandRegistry';

export class KeybindingService {
  private isListening = false;
  private listener: (e: KeyboardEvent) => void;

  constructor(private commandRegistry: CommandRegistry) {
    this.listener = this.handleKeyDown.bind(this);
  }

  start() {
    if (this.isListening || typeof window === 'undefined') return;
    window.addEventListener('keydown', this.listener);
    this.isListening = true;
  }

  stop() {
    if (!this.isListening || typeof window === 'undefined') return;
    window.removeEventListener('keydown', this.listener);
    this.isListening = false;
  }

  private handleKeyDown(e: KeyboardEvent) {
    // Avoid triggering if typing in an input or textarea, unless it involves a modifier key
    const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName);
    if (isInput && !e.metaKey && !e.ctrlKey && !e.altKey) {
      return;
    }

    const keys: string[] = [];
    if (e.metaKey || e.ctrlKey) keys.push('CmdOrCtrl');
    if (e.altKey) keys.push('Alt');
    if (e.shiftKey) keys.push('Shift');

    const keyName = e.key.toUpperCase();
    // Prevent isolated modifier key triggers
    if (['META', 'CONTROL', 'ALT', 'SHIFT'].includes(keyName)) {
      return;
    }

    keys.push(keyName);
    const pressedCombo = keys.join('+');

    const commands = this.commandRegistry.getCommands();
    const matchedCommand = commands.find(c => {
      if (!c.keybinding) return false;
      const normalizedBinding = c.keybinding.toUpperCase().replace(/\s/g, '');
      return normalizedBinding === pressedCombo;
    });

    if (matchedCommand) {
      e.preventDefault();
      this.commandRegistry.executeCommand(matchedCommand.id);
    }
  }
}
