import { describe, expect, it } from "vitest";
import { findIn } from "./local-storage";

describe("Local storage", () => {
  describe("Find In", () => {
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
});
