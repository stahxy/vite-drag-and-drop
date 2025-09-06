import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from 'react-router'
import Board from './pages/board/Board'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <StrictMode>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/board" element={<Board />} />
            </Routes>
        </StrictMode>
    </BrowserRouter>,
)
