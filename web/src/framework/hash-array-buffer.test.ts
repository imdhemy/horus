import { describe, expect, it, vi } from "vitest";
import { createHashArrayBuffer } from "./hash-array-buffer";

describe("Hash array buffer", () => {
  it("should format the digest as zero-padded lowercase hexadecimal", async () => {
    const buffer = new Uint8Array([0x61, 0x62, 0x63]).buffer;
    const digest = vi
      .fn()
      .mockResolvedValue(new Uint8Array([0x00, 0x0a, 0xab, 0xff]).buffer);
    const hash = createHashArrayBuffer(digest);

    const actual = await hash(buffer);

    expect(digest).toHaveBeenCalledExactlyOnceWith("SHA-1", buffer);
    expect(actual).toBe("000aabff");
  });

  it("should propagate digest failures", async () => {
    const buffer = new ArrayBuffer(0);
    const error = new Error("Digest failed");
    const hash = createHashArrayBuffer(async () => {
      throw error;
    });

    const actual = hash(buffer);

    await expect(actual).rejects.toBe(error);
  });
});
