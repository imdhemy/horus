import { useLibrary } from './library-provider';
import { RomItem } from './rom-item';

export const RomList = () => {
    const { roms } = useLibrary();
    return (
        <div className='flex flex-col gap-3'>
            {roms.map((rom) => (
                <RomItem key={rom.id} {...rom}/>
            ))}
        </div>
    );
};
