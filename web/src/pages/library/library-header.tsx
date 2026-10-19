import { BrowseButton } from './browse-button';
import { useLibrary } from './library-provider';

type LibraryHeaderProps = {
    count: number;
};

function EmptyLibraryHeader() {
    return (
        <div className='flex justify-between mb-5'>
            <div>
                <h2 className='text-3xl font-bold mb-1 text-primary-text'>Your Library</h2>
                <p className='text-sm text-secondary-text'>Ready for your next score?</p>
            </div>
            <div>
                <p>0 game(s)</p>
            </div>
        </div>
    );
}

function PopulatedLibraryHeader({ count }: LibraryHeaderProps) {
    return (
        <div className='mb-5 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <div>
                <h2 className='text-3xl font-bold mb-1 text-primary-text'>Your Library</h2>
                <p className='text-sm text-secondary-text'>{count} game(s) stored in this browser.</p>
            </div>
            <div className='shrink-0'>
                <BrowseButton/>
            </div>
        </div>
    );
}

export function LibraryHeader() {
    const { roms } = useLibrary();
    return roms.length === 0 ? <EmptyLibraryHeader/> : <PopulatedLibraryHeader count={roms.length}/>;
}
