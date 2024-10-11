import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './Authentication';
import { BrowserRouter } from 'react-router-dom';
import './index.css';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Cannot find root element');
}

const msalInstance = new PublicClientApplication(msalConfig);

const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MsalProvider>
  </React.StrictMode>
);
