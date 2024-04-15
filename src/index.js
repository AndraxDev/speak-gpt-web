/****************************************************************
 * Copyright (c) 2023-2024 Dmytro Ostapenko. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *****************************************************************/

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { LicenseInfo } from '@mui/x-license';
import {LICENSE_KEY} from "./LicenseKey";
import {setMaxSettings, setMinSettings} from "./util/Settings";

LicenseInfo.setLicenseKey(LICENSE_KEY);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);


/* Set max global settings */
window._debug_setMaxSettings = () => {
    setMaxSettings()
}

/* Set min global settings */
window._debug_setMinSettings = () => {
    setMinSettings()
}
