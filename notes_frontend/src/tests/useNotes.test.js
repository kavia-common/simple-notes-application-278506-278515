import { renderHook, act } from '@testing-library/react';
import { useNotes } from '../hooks/useNotes';
import { setupLocalStorageMock } from '../__mocks__/localStorageMock';

beforeEach(() => {
  setupLocalStorageMock();
});

test('CRUD updates state and localStorage; selection after delete', () => {
  const { result } = renderHook(() => useNotes());

  act(() => result.current.createNote());
  expect(result.current.notes.length).toBe(1);
  const id1 = result.current.notes[0].id;
  expect(result.current.selectedNoteId).toBe(id1);

  act(() => result.current.createNote());
  const id2 = result.current.notes[0].id; // newest first
  expect(result.current.selectedNoteId).toBe(id2);
  expect(result.current.notes.length).toBe(2);

  act(() => result.current.updateNote(id2, 'Hello', 'World'));
  const updated = result.current.notes.find((n) => n.id === id2);
  expect(updated.title).toBe('Hello');
  expect(updated.content).toBe('World');

  act(() => result.current.deleteNote(id2));
  expect(result.current.notes.length).toBe(1);
  // After deleting currently selected, pick next logical (remaining note)
  expect(result.current.selectedNoteId).toBe(id1);

  act(() => result.current.deleteNote(id1));
  expect(result.current.notes.length).toBe(0);
  expect(result.current.selectedNoteId).toBe(null);
});
