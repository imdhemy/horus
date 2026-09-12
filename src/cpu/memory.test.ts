import { describe, expect, it } from "vitest";
import { powerUp } from "./memory";

describe("CPU memory", () => {
  describe("Power up", () => {
    it("should initialize memory to a fixed pattern", () => {
      const result = powerUp();
      expect(result.length).toBe(0x10000);
      expect(result[0x008]).toBe(0xf7);
      expect(result[0x009]).toBe(0xef);
      expect(result[0x00a]).toBe(0xdf);
      expect(result[0x00f]).toBe(0xbf);
    });
  });
});
