export const DB_NAME = "HORUS";
export const DB_VERSION = 1;
export const ROMS_STORE = "roms";

export type OpenDatabase = () => Promise<IDBDatabase>;

export async function withDatabase<T>(
  open: OpenDatabase,
  operation: (database: IDBDatabase) => Promise<T>,
): Promise<T> {
  const database = await open();

  try {
    return await operation(database);
  } finally {
    database.close();
  }
}

export function runTransaction<T>(
  database: IDBDatabase,
  storeName: string,
  mode: IDBTransactionMode,
  abortMessage: string,
  operation: (store: IDBObjectStore) => () => T,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, mode);

    transaction.onabort = () =>
      reject(transaction.error ?? new Error(abortMessage));

    const result = operation(transaction.objectStore(storeName));
    transaction.oncomplete = () => resolve(result());
  });
}

export const createOpenDatabase = (open: IDBFactory["open"]) =>
  function openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        request.result.createObjectStore(ROMS_STORE, { keyPath: "id" });
      };

      request.onsuccess = () => {
        const database = request.result;
        database.onversionchange = () => database.close();
        resolve(database);
      };
      request.onerror = () => reject(request.error);
    });
  };

export const openDatabase = createOpenDatabase((name, version) =>
  window.indexedDB.open(name, version),
);
