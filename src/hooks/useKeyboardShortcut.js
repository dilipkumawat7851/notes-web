import { useEffect } from 'react';

export function useKeyboardShortcut(shortcut, callback) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const isCmdOrCtrl = shortcut.metaKey || shortcut.ctrlKey;
      
      const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
      const ctrlMatch = isCmdOrCtrl ? (event.ctrlKey || event.metaKey) : true;
      const shiftMatch = shortcut.shiftKey ? event.shiftKey : !event.shiftKey;
      
      if (keyMatch && ctrlMatch && shiftMatch) {
        event.preventDefault();
        callback(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcut, callback]);
}
