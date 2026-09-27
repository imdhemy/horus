import { beforeEach, describe, expect, it } from "vitest";
import { findIn, setIn } from "./local-storage";

describe("Local storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  describe("Find in storage", () => {
    it("should fail if item is not stored", () => {
      const find = findIn(window.localStorage);

      const actual = find("non-existing-key");

      expect(actual).toEqual({
        ok: false,
        error: "Item non-existing-key not found.",
      });
    });

    it("should find stored item", () => {
      window.localStorage.setItem("existing-key", "value");
      const find = findIn(window.localStorage);

      const actual = find("existing-key");

      expect(actual).toEqual({ ok: true, value: "value" });
    });
  });

  describe("Set in storage", () => {
    it("should store item in provided storage", () => {
      const store = setIn(window.localStorage);

      const result = store("new-key", "new-value");

      expect(result.expiresAt).toBe(-1);
      expect(window.localStorage.getItem("new-key")).toBeDefined();
    });
  });
});
