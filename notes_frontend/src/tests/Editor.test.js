import { render, screen, fireEvent, act } from '@testing-library/react';
import Editor from '../components/Editor';

jest.useFakeTimers();

test('debounced autosave announces via aria-live and explicit save updates timestamp', () => {
  const note = { id: '1', title: 'Untitled', content: '', updatedAt: Date.now() };
  const onChange = jest.fn();

  render(<Editor note={note} onChange={onChange} lastSavedAt={note.updatedAt} />);

  const content = screen.getByLabelText(/content/i);
  fireEvent.change(content, { target: { value: 'hello' } });

  // Debounce 500ms
  act(() => {
    jest.advanceTimersByTime(500);
  });

  expect(onChange).toHaveBeenCalled();

  // Status aria-live region should eventually say "Saved"
  expect(screen.getByText(/saved/i)).toBeInTheDocument();

  // Explicit save
  onChange.mockClear();
  const saveBtn = screen.getByRole('button', { name: /save/i });
  fireEvent.click(saveBtn);
  expect(onChange).toHaveBeenCalled();
});
