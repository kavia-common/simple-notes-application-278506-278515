import { useEffect, useRef, useState } from 'react';

const NAMESPACE = 'notes_app_v1';

// PUBLIC_INTERFACE
export function getItem(key) {
  try {
    const raw = window.localStorage.getItem(`${NAMESPACE}:${key}`);
    if (raw == null) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  } catch (err) {
    // Storage could be unavailable (privacy mode/disabled)
    // eslint-disable-next-line no-console
    console.error('Storage get error');
    return null;
  }
}

// PUBLIC_INTERFACE
export function setItem(key, value) {
  try {
    const str = JSON.stringify(value);
    window.localStorage.setItem(`${NAMESPACE}:${key}`, str);
    return true;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Storage set error');
    return false;
  }
}

// PUBLIC_INTERFACE
export function useLocalStorageState(key, initialValue) {
  const initial = useRef(
    typeof initialValue === 'function' ? initialValue() : initialValue
  );
  const [state, setState] = useState(() => {
    const existing = getItem(key);
    return existing ?? initial.current;
  });
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    const ok = setItem(key, state);
    if (!ok) setAvailable(false);
  }, [key, state]);

  return [state, setState, available];
}
