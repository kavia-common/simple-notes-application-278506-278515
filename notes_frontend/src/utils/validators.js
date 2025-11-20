const TITLE_MAX = 200;
const CONTENT_MAX = 20000;

// PUBLIC_INTERFACE
export function sanitizeNoteInput({ title, content }) {
  const t = `${title ?? ''}`.trim().slice(0, TITLE_MAX);
  const c = `${content ?? ''}`.slice(0, CONTENT_MAX);
  return { title: t.length ? t : 'Untitled', content: c };
}

// PUBLIC_INTERFACE
export function filterNotes(notes, query) {
  const q = (query || '').toLowerCase().trim();
  if (!q) return notes;
  return notes.filter((n) => {
    const title = (n.title || '').toLowerCase();
    const content = (n.content || '').toLowerCase();
    return title.includes(q) || content.includes(q);
  });
}

// PUBLIC_INTERFACE
export function formatRelativeTime(timestamp) {
  const diff = Math.max(0, Date.now() - Number(timestamp || 0));
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds || 0}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo`;
  const years = Math.floor(days / 365);
  return `${years}y`;
}
