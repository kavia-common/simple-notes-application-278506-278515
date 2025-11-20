import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';
import { setupLocalStorageMock } from '../__mocks__/localStorageMock';

beforeEach(() => {
  setupLocalStorageMock();
});

test('create, select, edit, persist, delete notes', () => {
  const { unmount, rerender } = render(<App />);

  // Create
  const createButtons = screen.getAllByText(/new note|create note/i);
  fireEvent.click(createButtons[0]);

  // Select automatically created
  const titleInput = screen.getByLabelText(/title/i);
  const contentTextarea = screen.getByLabelText(/content/i);
  expect(titleInput).toBeInTheDocument();
  expect(contentTextarea).toBeInTheDocument();

  // Edit
  fireEvent.change(titleInput, { target: { value: 'My Title' } });
  fireEvent.change(contentTextarea, { target: { value: 'My content' } });

  // Persist by unmount and rerender (localStorage mocked)
  unmount();
  rerender(<App />);

  // Sidebar shows note and select it
  const noteButton = screen.getByRole('button', { name: /open note my title/i });
  fireEvent.click(noteButton);

  // Values persisted
  expect(screen.getByLabelText(/title/i)).toHaveValue('My Title');
  expect(screen.getByLabelText(/content/i)).toHaveValue('My content');

  // Delete via delete button on item
  const deleteBtn = screen.getByRole('button', { name: /delete note my title/i });
  // confirm dialog must be accepted; mock confirm
  const originalConfirm = window.confirm;
  window.confirm = () => true;
  fireEvent.click(deleteBtn);
  window.confirm = originalConfirm;

  // Empty state is visible again
  expect(screen.getByText(/no note selected/i)).toBeInTheDocument();
});
