import { describe, expect, it, vi } from "vitest";
import {
  createOpenDatabase,
  DB_NAME,
  DB_VERSION,
  ROMS_STORE,
} from "./index-db";

function createOpening() {
  const database = {
    createObjectStore: vi.fn(),
    close: vi.fn(),
    onversionchange: null as (() => void) | null,
  };
  const request = {
    result: database,
    error: null as DOMException | null,
    onupgradeneeded: null as (() => void) | null,
    onsuccess: null as (() => void) | null,
    onerror: null as (() => void) | null,
  };
  const open = vi.fn(() => request as unknown as IDBOpenDBRequest);
  const openDatabase = createOpenDatabase(open);

  return { database, request, open, openDatabase };
}

describe("Open database", () => {
  it("should open the configured database and resolve with its connection", async () => {
    const { database, request, open, openDatabase } = createOpening();

    const actual = openDatabase();
    request.onsuccess?.();

    expect(open).toHaveBeenCalledExactlyOnceWith(DB_NAME, DB_VERSION);
    await expect(actual).resolves.toBe(database);
  });

  it("should create the ROM store during an upgrade", async () => {
    const { database, request, openDatabase } = createOpening();

    const actual = openDatabase();
    request.onupgradeneeded?.();
    request.onsuccess?.();
    await actual;

    expect(database.createObjectStore).toHaveBeenCalledExactlyOnceWith(
      ROMS_STORE,
      { keyPath: "id" },
    );
  });

  it("should close the connection on a version change", async () => {
    const { database, request, openDatabase } = createOpening();

    const actual = openDatabase();
    request.onsuccess?.();
    await actual;
    database.onversionchange?.();

    expect(database.close).toHaveBeenCalledOnce();
  });

  it("should reject with the opening error", async () => {
    const { request, openDatabase } = createOpening();
    const error = new DOMException("Cannot open database", "UnknownError");
    request.error = error;

    const actual = openDatabase();
    request.onerror?.();

    await expect(actual).rejects.toBe(error);
  });
});
