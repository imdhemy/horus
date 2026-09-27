type WindowLocalStorage = typeof window.localStorage;

type FindResult = { ok: true; value: string } | { ok: false; error: string };

export const findIn =
  (localStorage: WindowLocalStorage) =>
  (key: string): FindResult => {
    const result = localStorage.getItem(key);

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
