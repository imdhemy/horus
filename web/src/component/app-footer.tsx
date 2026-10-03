import { IoGameController, IoLogoGithub } from 'react-icons/io5';
import imdhemy from '../../assets/images/imdhemy.png';

export const AppFooter = () => {
    return (
        <footer className='p-5 border-t border-gray-700 text-text'>
            <div className='flex justify-between text-sm'>
                <div className='flex items-center gap-2'>
                    <IoGameController size='1.5em'/> Horus: Opensource NES Emulator in your browser
                </div>
                <div className='flex items-center gap-2'>
                    <IoLogoGithub size='1.5em'/>Check source-code on <a className='text-primary' href='https://github.com/imdhemy/horus'>Github</a>
                </div>
                <div className='flex items-center gap-2'>
                    <img width={24} height={24} src={imdhemy} alt='imdhemy'/> Maintained by <a className='text-primary'
                                                                                               href='https://imdhemy.com/'
                >Dhemy</a> and contributors
                </div>
            </div>
        </footer>
    );
};
