import {useCallback, useState} from 'react';

function getStorageValue<T>(key: string, defaultValue: T) {
  if (typeof window === 'undefined') {
    return defaultValue;
  }

  try {
    const saved = localStorage.getItem(key);

    if (!saved) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
    }

    return saved !== null ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key “${key}”:`, error);
    return defaultValue;
  }
}

/**
 * @deprecated use useLocalStorage from usehooks-ts instead
 * @param key
 * @param defaultValue
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
): readonly [T, (key: string, value: T) => void, (key: string, value: T) => T] {
  const [value, setStoredValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });

  const setValue = (valueKey: string, newValue: T) => {
    try {
      localStorage.setItem(valueKey, JSON.stringify(newValue));
      setStoredValue(newValue);
    } catch (error) {
      console.error(`Error setting localStorage key “${key}”:`, error);
    }
  };

  const readValue = useCallback(
    (valueKey: string, fallbackValue: T) => {
      setStoredValue(getStorageValue(valueKey, fallbackValue));
      return getStorageValue(valueKey, fallbackValue);
    },
    [setStoredValue, getStorageValue],
  );

  return [value, setValue, readValue];
}
