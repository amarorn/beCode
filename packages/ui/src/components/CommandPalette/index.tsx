import React, { useState, useEffect, useRef } from 'react';
import { globalCommandRegistry, type Command } from '../../core/CommandRegistry';
import { Input } from '../Input';

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [commands, setCommands] = useState<Command[]>([]);
  const [filteredCommands, setFilteredCommands] = useState<Command[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Register the command to toggle the palette itself
    globalCommandRegistry.registerCommand({
      id: 'core.showCommandPalette',
      label: 'Show Command Palette',
      category: 'Core',
      keybinding: 'CmdOrCtrl+P',
      handler: () => {
        setIsOpen(true);
      }
    });

    setCommands(globalCommandRegistry.getCommands());
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Reload commands in case new ones were registered
      setCommands(globalCommandRegistry.getCommands());
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const q = query.toLowerCase();
    const filtered = commands.filter(c => 
      c.label.toLowerCase().includes(q) || 
      (c.category && c.category.toLowerCase().includes(q))
    );
    setFilteredCommands(filtered);
    setSelectedIndex(0);
  }, [query, commands]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const cmd = filteredCommands[selectedIndex];
      if (cmd) {
        executeCommand(cmd.id);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const executeCommand = async (id: string) => {
    setIsOpen(false);
    try {
      await globalCommandRegistry.executeCommand(id);
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-center items-start pt-[15vh] px-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-content/20 dark:bg-black/40 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Palette */}
      <div className="relative w-full max-w-2xl bg-surface dark:bg-surface-dark-alt rounded-lg shadow-modal border border-border dark:border-border-dark flex flex-col max-h-[60vh] overflow-hidden">
        <div className="p-2 border-b border-border dark:border-border-dark">
          <Input 
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command..."
            className="border-none bg-transparent shadow-none focus:ring-0 text-lg"
          />
        </div>

        <div className="overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <div className="p-4 text-center text-content-muted dark:text-content-dark-muted">
              No commands found.
            </div>
          ) : (
            <ul className="py-2 m-0 list-none">
              {filteredCommands.map((cmd, idx) => (
                <li 
                  key={cmd.id}
                  className={`px-4 py-2 cursor-pointer flex justify-between items-center ${
                    idx === selectedIndex 
                      ? 'bg-brand-500 text-white dark:bg-brand-600' 
                      : 'hover:bg-surface-muted dark:hover:bg-surface-dark-muted text-content dark:text-content-dark'
                  }`}
                  onClick={() => executeCommand(cmd.id)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <div className="flex gap-2 items-center">
                    {cmd.category && (
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        idx === selectedIndex 
                          ? 'bg-white/20' 
                          : 'bg-surface-alt dark:bg-surface-dark text-content-muted dark:text-content-dark-muted'
                      }`}>
                        {cmd.category}
                      </span>
                    )}
                    <span>{cmd.label}</span>
                  </div>
                  {cmd.keybinding && (
                    <span className={`text-xs opacity-70 ${idx === selectedIndex ? 'text-white' : 'text-content-muted dark:text-content-dark-muted'}`}>
                      {cmd.keybinding.replace('CmdOrCtrl', '⌘/Ctrl')}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
