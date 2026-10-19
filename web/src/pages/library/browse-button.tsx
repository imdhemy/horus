import { IoIosAddCircleOutline } from 'react-icons/io';
import { ChangeEvent, useRef } from 'react';
import { Button } from '../../component/button';
import { useLibrary } from './library-provider';
import { useNotification } from '../../component/notification';

export function BrowseButton() {
    const inputRef = useRef<HTMLInputElement>(null);
    const { add } = useLibrary();
    const notify = useNotification();

    function browse() {
        inputRef.current?.click();
    }

    async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.item(0);
        if (!file) return;

        await add(file);
        notify({ message: `Successfully uploaded ${file.name}`, variant: 'success' });
    }

    return <>
        <Button variant='primary' onClick={browse}>
            <IoIosAddCircleOutline className='inline-block mr-2'/> add games
        </Button>
        <input ref={inputRef} className='hidden' type='file' onChange={handleFileChange} accept='.nes'/>
    </>;
}
