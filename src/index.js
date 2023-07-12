import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './home';
import App from './App';
import Stats from './Stats'

let root = createRoot(document.getElementById("priorityRoot"));

root.render(
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/app" element={<App />} />
        <Route path="/stats" element={<Stats />}></Route>
      </Routes>
    </Router>
);