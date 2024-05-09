import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { useEventCallback, useEventListener } from 'usehooks-ts';
import {
  ChoiceGroupDefaults,
  ChoiceGroups,
  ValidKeys,
} from '../types/assets/choice-groups';

declare global {
  interface WindowEventMap {
    'local-storage': CustomEvent;
  }
}

type SetValue<T> = Dispatch<SetStateAction<T>>;

/**
 * Tweaked version of useLocalStorage in `usehooks-ts` that ensures the value is
 * always registered in local storage
 *
 * @param {string} choice - choiceGroup key for this hook
 */
function useChoiceGroupHook<Choice extends ChoiceGroups>(
  choice: Choice,
): [ValidKeys<Choice>, SetValue<ValidKeys<Choice>>] {
  const path = `overwolf.choice-groups.${choice}`;
  const initialValue = ChoiceGroupDefaults[choice];
  // Get from local storage then
  // parse stored json or return initialValue
  const readValue = useCallback((): ValidKeys<Choice> => {
    // Prevent build error "window is undefined" but keeps working
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(path);
      if (!item) {
        window.localStorage.setItem(path, initialValue.toString());
        return initialValue;
      }

      return item as ValidKeys<Choice>;
    } catch (error) {
      console.warn(`Error reading localStorage key “${path}”:`, error);
      return initialValue;
    }
  }, [initialValue, path]);

  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<ValidKeys<Choice>>(readValue);

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue: SetValue<ValidKeys<Choice>> = useEventCallback((value) => {
    // Prevent build error "window is undefined" but keeps working
    if (typeof window === 'undefined') {
      console.warn(
        // eslint-disable-next-line max-len
        `Tried setting localStorage key “${path}” even though environment is not a client`,
      );
    }

    try {
      // Allow value to be a function so we have the same API as useState
      const newValue = value instanceof Function ? value(storedValue) : value;

      // Save to local storage
      window.localStorage.setItem(path, newValue.toString());

      // Save state
      setStoredValue(newValue);

      // We dispatch a custom event so every useLocalStorage hook are notified
      window.dispatchEvent(new Event('local-storage'));
    } catch (error) {
      console.warn(`Error setting localStorage key “${path}”:`, error);
    }
  });

  useEffect(() => {
    setStoredValue(readValue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStorageChange = useCallback(
    (event: StorageEvent | CustomEvent) => {
      if (
        (event as StorageEvent)?.key &&
        (event as StorageEvent).key !== path
      ) {
        return;
      }

      setStoredValue(readValue());
    },
    [path, readValue],
  );

  // this only works for other documents, not the current one
  useEventListener('storage', handleStorageChange);

  // this is a custom event, triggered in writeValueToLocalStorage
  // See: useLocalStorage()
  useEventListener('local-storage', handleStorageChange);

  return [storedValue, setValue];
}

export default useChoiceGroupHook;
