import { Outlet } from 'react-router-dom';
import { AppHeader } from '../component/app-header';
import { AppFooter } from '../component/app-footer';

export const Layout = () => {
    return (
        <div>
            <AppHeader/>
            <main><Outlet context='library'/></main>
            <AppFooter/>
        </div>
    );
};
