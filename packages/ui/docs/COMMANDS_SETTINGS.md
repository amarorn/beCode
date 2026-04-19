# Commands & Settings

This document outlines the core operational layer (Commands, Keybindings, Settings) implemented for the **beCode IDE** Shell.

## 1. Command Registry
The `CommandRegistry` is a centralized service to register and execute commands globally.

- **Id**: Unique identifier (`category.action`, e.g., `theme.toggle`).
- **Label**: User-facing name shown in the Command Palette.
- **Category**: (Optional) For grouping in the UI.
- **Keybinding**: (Optional) String binding like `CmdOrCtrl+P`.
- **Permission Check**: Can evaluate if the user has access to run a specific command.

*Usage Example:*
```typescript
import { globalCommandRegistry } from './core';

globalCommandRegistry.registerCommand({
  id: 'file.save',
  label: 'Save File',
  category: 'File',
  keybinding: 'CmdOrCtrl+S',
  handler: async () => { ... }
});

globalCommandRegistry.executeCommand('file.save');
```

## 2. Keybinding Service
This service binds keystrokes globally to registered commands.
- It translates browser keys to predictable combos (`CmdOrCtrl+S`).
- Ignores keypresses while typing inside `INPUT` or `TEXTAREA` elements to prevent triggering commands while typing, unless accompanied by a modifier key.

## 3. Settings Service
Provides a cascading hierarchy for application settings. 

**Precedence (Highest to Lowest):**
1. **Workspace**
2. **Project**
3. **User**
4. **Default**

*Persisted locally via `localStorage` based on scope.*

*Usage Example:*
```typescript
import { globalSettingsService } from './core';

// 1. Register
globalSettingsService.registerSetting({
  id: 'editor.tabSize',
  type: 'number',
  default: 2,
  description: 'The number of spaces a tab is equal to.'
});

// 2. Read (will respect precedence)
const tabSize = globalSettingsService.get<number>('editor.tabSize');

// 3. Write (Defaults to saving at 'user' scope)
globalSettingsService.set('editor.tabSize', 4, 'user');
```

## 4. Command Palette
The `<CommandPalette />` is the main UI component exposing this to the user.
- **Trigger**: Usually `CmdOrCtrl+P`.
- **Search**: Fuzzy search through labels and categories.
- **Execute**: Run commands with <kbd>Enter</kbd>.
- **Close**: Close with <kbd>Escape</kbd>.
