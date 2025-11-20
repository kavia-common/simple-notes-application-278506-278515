import React from 'react';
import { formatRelativeTime } from '../utils/validators';

/**
 * NoteItem: row showing title and relative updated time, with select and delete controls.
 */
export default function NoteItem({ note, selected, onSelect, onDelete }) {
  return (
    <div className="note-item" aria-selected={selected} id={`note-${note.id}`}>
      <button
        type="button"
        className="note-item btn"
        onClick={onSelect}
        data-note-id={note.id}
        aria-pressed={selected}
        aria-label={`Open note ${note.title}`}
      >
        <div>
          <p className="note-item-title">{note.title}</p>
          <div className="note-item-meta">{formatRelativeTime(note.updatedAt)} ago</div>
        </div>
      </button>
      <button
        type="button"
        className="icon-btn"
        aria-label={`Delete note ${note.title}`}
        onClick={onDelete}
      >
        🗑️
      </button>
    </div>
  );
}
