import { beforeEach, describe, expect, it } from "vitest";
import { findIn, removeFrom, setIn } from "./session-storage";

describe("Session storage", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  describe("Find in storage", () => {
    it("returns undefined for a missing item", () => {
      expect(findIn(window.sessionStorage)("missing-key")).toBeUndefined();
    });

    it("finds a stored item", () => {
      window.sessionStorage.setItem("key", "value");

      expect(findIn(window.sessionStorage)("key")).toBe("value");
    });

    it("preserves an empty string", () => {
      setIn(window.sessionStorage)("key", "");

      expect(findIn(window.sessionStorage)("key")).toBe("");
    });
  });

  describe("Set in storage", () => {
    it("stores an item in the provided storage", () => {
      setIn(window.sessionStorage)("key", "value");

      expect(window.sessionStorage.getItem("key")).toBe("value");
    });
  });

  describe("Remove from storage", () => {
    it("removes an item from the provided storage", () => {
      window.sessionStorage.setItem("key", "value");

      removeFrom(window.sessionStorage)("key");

      expect(window.sessionStorage.getItem("key")).toBeNull();
    });
  });
});
