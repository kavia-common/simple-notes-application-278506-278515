import React, { useEffect, useMemo, useRef, useState } from 'react';
import { sanitizeNoteInput } from '../utils/validators';

/**
 * Editor for the selected note with debounced autosave and explicit save.
 */
export default function Editor({ note, onChange, lastSavedAt }) {
  const [localTitle, setLocalTitle] = useState(note.title);
  const [localContent, setLocalContent] = useState(note.content);
  const [status, setStatus] = useState('');
  const liveRef = useRef(null);

  const counts = useMemo(
    () => ({
      title: localTitle.length,
      content: localContent.length,
    }),
    [localTitle, localContent]
  );

  // Debounced autosave
  useEffect(() => {
    setStatus('Editing…');
    const handle = setTimeout(() => {
      const sanitized = sanitizeNoteInput({ title: localTitle, content: localContent });
      onChange(note.id, sanitized.title, sanitized.content, { explicitSave: false });
      setStatus('Saved');
      if (liveRef.current) {
        liveRef.current.textContent = 'Changes saved';
      }
    }, 500);

    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localTitle, localContent, note.id]);

  // Sync when note changes
  useEffect(() => {
    setLocalTitle(note.title);
    setLocalContent(note.content);
  }, [note.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleExplicitSave = () => {
    const sanitized = sanitizeNoteInput({ title: localTitle, content: localContent });
    onChange(note.id, sanitized.title, sanitized.content, { explicitSave: true });
    setStatus('Saved');
    if (liveRef.current) {
      liveRef.current.textContent = 'Saved';
    }
  };

  return (
    <section className="editor-fields" aria-labelledby="editor-heading">
      <h2 id="editor-heading" className="sr-only">Note editor</h2>

      <label htmlFor="note-title">Title</label>
      <input
        id="note-title"
        className="editor-title"
        value={localTitle}
        onChange={(e) => setLocalTitle(e.target.value)}
        maxLength={200}
      />
      <div className="counts" aria-live="off">
        {counts.title}/200
      </div>

      <label htmlFor="note-content">Content</label>
      <textarea
        id="note-content"
        className="editor-content"
        value={localContent}
        onChange={(e) => setLocalContent(e.target.value)}
        maxLength={20000}
      />
      <div className="counts" aria-live="off">
        {counts.content}/20000
      </div>

      <div className="editor-actions">
        <div className="meta" aria-live="polite">
          Last saved: {lastSavedAt ? new Date(lastSavedAt).toLocaleString() : '—'}
        </div>
        <div className="meta" aria-live="polite" ref={liveRef}>
          {status}
        </div>
        <button type="button" className="btn btn-primary" onClick={handleExplicitSave}>
          Save
        </button>
      </div>
    </section>
  );
}
