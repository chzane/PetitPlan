import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

import HomePage from './pages/HomePage';


function App() {
    return (
        <>
            <Toaster richColors position="top-center" />
            <Routes>
                <Route path="/" element={<HomePage />} />
            </Routes>
        </>
    )
}

export default App
