import { describe, expect, it } from "vitest";
import {
  arrayBufferToBinaryString,
  binaryStringToArrayBuffer,
} from "./binary-string";

describe("Binary string", () => {
  it("should encode each byte as a character", () => {
    const buffer = new Uint8Array([0x00, 0x80, 0xff]).buffer;

    const actual = arrayBufferToBinaryString(buffer);

    expect(actual).toBe("\x00\x80\xff");
  });

  it("should decode each character into a byte", () => {
    const value = "\x00\x80\xff";

    const actual = binaryStringToArrayBuffer(value);

    expect(actual).toEqual({
      ok: true,
      value: new Uint8Array([0x00, 0x80, 0xff]).buffer,
    });
  });

  it("should reject characters outside the byte range", () => {
    const value = "\u0100";

    const actual = binaryStringToArrayBuffer(value);

    expect(actual).toEqual({
      ok: false,
      error: "Binary string contains a character outside the byte range",
    });
  });
});
