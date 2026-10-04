type Storage = typeof window.sessionStorage;

export const findIn =
  (storage: Storage) =>
  (key: string): string | undefined => {
    return storage.getItem(key) ?? undefined;
  };

export const setIn =
  (storage: Storage) =>
  (key: string, value: string): void => {
    storage.setItem(key, value);
  };

export const removeFrom =
  (storage: Storage) =>
  (key: string): void => {
    storage.removeItem(key);
  };

export const sessionStorage = {
  find: findIn(window.sessionStorage),
  set: setIn(window.sessionStorage),
  remove: removeFrom(window.sessionStorage),
};
