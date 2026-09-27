import { HashRouter, Route, Routes } from 'react-router-dom';
import ListPage from './ListPage';
import RunPage from './RunPage';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<ListPage />} />
        <Route path="/run/:slug" element={<RunPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
