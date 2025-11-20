import { useCallback, useEffect, useMemo, useState } from 'react';
import { getItem, setItem } from './useLocalStorage';
import { createId } from '../utils/id';
import { sanitizeNoteInput, filterNotes } from '../utils/validators';

const NOTES_KEY = 'notes';
const SELECTED_KEY = 'selected';
const DISMISS_WARN_KEY = 'dismiss_warn';

// PUBLIC_INTERFACE
export function useNotes() {
  /**
   * Notes structure: { id, title, content, updatedAt }
   */
  const [notes, setNotes] = useState(() => getItem(NOTES_KEY) || []);
  const [selectedNoteId, setSelectedNoteId] = useState(() => getItem(SELECTED_KEY) || null);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [storageWarningDismissed, setStorageWarningDismissed] = useState(
    () => Boolean(getItem(DISMISS_WARN_KEY))
  );

  // Persist notes
  useEffect(() => {
    const ok = setItem(NOTES_KEY, notes);
    if (!ok) setStorageAvailable(false);
  }, [notes]);

  // Persist selection
  useEffect(() => {
    const ok = setItem(SELECTED_KEY, selectedNoteId);
    if (!ok) setStorageAvailable(false);
  }, [selectedNoteId]);

  const dismissStorageWarning = useCallback(() => {
    setItem(DISMISS_WARN_KEY, true);
    setStorageWarningDismissed(true);
  }, []);

  // PUBLIC_INTERFACE
  const createNote = useCallback(() => {
    const id = createId();
    const now = Date.now();
    const newNote = { id, title: 'Untitled', content: '', updatedAt: now };
    setNotes((prev) => [newNote, ...prev]);
    setSelectedNoteId(id);
    setLastSavedAt(now);
    announce('Note created');
  }, []);

  // PUBLIC_INTERFACE
  const selectNote = useCallback((id) => {
    setSelectedNoteId(id);
  }, []);

  // PUBLIC_INTERFACE
  const updateNote = useCallback((id, title, content, { explicitSave = false } = {}) => {
    const sanitized = sanitizeNoteInput({ title, content });
    const now = Date.now();
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...sanitized, updatedAt: now } : n))
    );
    if (explicitSave) {
      setLastSavedAt(now);
      announce('Note saved');
    } else {
      setLastSavedAt(now);
      announce('Changes saved');
    }
  }, []);

  // PUBLIC_INTERFACE
  const deleteNote = useCallback((id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    setLastSavedAt(Date.now());
    setSelectedNoteId((current) => {
      if (current !== id) return current;
      // select next logical note: try previous index in current order, else first, else none
      const idx = notes.findIndex((n) => n.id === id);
      const remaining = notes.filter((n) => n.id !== id);
      if (remaining.length === 0) return null;
      if (idx > 0) return remaining[Math.min(idx - 1, remaining.length - 1)].id;
      return remaining[0].id;
    });
    announce('Note deleted');
  }, [notes]);

  const filteredNotes = useMemo(() => {
    return filterNotes(notes, searchQuery);
  }, [notes, searchQuery]);

  return {
    notes,
    filteredNotes,
    selectedNoteId,
    selectNote,
    createNote,
    updateNote,
    deleteNote,
    searchQuery,
    setSearchQuery,
    lastSavedAt,
    storageAvailable,
    storageWarningDismissed,
    dismissStorageWarning,
  };
}

function announce(message) {
  const region = document.getElementById('global-live-region');
  if (region) {
    region.textContent = message;
  }
}
