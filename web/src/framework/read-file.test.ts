import { describe, expect, it, vi } from "vitest";
import { createReadFile, readFile } from "./read-file";

describe("Read file", () => {
  it("should return the original file and its bytes in an ArrayBuffer", async () => {
    const bytes = new Uint8Array([0x00, 0x80, 0xff]);
    const file = new File([bytes], "game.nes");

    const actual = await readFile(file);

    expect(actual).toEqual({ buffer: bytes.buffer, file });
    expect(actual.file).toBe(file);
  });

  it("should reject with the file read error", async () => {
    const error = new DOMException("Cannot read file", "NotReadableError");
    const file = new File([], "game.nes");

    const reader = new FileReader();
    Object.defineProperty(reader, "error", { value: error });
    vi.spyOn(reader, "readAsArrayBuffer").mockImplementation(() => {});
    const read = createReadFile(() => reader);

    const actual = read(file);
    reader.dispatchEvent(new ProgressEvent("error"));
    reader.dispatchEvent(new ProgressEvent("loadend"));

    await expect(actual).rejects.toBe(error);
  });
});
