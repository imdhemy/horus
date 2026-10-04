type Storage = typeof window.localStorage;
type Clock = { now: () => number };

type StoredValue = { value: string; expiresAt: number };

const assertIsStoredValue: (value: unknown) => asserts value is StoredValue = (
  value,
) => {
  if (
    typeof (value as StoredValue).value !== "string" ||
    typeof (value as StoredValue).expiresAt !== "number"
  ) {
    throw new Error("Invalid stored value");
  }
};

export const findIn =
  (storage: Storage) =>
  (clock: Clock) =>
  (key: string): string | undefined => {
    const result = storage.getItem(key);

    if (null === result) {
      return undefined;
    }

    const parsedResult = JSON.parse(result);
    assertIsStoredValue(parsedResult);

    if (parsedResult.expiresAt !== -1 && parsedResult.expiresAt < clock.now()) {
      storage.removeItem(key);
      return undefined;
    }

    return parsedResult.value;
  };

export const setIn =
  (storage: Storage) =>
  (clock: Clock) =>
  (key: string, value: string, ttl?: number): void => {
    const expiresAt = ttl ? clock.now() + ttl : -1;
    const storedValue = JSON.stringify({ value, expiresAt });
    storage.setItem(key, storedValue);
  };

export const removeFrom =
  (storage: Storage) =>
  (key: string): void => {
    storage.removeItem(key);
  };

export const localStorage = {
  find: findIn(window.localStorage)(Date),
  set: setIn(window.localStorage)(Date),
  remove: removeFrom(window.localStorage),
};
