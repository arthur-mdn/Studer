import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import New from './New.jsx';
import {ModaleProvider} from "./components/Modale/ModaleContext.jsx";
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <ModaleProvider>
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="/realization/new" element={<New />} />
                </Routes>
            </ModaleProvider>
        </BrowserRouter>
    </React.StrictMode>
);
