import { Link } from 'react-router-dom';
import React from 'react';

export type Rom = {
    id: string;
    name: string;
};

type Props = {
    roms: Rom[];
    emptyStateMessage?: string;
};

function EmptyState({ message }: { message?: string }) {
    return <div>{message ?? 'No ROMs available.'}</div>;
}

function RomItem({ rom }: { rom: Rom }) {
    return (
        <Link className='flex justify-between items-center px-5 py-3 border border-amber-300 cursor-pointer no-underline' to={`/run/${rom.id}`}>
            <span>{rom.name}</span>
            <span className='text-amber-300'>&rsaquo;</span>
        </Link>
    );
}

export const RomList = ({ roms, emptyStateMessage }: Props) => {
    return (
        <div className='mb-4'>
            {(roms.length === 0) && <EmptyState message={emptyStateMessage}/>}
            {roms.map((rom) => (<RomItem key={rom.id} rom={rom}/>))}
        </div>
    );
};
