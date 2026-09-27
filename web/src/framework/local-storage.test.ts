import { beforeEach, describe, expect, it } from "vitest";
import { findIn, removeFrom, setIn } from "./local-storage";

const clock = { now: () => 0 };
describe("Local storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  describe("Find in storage", () => {
    it("should fail if item is not stored", () => {
      const find = findIn(window.localStorage)(clock);

      const actual = find("non-existing-key");

      expect(actual).toEqual({
        ok: false,
        error: "Item non-existing-key not found.",
      });
    });

    it("should find stored item", () => {
      window.localStorage.setItem(
        "existing-key",
        JSON.stringify({ value: "value", expiresAt: -1 }),
      );
      const find = findIn(window.localStorage)(clock);

      const actual = find("existing-key");

      expect(actual).toEqual({ ok: true, value: "value" });
    });

    it("should fail finding expired item", () => {
      const store = setIn(window.localStorage)(clock);
      store("expired-key", "value", 100);
      const find = findIn(window.localStorage)({ now: () => 200 });

      const actual = find("expired-key");

      expect(actual).toEqual({
        ok: false,
        error: "Item expired-key not found",
      });
    });
  });

  describe("Set in storage", () => {
    it("should store item in provided storage", () => {
      const store = setIn(window.localStorage)(Date);

      const result = store("new-key", "new-value");

      expect(result.expiresAt).toBe(-1);
      expect(window.localStorage.getItem("new-key")).toBeDefined();
    });
  });

  describe("Set in storage with ttl", () => {
    it("should store item with provided ttl in milliseconds", () => {
      const store = setIn(window.localStorage)(clock);

      const result = store("new-key", "new-value", 100);

      expect(result.expiresAt).toBe(100);
      expect(window.localStorage.getItem("new-key")).toBeDefined();
    });
  });

  describe("Remove from storage", () => {
    it("should remove item from provided storage", () => {
      window.localStorage.setItem(
        "key-to-remove",
        JSON.stringify({ value: "value", expiresAt: -1 }),
      );
      const remove = removeFrom(window.localStorage);

      const result = remove("key-to-remove");

      expect(result.ok).toBe(true);
      expect(window.localStorage.getItem("key-to-remove")).toBeNull();
    });
  });
});
