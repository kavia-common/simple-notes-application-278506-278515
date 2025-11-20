import React from 'react';
import './App.css';
import './index.css';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import EmptyState from './components/EmptyState';
import { useNotes } from './hooks/useNotes';

/**
 * App - Root component rendering the notes layout with sidebar and editor.
 * Manages state via useNotes hook and renders storage warnings and aria-live region.
 */
// PUBLIC_INTERFACE
function App() {
  const {
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
  } = useNotes();

  const selectedNote = notes.find((n) => n.id === selectedNoteId) || null;

  return (
    <div className="app-root">
      <header className="app-header" role="banner" aria-label="Simple Notes">
        <h1 className="app-title">Simple Notes</h1>
      </header>

      {!storageAvailable && !storageWarningDismissed && (
        <div className="storage-warning" role="alert">
          <div>
            Storage seems unavailable. Your notes may not persist across reloads.
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={dismissStorageWarning}
            aria-label="Dismiss storage warning"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="layout">
        <nav className="sidebar" aria-label="Notes list">
          <Sidebar
            notes={filteredNotes}
            selectedNoteId={selectedNoteId}
            onSelect={selectNote}
            onDelete={deleteNote}
            onCreate={createNote}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </nav>

        <main className="editor-area" role="main" aria-label="Editor area">
          {selectedNote ? (
            <Editor
              key={selectedNote.id}
              note={selectedNote}
              onChange={updateNote}
              lastSavedAt={lastSavedAt}
            />
          ) : (
            <EmptyState onCreate={createNote} />
          )}
        </main>
      </div>

      <div className="sr-only" aria-live="polite" aria-atomic="true" id="global-live-region" />
    </div>
  );
}

export default App;
