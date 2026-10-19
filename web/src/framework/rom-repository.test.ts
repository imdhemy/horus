import { describe, expect, it, vi } from "vitest";
import type { Rom } from "../model/rom";
import { ROMS_STORE } from "./index-db";
import { createRomRepository } from "./rom-repository";

function createDatabase(records: Rom[] = []) {
  const request = { result: records };
  const store = { put: vi.fn(), getAll: vi.fn(() => request), delete: vi.fn() };
  const transaction = {
    error: null as DOMException | null,
    oncomplete: null as (() => void) | null,
    onabort: null as (() => void) | null,
    objectStore: vi.fn(() => store),
  };
  const database = {
    transaction: vi.fn(() => transaction),
    close: vi.fn(),
  };
  const repository = createRomRepository(
    async () => database as unknown as IDBDatabase,
  );

  return { repository, database, transaction, store };
}

const rom: Rom = {
  id: "rom-hash",
  name: "game.nes",
  buffer: new Uint8Array([0x00, 0xff]).buffer,
  createdAt: 123,
};

describe("ROM repository", () => {
  it("should save the ROM and resolve only after transaction completion", async () => {
    const { repository, database, transaction, store } = createDatabase();
    const completed = vi.fn();

    const actual = repository.save(rom).then(completed);
    await Promise.resolve();

    expect(database.transaction).toHaveBeenCalledExactlyOnceWith(
      ROMS_STORE,
      "readwrite",
    );
    expect(transaction.objectStore).toHaveBeenCalledExactlyOnceWith(ROMS_STORE);
    expect(store.put).toHaveBeenCalledExactlyOnceWith(rom);
    expect(completed).not.toHaveBeenCalled();
    expect(database.close).not.toHaveBeenCalled();

    transaction.oncomplete?.();
    await actual;

    expect(completed).toHaveBeenCalledOnce();
    expect(database.close).toHaveBeenCalledOnce();
  });

  it("should remove the ROM by ID and resolve only after transaction completion", async () => {
    const { repository, database, transaction, store } = createDatabase();
    const completed = vi.fn();

    const actual = repository.remove(rom.id).then(completed);
    await Promise.resolve();

    expect(database.transaction).toHaveBeenCalledExactlyOnceWith(
      ROMS_STORE,
      "readwrite",
    );
    expect(transaction.objectStore).toHaveBeenCalledExactlyOnceWith(ROMS_STORE);
    expect(store.delete).toHaveBeenCalledExactlyOnceWith(rom.id);
    expect(completed).not.toHaveBeenCalled();
    expect(database.close).not.toHaveBeenCalled();

    transaction.oncomplete?.();
    await actual;

    expect(completed).toHaveBeenCalledOnce();
    expect(database.close).toHaveBeenCalledOnce();
  });

  it.each([
    { name: "stored ROMs", records: [rom] },
    { name: "an empty library", records: [] },
  ])(
    "should return $name after transaction completion",
    async ({ records }) => {
      const { repository, database, transaction, store } =
        createDatabase(records);
      const completed = vi.fn();

      const actual = repository.all().then((result) => {
        completed();
        return result;
      });
      await Promise.resolve();

      expect(database.transaction).toHaveBeenCalledExactlyOnceWith(
        ROMS_STORE,
        "readonly",
      );
      expect(transaction.objectStore).toHaveBeenCalledExactlyOnceWith(
        ROMS_STORE,
      );
      expect(store.getAll).toHaveBeenCalledOnce();
      expect(completed).not.toHaveBeenCalled();
      expect(database.close).not.toHaveBeenCalled();

      transaction.oncomplete?.();

      await expect(actual).resolves.toEqual(records);
      expect(database.close).toHaveBeenCalledOnce();
    },
  );

  it.each(["save", "all", "remove"] as const)(
    "should reject and close on an aborted %s transaction",
    async (method) => {
      const { repository, database, transaction } = createDatabase();
      const error = new DOMException("Transaction failed", "UnknownError");
      transaction.error = error;

      const actual =
        method === "save"
          ? repository.save(rom)
          : method === "remove"
            ? repository.remove(rom.id)
            : repository.all();
      await Promise.resolve();
      transaction.onabort?.();

      await expect(actual).rejects.toBe(error);
      expect(database.close).toHaveBeenCalledOnce();
    },
  );

  it.each(["save", "all", "remove"] as const)(
    "should propagate opening failures from %s",
    async (method) => {
      const error = new Error("Cannot open database");
      const repository = createRomRepository(vi.fn().mockRejectedValue(error));

      const actual =
        method === "save"
          ? repository.save(rom)
          : method === "remove"
            ? repository.remove(rom.id)
            : repository.all();

      await expect(actual).rejects.toBe(error);
    },
  );
});
