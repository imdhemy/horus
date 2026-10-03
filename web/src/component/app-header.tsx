import logo from '../../assets/images/logo.svg';
import { Link } from 'react-router-dom';


export const AppHeader = () => {
    return (
        <header className='mb-5 p-5 border-b border-gray-700 text-text'>
            <div className='flex gap-10'>
                <Link to='/' className='flex items-center gap-2'>
                    <img src={logo} alt='Logo' className='w-12 h-12'/>
                    <h1 className='text-3xl font-pixels font-bold'>Horus</h1>
                </Link>
            </div>
        </header>
    );
};
