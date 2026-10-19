import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Rom } from '../../model/rom';
import { RomRepository } from '../../framework/rom-repository';
import { readFile } from '../../framework/read-file';
import { hashArrayBuffer } from '../../framework/hash-array-buffer';

type Library = {
    roms: Rom[];
    add(file: File): Promise<void>;
    remove(id: string): Promise<void>;
};

const LibraryContext = createContext<Library | undefined>(undefined);

type Props = {
    children: ReactNode;
};

export function LibraryProvider({ children }: Props) {
    const [roms, setRoms] = useState<Rom[]>([]);

    useEffect(() => {
        let active = true;
        RomRepository.all().then((items) => {
            if (active) setRoms(items);
        });
        return () => { active = false; };
    }, []);

    async function reload() {
        setRoms(await RomRepository.all());
    }

    async function add(file: File) {
        const uploaded = await readFile(file);
        await RomRepository.save({
            id: await hashArrayBuffer(uploaded.buffer),
            name: uploaded.file.name,
            buffer: uploaded.buffer,
            createdAt: Date.now(),
        });
        await reload();
    }

    async function remove(id: string) {
        await RomRepository.remove(id);
        await reload();
    }

    return <LibraryContext value={{ roms, add, remove }}>{children}</LibraryContext>;
}

export function useLibrary(): Library {
    const library = useContext(LibraryContext);
    if (!library) throw new Error('useLibrary must be used within LibraryProvider');
    return library;
}
