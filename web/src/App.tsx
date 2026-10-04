import { HashRouter, Route, Routes } from 'react-router-dom';
import ListPage from './ListPage';
import { checkIsSeen, setLastSeen } from './pages/splash/last-seen';
import { SplashScreen } from './pages/splash/splash-screen';
import { useEffect, useState } from 'react';
import { Layout } from './layouts/layout';
import RunPage from './RunPage';

const SPLASH_SCREEN_TIME = 5000;

function App() {
    const [showSplash, setShowSplash] = useState<boolean>(() => !checkIsSeen());

    function showSplashEffect() {
        if (!showSplash) return;

        function completeSplash() {
            setLastSeen();
            setShowSplash(false);
        }

        const timeout = window.setTimeout(completeSplash, SPLASH_SCREEN_TIME);

        return () => window.clearTimeout(timeout);
    }

    useEffect(showSplashEffect, [showSplash]);

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
