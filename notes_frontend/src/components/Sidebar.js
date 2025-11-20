import React, { useCallback, useEffect, useRef } from 'react';
import NoteItem from './NoteItem';

/**
 * Sidebar lists notes, provides search and new note button.
 * Keyboard: Enter selects; Delete triggers deletion with confirmation.
 */
export default function Sidebar({
  notes,
  selectedNoteId,
  onSelect,
  onDelete,
  onCreate,
  searchQuery,
  onSearchChange,
}) {
  const listRef = useRef(null);

  const handleKeyDown = useCallback(
    (e) => {
      if (!listRef.current) return;
      const active = document.activeElement;
      if (e.key === 'Enter' && active?.dataset?.noteId) {
        onSelect(active.dataset.noteId);
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && active?.dataset?.noteId) {
        const id = active.dataset.noteId;
        const note = notes.find((n) => n.id === id);
        if (note && window.confirm(`Delete note "${note.title}"?`)) {
          onDelete(id);
        }
      }
    },
    [notes, onDelete, onSelect]
  );

  useEffect(() => {
    const node = listRef.current;
    if (!node) return;
    node.addEventListener('keydown', handleKeyDown);
    return () => node.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div>
      <div className="sidebar-header">
        <label htmlFor="search" className="sr-only">Search notes</label>
        <input
          id="search"
          className="input"
          placeholder="Search notes…"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search notes"
        />
        <button type="button" className="btn btn-primary" onClick={onCreate}>
          New Note
        </button>
      </div>
      <ul
        className="note-list"
        role="listbox"
        aria-activedescendant={selectedNoteId ? `note-${selectedNoteId}` : undefined}
        ref={listRef}
      >
        {notes.map((n) => (
          <li key={n.id} role="option" aria-selected={selectedNoteId === n.id}>
            <NoteItem
              note={n}
              selected={selectedNoteId === n.id}
              onSelect={() => onSelect(n.id)}
              onDelete={() => onDelete(n.id)}
            />
          </li>
        ))}
        {notes.length === 0 && (
          <li className="meta" aria-live="polite">
            No notes match your search.
          </li>
        )}
      </ul>
    </div>
  );
}
