import { PiFloppyDiskDuotone } from 'react-icons/pi';
import { BrowseButton } from './browse-button';

export function EmptyState() {
    return <div className='border border-gray-700 border-dashed rounded-sm p-5 mb-5'>
        <div className='mb-5 flex flex-col items-center justify-center'>
            <PiFloppyDiskDuotone size='100' className='text-primary'/>
            <p className='text-secondary-text text-sm'>Add .nes files from your device.</p>
        </div>
        <div className='flex flex-col items-center justify-center'>
            <BrowseButton/>
        </div>
    </div>;
}
