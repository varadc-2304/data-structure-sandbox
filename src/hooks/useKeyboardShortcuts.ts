import { useEffect, useCallback } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  callback: () => void;
  description?: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[], enabled: boolean = true) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Don't trigger shortcuts when typing in inputs
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    ) {
      return;
    }

    shortcuts.forEach((shortcut) => {
      const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
      const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
      const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
      const altMatch = shortcut.alt ? event.altKey : !event.altKey;

      if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
        event.preventDefault();
        shortcut.callback();
      }
    });
  }, [shortcuts, enabled]);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, enabled]);
}

// Common shortcut definitions
export const commonShortcuts = {
  playPause: (callback: () => void): KeyboardShortcut => ({
    key: ' ',
    callback,
    description: 'Play/Pause',
  }),
  stepForward: (callback: () => void): KeyboardShortcut => ({
    key: 'ArrowRight',
    callback,
    description: 'Step Forward',
  }),
  stepBackward: (callback: () => void): KeyboardShortcut => ({
    key: 'ArrowLeft',
    callback,
    description: 'Step Backward',
  }),
  undo: (callback: () => void): KeyboardShortcut => ({
    key: 'z',
    ctrl: true,
    callback,
    description: 'Undo',
  }),
  redo: (callback: () => void): KeyboardShortcut => ({
    key: 'y',
    ctrl: true,
    callback,
    description: 'Redo',
  }),
  reset: (callback: () => void): KeyboardShortcut => ({
    key: 'r',
    ctrl: true,
    callback,
    description: 'Reset',
  }),
  saveSnapshot: (callback: () => void): KeyboardShortcut => ({
    key: 's',
    ctrl: true,
    callback,
    description: 'Save Snapshot',
  }),
  loadSnapshot: (callback: () => void): KeyboardShortcut => ({
    key: 'l',
    ctrl: true,
    callback,
    description: 'Load Snapshot',
  }),
  help: (callback: () => void): KeyboardShortcut => ({
    key: '?',
    callback,
    description: 'Show Help',
  }),
};
