import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useState, useEffect }  from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './index.css';

import TypingArea from "./component/TypingArea";
import GamingArea from "./component/GamingArea";
import Multiplayer from './component/Multiplayer';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<TypingArea/>}></Route>
      <Route
          path="/game"
          element={ <GamingArea />
          }
        ></Route>
        <Route path="/multiplayer" element={<Multiplayer/>}></Route>

    </Routes>
  </BrowserRouter>
);