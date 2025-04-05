import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useState, useEffect }  from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './index.css';

import TypingArea from "./component/TypingArea";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/typingArea" element={<TypingArea/>}></Route>
    </Routes>
  </BrowserRouter>
);