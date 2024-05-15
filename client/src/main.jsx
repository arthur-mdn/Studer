import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import NewRealization from './NewRealization.jsx';
import {ModaleProvider} from "./components/Modale/ModaleContext.jsx";
import './index.css';
import NewQuiz from "./NewQuiz.jsx";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <BrowserRouter>
        <ModaleProvider>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/realization/new" element={<NewRealization />} />
                <Route path="/quiz/new" element={<NewQuiz />} />
            </Routes>
        </ModaleProvider>
    </BrowserRouter>
);
