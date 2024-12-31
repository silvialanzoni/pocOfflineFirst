import React from 'react';
import ReactDOM from 'react-dom/client'; // Importa il nuovo metodo di React 18
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Trova l'elemento root
const root = ReactDOM.createRoot(document.getElementById('root'));

// Usa il nuovo metodo `createRoot` per montare l'app
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
