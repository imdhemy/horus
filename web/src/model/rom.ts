export type Rom = {
  id: string;
  name: string;
  buffer: ArrayBuffer;
  createdAt: number;
};

export type RomRepository = {
  save(rom: Rom): Promise<void>;
  all(): Promise<Rom[]>;
};
