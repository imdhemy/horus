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

      expect(actual).toBeUndefined();
    });

    it("should find stored item", () => {
      window.localStorage.setItem(
        "existing-key",
        JSON.stringify({ value: "value", expiresAt: -1 }),
      );
      const find = findIn(window.localStorage)(clock);

      const actual = find("existing-key");

      expect(actual).toBe("value");
    });

    it("should fail finding expired item", () => {
      const store = setIn(window.localStorage)(clock);
      store("expired-key", "value", 100);
      const find = findIn(window.localStorage)({ now: () => 200 });

      const actual = find("expired-key");

      expect(actual).toBeUndefined();
      expect(window.localStorage.getItem("expired-key")).toBeNull();
    });
  });

  describe("Set in storage", () => {
    it("should store item in provided storage", () => {
      const store = setIn(window.localStorage)(Date);

      store("new-key", "new-value");

      expect(
        findIn(window.localStorage)({ now: () => Number.MAX_SAFE_INTEGER })(
          "new-key",
        ),
      ).toBe("new-value");
    });
  });

  describe("Set in storage with ttl", () => {
    it("should store item with provided ttl in milliseconds", () => {
      const store = setIn(window.localStorage)(clock);

      store("new-key", "new-value", 100);

      expect(findIn(window.localStorage)({ now: () => 99 })("new-key")).toBe(
        "new-value",
      );
      expect(
        findIn(window.localStorage)({ now: () => 101 })("new-key"),
      ).toBeUndefined();
    });
  });

  describe("Remove from storage", () => {
    it("should remove item from provided storage", () => {
      window.localStorage.setItem(
        "key-to-remove",
        JSON.stringify({ value: "value", expiresAt: -1 }),
      );
      const remove = removeFrom(window.localStorage);

      remove("key-to-remove");

      expect(window.localStorage.getItem("key-to-remove")).toBeNull();
    });
  });
});
