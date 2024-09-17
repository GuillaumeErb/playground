import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './authConfig';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Cannot find root element');
}

const msalInstance = new PublicClientApplication(msalConfig);

const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  </React.StrictMode>
);
