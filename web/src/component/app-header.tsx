import logo from '../../assets/images/logo.png';

export const AppHeader = () => {
    return (
        <header className='mb-5'>
            <div className='flex items-center gap-2'>
                <img src={logo} alt='Logo' className='w-12 h-12'/>
                <h1 className='text-3xl'>Horus</h1>
            </div>
            <p>
                A JavaScript NES emulator.{' '}
                <a href='https://github.com/imdhemy/horus' target='_blank'>
                    Source on GitHub.
                </a>
            </p>
        </header>

    );
};
