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
import NavigationBar from "../widgets/NavigationBar";
import Assistant from "./Assistant";
import {BrowserView, MobileView, isMobile} from "react-device-detect";
import NavigationBarMobile from "../widgets/NavigationBarMobile";

function setFullHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Set the height initially
setFullHeight();

// Re-calculate on resize or orientation change
window.addEventListener('resize', setFullHeight);
window.addEventListener('orientationchange', setFullHeight);

function MaterialWindow({children, page, ...props}) {

    const [assistantOpened, setAssistantOpened] = React.useState(false);

    return (
        <div style={{
            height: "calc(var(--vh, 1vh) * 100)",
            backgroundColor: "#000",
        }}>
            <div style={{
                overflow: "hidden"
            }} className={isMobile ? "material-window-background-mob" : "material-window-background"}>
                {
                    assistantOpened ?
                        <div className={"assistant-container"}>
                            <Assistant runtimePrompt={""} type={""} closeWindow={setAssistantOpened} />
                        </div> : null
                }
                <MobileView>
                    <NavigationBarMobile page={page} openAssistant={() => {
                        setAssistantOpened(true);
                    }}/>
                </MobileView>
                <BrowserView>
                    <NavigationBar page={page} openAssistant={() => {
                        setAssistantOpened(true);
                    }}/>
                </BrowserView>
                <div style={isMobile ? {
                    height: "calc(calc(var(--vh, 1vh) * 100) - 80px)",
                } : {}} className={isMobile ? "content-mob" : "content"}>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default MaterialWindow;