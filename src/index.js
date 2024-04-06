import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { LicenseInfo } from '@mui/x-license';
import {LICENSE_KEY} from "./LicenseKey";

LicenseInfo.setLicenseKey(LICENSE_KEY);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);
