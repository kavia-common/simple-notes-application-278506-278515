import React from 'react';

/**
 * EmptyState - shown when no note is selected.
 */
export default function EmptyState({ onCreate }) {
  return (
    <div className="empty" role="region" aria-label="No note selected">
      <div className="empty-card">
        <h2 className="empty-title">No note selected</h2>
        <p className="empty-desc">Create a new note to get started.</p>
        <button type="button" className="btn btn-primary" onClick={onCreate}>
          Create Note
        </button>
      </div>
    </div>
  );
}
