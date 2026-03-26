import { useState, useEffect, useCallback } from 'react';
import { ShortcutItem, SHORTCUTS_EVENTS } from '@/lib/shortcutsUtils';

export const useShortcuts = () => {
  const [recentLinks, setRecentLinks] = useState<ShortcutItem[]>([]);
  const [pinnedLinks, setPinnedLinks] = useState<ShortcutItem[]>([]);

  const loadLinks = useCallback(() => {
    const sessionData = sessionStorage.getItem('recentLinks');
    if (sessionData) setRecentLinks(JSON.parse(sessionData));

    const localData = localStorage.getItem('pinnedLinks');
    if (localData) setPinnedLinks(JSON.parse(localData));
  }, []);

  useEffect(() => {
    loadLinks();
    window.addEventListener(SHORTCUTS_EVENTS.UPDATED, loadLinks);
    return () => window.removeEventListener(SHORTCUTS_EVENTS.UPDATED, loadLinks);
  }, [loadLinks]);

  const savePinned = (newPinned: ShortcutItem[]) => {
    localStorage.setItem('pinnedLinks', JSON.stringify(newPinned));
    setPinnedLinks(newPinned);
    window.dispatchEvent(new Event(SHORTCUTS_EVENTS.UPDATED));
  };

  const saveRecent = (newRecent: ShortcutItem[]) => {
    sessionStorage.setItem('recentLinks', JSON.stringify(newRecent));
    setRecentLinks(newRecent);
    window.dispatchEvent(new Event(SHORTCUTS_EVENTS.UPDATED));
  };

  return { recentLinks, pinnedLinks, savePinned, saveRecent, refresh: loadLinks };
};