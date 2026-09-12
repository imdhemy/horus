/**
 * Initializes RAM to a fixed pattern based on historical NES power-on observations.
 * Real hardware does not guarantee these values
 */
export function powerUp(): Uint8Array<ArrayBuffer> {
  const mem = new Uint8Array(0x10000);
  mem.fill(0xff, 0, 0x2000);

  for (let p = 0; p < 4; p++) {
    let j = p * 0x800;
    mem[j + 0x008] = 0xf7;
    mem[j + 0x009] = 0xef;
    mem[j + 0x00a] = 0xdf;
    mem[j + 0x00f] = 0xbf;
  }

  return mem;
}
