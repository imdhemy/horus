type Digest = (algorithm: string, buffer: ArrayBuffer) => Promise<ArrayBuffer>;

export const createHashArrayBuffer = (digest: Digest) =>
  async function hashArrayBuffer(buffer: ArrayBuffer): Promise<string> {
    const hash = await digest("SHA-1", buffer);

    return Array.from(new Uint8Array(hash))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  };

export const hashArrayBuffer = createHashArrayBuffer((algorithm, buffer) =>
  window.crypto.subtle.digest(algorithm, buffer),
);
