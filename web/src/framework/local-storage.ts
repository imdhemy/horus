type Storage = typeof window.localStorage;
type Clock = { now: () => number };

type FindResult = { ok: true; value: string } | { ok: false; error: string };
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
  (key: string): FindResult => {
    const result = storage.getItem(key);

    if (null === result) {
      return {
        ok: false,
        error: `Item ${key} not found.`,
      };
    }

    const parsedResult = JSON.parse(result);
    assertIsStoredValue(parsedResult);

    if (parsedResult.expiresAt !== -1 && parsedResult.expiresAt < clock.now()) {
      storage.removeItem(key);
      return {
        ok: false,
        error: `Item ${key} not found`,
      };
    }

    return {
      ok: true,
      value: parsedResult.value,
    };
  };

type StoreResult = { expiresAt: number };

export const setIn =
  (storage: Storage) =>
  (clock: Clock) =>
  (key: string, value: string, ttl?: number): StoreResult => {
    const expiresAt = ttl ? clock.now() + ttl : -1;
    const storedValue = JSON.stringify({ value, expiresAt });
    storage.setItem(key, storedValue);

    return { expiresAt };
  };

type RemoveResult = { ok: true };

export const removeFrom =
  (storage: Storage) =>
  (key: string): RemoveResult => {
    storage.removeItem(key);
    return { ok: true };
  };

export const find = findIn(window.localStorage)(Date);
export const set = setIn(window.localStorage)(Date);
export const remove = removeFrom(window.localStorage);
