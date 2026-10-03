import { Outlet } from 'react-router-dom';
import { AppHeader } from '../component/app-header';
import { AppFooter } from '../component/app-footer';

export const Layout = () => {
    return (
        <div className='min-h-dvh flex flex-col'>
            <AppHeader/>
            <main className='flex-1'><Outlet context='library'/></main>
            <AppFooter/>
        </div>
    );
};
