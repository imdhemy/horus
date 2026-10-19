import { EmptyState } from './empty-state';
import { LibraryHeader } from './library-header';
import { LibraryHint } from './library-hint';
import { RomList } from './rom-list';
import { LibraryProvider, useLibrary } from './library-provider';
import { Notification, NotificationProvider } from '../../component/notification';

export const LibraryPage = () => {
    return (
        <NotificationProvider>
            <LibraryProvider>
                <LibraryHeader/>
                <Notification/>
                <LibraryContents/>
                <LibraryHint/>
            </LibraryProvider>
        </NotificationProvider>
    );
};

function LibraryContents() {
    const { roms } = useLibrary();
    return roms.length === 0 ? <EmptyState/> : <RomList/>;
}
