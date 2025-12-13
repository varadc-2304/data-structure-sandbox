import { useState, useCallback } from 'react';

export interface UseUndoRedoOptions {
  maxHistory?: number;
}

export function useUndoRedo<T>(initialState: T, options: UseUndoRedoOptions = {}) {
  const { maxHistory = 50 } = options;
  const [history, setHistory] = useState<T[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentState = history[currentIndex];
  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const setState = useCallback((newState: T) => {
    setHistory((prev) => {
      // Remove any future states if we're not at the end
      const newHistory = prev.slice(0, currentIndex + 1);
      
      // Add new state
      const updatedHistory = [...newHistory, newState];
      
      // Limit history size
      if (updatedHistory.length > maxHistory) {
        return updatedHistory.slice(-maxHistory);
      }
      
      return updatedHistory;
    });
    setCurrentIndex((prev) => {
      const newIndex = prev + 1;
      // Adjust if we hit max history limit
      return Math.min(newIndex, maxHistory - 1);
    });
  }, [currentIndex, maxHistory]);

  const undo = useCallback(() => {
    if (canUndo) {
      setCurrentIndex((prev) => prev - 1);
      return true;
    }
    return false;
  }, [canUndo]);

  const redo = useCallback(() => {
    if (canRedo) {
      setCurrentIndex((prev) => prev + 1);
      return true;
    }
    return false;
  }, [canRedo]);

  const reset = useCallback((newInitialState?: T) => {
    const state = newInitialState !== undefined ? newInitialState : initialState;
    setHistory([state]);
    setCurrentIndex(0);
  }, [initialState]);

  return {
    state: currentState,
    setState,
    undo,
    redo,
    canUndo,
    canRedo,
    reset,
    historyLength: history.length,
    currentHistoryIndex: currentIndex,
  };
}
