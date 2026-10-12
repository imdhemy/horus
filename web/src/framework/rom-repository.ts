import type { Rom, RomRepository as Repository } from "../model/rom";

import type { OpenDatabase } from "./index-db";
import {
  openDatabase,
  ROMS_STORE,
  runTransaction,
  withDatabase,
} from "./index-db";

const createAll =
  (open: OpenDatabase): Repository["all"] =>
  () =>
    withDatabase(open, (database) =>
      runTransaction(
        database,
        ROMS_STORE,
        "readonly",
        "ROM read aborted",
        (store) => {
          const request = store.getAll();
          return () => request.result as Rom[];
        },
      ),
    );

const createSave =
  (open: OpenDatabase): Repository["save"] =>
  (rom) =>
    withDatabase(open, (database) =>
      runTransaction(
        database,
        ROMS_STORE,
        "readwrite",
        "ROM save aborted",
        (store) => {
          store.put(rom);
          return () => undefined;
        },
      ),
    );

export const createRomRepository = (open: OpenDatabase): Repository => ({
  all: createAll(open),
  save: createSave(open),
});

export const RomRepository = createRomRepository(openDatabase);
