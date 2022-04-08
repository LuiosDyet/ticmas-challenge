import React from 'react';
import { render } from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthProvider';
import reportWebVitals from './reportWebVitals';

const container = document.getElementById('root');
render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <App />
          </AuthProvider>
      </BrowserRouter>
  </React.StrictMode>,
    container,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
