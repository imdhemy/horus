import { Rom } from '../../model/rom';
import { PiFloppyDiskBackDuotone } from 'react-icons/pi';
import { timeForHuman } from './time-for-human';
import { IoIosPlay, IoIosTrash } from 'react-icons/io';
import { Link } from '../../component/link';
import { Button } from '../../component/button';
import { useState } from 'react';
import { useLibrary } from './library-provider';
import { useNotification } from '../../component/notification';

export const RomItem = ({ id, name, createdAt }: Rom) => {
    const { remove } = useLibrary();
    const notify = useNotification();
    const [removing, setRemoving] = useState(false);

    async function handleRemove() {
        if (removing) return;
        if (!window.confirm(`Remove “${name}” from your library?`)) return;
        setRemoving(true);

        try {
            await remove(id);
            notify({ message: `Removed ${name} from your library.`, variant: 'success' });
        } catch {
            notify({ message: `Could not remove ${name}. Please try again.`, variant: 'failure' });
        } finally {
            setRemoving(false);
        }
    }

    return (
        <div className='flex flex-col gap-4 rounded-md border border-secondary-text/25 bg-primary-text/5 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-6'>
            <div className='flex min-w-0 items-center gap-4'>
                <div className='flex size-16 shrink-0 items-center justify-center rounded-sm bg-secondary-text/15 text-primary'>
                    <PiFloppyDiskBackDuotone className='size-10'/>
                </div>
                <div className='min-w-0'>
                    <h2 className='wrap-break-word text-lg font-semibold text-primary-text'>{name}</h2>
                    <p className='mt-1 text-sm text-secondary-text'>{timeForHuman(createdAt)}</p>
                </div>
            </div>
            <div className='grid shrink-0 grid-cols-2 items-center gap-2'>
                <Link size='sm' variant='primary' to={`/play/${id}`}><IoIosPlay className='inline-block mr-2'/> Play</Link>
                <Button size='sm' variant='danger' aria-label={`Remove ${name}`} disabled={removing} onClick={handleRemove}><IoIosTrash className='inline-block mr-2'/> Remove</Button>
            </div>
        </div>
    );
};
