import { HashRouter, Route, Routes } from 'react-router-dom';
import ListPage from './ListPage';
import { checkIsSeen, setLastSeen } from './pages/splash/last-seen';
import { SPLASH_SCREEN_TIME, SplashScreen } from './pages/splash/splash-screen';
import { useEffect, useState } from 'react';
import { Layout } from './layouts/layout';
import RunPage from './RunPage';

function App() {
    const [showSplash, setShowSplash] = useState<boolean>(() => !checkIsSeen().ok);

    useEffect(() => {
        if (!showSplash) {
            return;
        }

        const timeout = window.setTimeout(() => {
            setLastSeen();
            setShowSplash(false);
        }, SPLASH_SCREEN_TIME);

        return () => window.clearTimeout(timeout);
    }, [showSplash]);

    if (showSplash) {
        return (<SplashScreen/>);
    }

    return (
        <HashRouter>
            <Routes>
                <Route element={<Layout/>}>
                    <Route index path='/' element={<ListPage/>}/>
                </Route>
                <Route path='/run/:slug' element={<RunPage/>}/>
            </Routes>
        </HashRouter>
    );
}

export default App;
