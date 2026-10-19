import { GrStorage } from 'react-icons/gr';

export function LibraryHint() {
    return <div className='text-secondary-text'>
        <p><GrStorage className='inline-block mr-2'/>Stored in this browser. Clearing site data removes your library.</p>
    </div>;
}
