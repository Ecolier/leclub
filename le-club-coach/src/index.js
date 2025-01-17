import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { CookiesProvider } from 'react-cookie'
import reportWebVitals from './reportWebVitals';
import store from './store'

import App from './pages/app.js'
import { StoreContext } from 'storeon/react'
import Home from './Home';

ReactDOM.render(
  <Home></Home>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
