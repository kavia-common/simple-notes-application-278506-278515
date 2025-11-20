function randomSegment() {
  return Math.floor(Math.random() * 1e8).toString(16);
}

// PUBLIC_INTERFACE
export function createId() {
  const ts = Date.now().toString(36);
  return `${ts}-${randomSegment()}-${randomSegment()}`;
}
