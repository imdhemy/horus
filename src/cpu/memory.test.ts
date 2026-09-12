import { describe, expect, it } from "vitest";
import { powerUp } from "./memory.js";

describe("CPU memory", () => {
  describe("Power up", () => {
    it("should initialize memory to a fixed pattern", () => {
      const result = powerUp();

      expect(result.length).toBe(0x10000); // 65,536 bytes
      // Block bases in decimal: 0, 2,048, 4,096, 6,144
      for (const base of [0x0000, 0x0800, 0x1000, 0x1800]) {
        expect(result[base + 0x008]).toBe(0xf7); // Offset 8: 247
        expect(result[base + 0x009]).toBe(0xef); // Offset 9: 239
        expect(result[base + 0x00a]).toBe(0xdf); // Offset 10: 223
        expect(result[base + 0x00f]).toBe(0xbf); // Offset 15: 191
      }
    });
  });
});
