import { IoGameController, IoLogoGithub } from 'react-icons/io5';
import imdhemy from '../../assets/images/imdhemy.png';

export const AppFooter = () => {
    return (
        <footer className='p-5 border-t border-gray-700 text-text'>
            <div className='flex flex-col gap-4 text-sm lg:flex-row lg:justify-between'>
                <div className='flex items-center gap-2'>
                    <IoGameController className='shrink-0' size='1.5em'/>
                    <span>Horus: Opensource NES Emulator in your browser</span>
                </div>
                <div className='flex items-center gap-2'>
                    <IoLogoGithub className='shrink-0' size='1.5em'/>
                    <span>
                        Check source-code on <a className='text-primary' href='https://github.com/imdhemy/horus'>Github</a>
                    </span>
                </div>
                <div className='flex items-center gap-2'>
                    <img className='shrink-0' width={24} height={24} src={imdhemy} alt='imdhemy'/>
                    <span>
                        Maintained by <a className='text-primary' href='https://imdhemy.com/'>Dhemy</a> and contributors
                    </span>
                </div>
            </div>
        </footer>
    );
};
