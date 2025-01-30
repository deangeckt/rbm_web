import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Design from './design/Design';
import Simulate from './simulate/Simulate';
import Wrapper from './Wrapper';
import './index.css';

const routing = (
    <Router>
        <Wrapper>
            <Routes>
                <Route path="/" Component={App} />
                <Route path="/design" Component={Design} />
                <Route path="/simulate" Component={Simulate} />
            </Routes>
        </Wrapper>
    </Router>
);

const rootElement = document.getElementById('root');
console.log(rootElement);
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(routing);
}
