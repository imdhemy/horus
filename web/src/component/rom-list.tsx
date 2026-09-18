import { Link } from 'react-router-dom';
import React from 'react';

export type Rom = {
    id: string;
    name: string;
    path: string;
    removable: boolean;
};

type Props = {
    roms: Rom[];
    onDelete?: (rom: Rom) => void;
    emptyStateMessage?: string;
};

function EmptyState({ message }: { message?: string }) {
    return <div>{message ?? 'No ROMs available.'}</div>;
}

function RomItem({ rom, onDelete }: { rom: Rom; onDelete?: Props['onDelete'] }) {
    const controlClassName = 'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 bg-stone-900 shadow-[0_4px_0_0_currentColor] cursor-pointer no-underline transition-transform hover:bg-stone-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current active:translate-y-1 active:shadow-none';

    return (
        <div className='flex items-center gap-4 px-5 py-3 border border-amber-300'>
            <Link className='flex-1 py-3 no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300' to={`/run/${rom.path}`}>
                {rom.name}
            </Link>
            <div className='flex items-center gap-3 pb-1'>
                {rom.removable && onDelete && (
                    <button type='button' onClick={() => onDelete(rom)} className={`${controlClassName} border-red-500 text-red-500`} aria-label={`Remove ${rom.name}`} title='Remove from library'>
                        <svg width='20' height='20' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true' focusable='false'>
                            <path d='M12 4 3 15h18L12 4ZM3 18h18v3H3z' />
                        </svg>
                    </button>
                )}
                <Link to={`/run/${rom.path}`} className={`${controlClassName} border-amber-300 text-amber-300`} aria-label={`Play ${rom.name}`} title='Play'>
                    <svg width='20' height='20' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true' focusable='false'>
                        <path d='m8 4 12 8-12 8V4Z' />
                    </svg>
                </Link>
            </div>
        </div>
    );
}

export const RomList = ({ roms, onDelete, emptyStateMessage }: Props) => {
    return (
        <div className='mb-4'>
            {(roms.length === 0) && <EmptyState message={emptyStateMessage}/>}
            {roms.map((rom) => (<RomItem key={rom.id} rom={rom} onDelete={onDelete}/>))}
        </div>
    );
};
