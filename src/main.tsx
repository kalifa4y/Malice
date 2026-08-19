import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@fontsource/darker-grotesque/400.css';
import '@fontsource/darker-grotesque/500.css';
import '@fontsource/darker-grotesque/600.css';
import '@fontsource/darker-grotesque/700.css';
import '@fontsource/darker-grotesque/800.css';
import '@fontsource/darker-grotesque/900.css';
import '@fontsource/google-sans-flex';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
