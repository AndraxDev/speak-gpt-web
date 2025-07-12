/****************************************************************
 * Copyright (c) 2023-2025 Dmytro Ostapenko. All rights reserved.
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
import CircularProgress from "@mui/material/CircularProgress";
import {isMobile} from "react-device-detect";

function setFullHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Set the height initially
setFullHeight();

// Re-calculate on resize or orientation change
window.addEventListener('resize', setFullHeight);
window.addEventListener('orientationchange', setFullHeight);

function Placeholder() {
    return (
        <div style={isMobile ? {
            height: "calc(var(--vh, 1vh) * 100)",
        } : {}} className={isMobile ? "placeholder-bg-mob" : "placeholder-bg"}>
            <CircularProgress sx={{
                color: "var(--color-accent-800)",
                width: "72px !important",
                height: "72px !important",
            }}/>
        </div>
    );
}

export default Placeholder;