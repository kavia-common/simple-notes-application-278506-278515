export function setupLocalStorageMock() {
  let store = {};
  const api = {
    getItem: jest.fn((key) => (key in store ? store[key] : null)),
    setItem: jest.fn((key, val) => {
      store[key] = String(val);
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
  Object.defineProperty(window, 'localStorage', { value: api, configurable: true });
  return { api, reset: () => (store = {}) };
}
