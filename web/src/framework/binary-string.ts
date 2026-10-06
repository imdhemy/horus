export const arrayBufferToBinaryString = (buffer: ArrayBuffer): string =>
  new Uint8Array(buffer).reduce(
    (result, byte) => result + String.fromCharCode(byte),
    "",
  );

type BinaryStringDecodeResult =
  { ok: true; value: ArrayBuffer } | { ok: false; error: string };

export function binaryStringToArrayBuffer(
  value: string,
): BinaryStringDecodeResult {
  const bytes = new Uint8Array(value.length);

  for (let index = 0; index < value.length; index++) {
    const byte = value.charCodeAt(index);
    if (byte > 255) {
      return {
        ok: false,
        error: "Binary string contains a character outside the byte range",
      };
    }
    bytes[index] = byte;
  }

  return { ok: true, value: bytes.buffer };
}
