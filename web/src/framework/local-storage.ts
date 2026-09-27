type Storage = typeof window.localStorage;

type FindResult = { ok: true; value: string } | { ok: false; error: string };

export const findIn =
  (storage: Storage) =>
  (key: string): FindResult => {
    const result = storage.getItem(key);

    if (null === result) {
      return {
        ok: false,
        error: `Item ${key} not found.`,
      };
    }

    return {
      ok: true,
      value: result,
    };
  };

type StoreResult = { expiresAt: number };

export const setIn =
  (storage: Storage) =>
  (key: string, value: string): StoreResult => {
    storage.setItem(key, value);

    return {
      expiresAt: -1,
    };
  };
