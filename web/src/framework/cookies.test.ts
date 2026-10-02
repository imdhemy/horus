import { beforeEach, describe, expect, it } from "vitest";
import { findIn, removeFrom, setIn, setSessionIn } from "./cookies";

const find = findIn(document);
const set = setIn(document);
const setSession = setSessionIn(document);
const remove = removeFrom(document);

beforeEach(() => {
  for (const entry of document.cookie.split(";")) {
    document.cookie = `${entry.split("=")[0].trim()}=; Max-Age=0; Path=/; SameSite=Lax`;
  }
});

describe("Cookies", () => {
  describe("find", () => {
    it("decodes special characters", () => {
      set("key =;", "value =;✓", 3600);

      const result = find("key =;");

      expect(result).toBe("value =;✓");
    });

    it("matches the exact key", () => {
      set("marker-extra", "other", 3600);

      const result = find("marker");

      expect(result).toBeUndefined();
    });

    it("returns empty values", () => {
      set("marker", "", 3600);

      const result = find("marker");

      expect(result).toBe("");
    });

    it("throws for invalid encoding", () => {
      document.cookie = "invalid=%; Path=/; SameSite=Lax";

      const act = () => find("invalid");

      expect(act).toThrow(URIError);
    });
  });

  describe("set", () => {
    it("deletes when maxAge is zero", () => {
      setSession("marker", "value");

      set("marker", "value", 0);

      expect(find("marker")).toBeUndefined();
    });

    it.each([NaN, Infinity, 1.5, -1, -3600])("rejects maxAge %s", (maxAge) => {
      const key = "marker";
      const value = "value";

      const act = () => set(key, value, maxAge);

      expect(act).toThrow(
        "maxAge must be a finite non-negative integer in seconds",
      );
    });

    it("writes cookie attributes", () => {
      const target = document.implementation.createHTMLDocument();
      Object.defineProperty(target, "cookie", { value: "", writable: true });
      const set = setIn(target);

      set("marker", "", 3600);

      expect(target.cookie).toContain("; Max-Age=3600; Path=/; SameSite=Lax");
    });
  });

  describe("setSession", () => {
    it("stores the value", () => {
      const key = "session";
      const value = "value";

      setSession(key, value);

      expect(find(key)).toBe(value);
    });

    it("omits Max-Age", () => {
      const target = document.implementation.createHTMLDocument();
      Object.defineProperty(target, "cookie", { value: "", writable: true });
      const setSession = setSessionIn(target);

      setSession("marker", "");

      expect(target.cookie).not.toContain("Max-Age");
      expect(target.cookie).toContain("; Path=/; SameSite=Lax");
    });
  });

  describe("remove", () => {
    it("deletes the cookie", () => {
      setSession("marker", "");

      remove("marker");

      expect(find("marker")).toBeUndefined();
    });

    it("writes deletion attributes", () => {
      const target = document.implementation.createHTMLDocument();
      Object.defineProperty(target, "cookie", { value: "", writable: true });
      const remove = removeFrom(target);

      remove("marker");

      expect(target.cookie).toContain("; Max-Age=0; Path=/; SameSite=Lax");
    });
  });
});
