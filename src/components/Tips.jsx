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
import ProTip from "./ProTip";
import {isMobile, MobileView} from "react-device-detect";

const tips = [
    "Start your message with /imagine to generate an image.",
    "Search tricks:\n\nUse \"author:\" " +
    "prefix to search by author.\nUse \"title:\" " +
    "prefix to search by title.\nUse \"id:\" " +
    "prefix to search by id.\nUse \"cat:\" " +
    "prefix to search y category.\nUse \"type:\" " +
    "prefix to search by type.",
    "ChatGPT is stuffy? Try out other models. Sometimes you may get very interesting results.",
    "Only GPT models can remember previous messages. Other models are not optimized for it.",
    "Sometimes some weird or useless features may appear. It because this app is in beta test.",
    "SpeakGPT is too slow? Try to reduce max tokens per output.",
    "Getting the same picture in the photo editor as you sent? Don't forget to draw a mask.",
    "Getting generation errors after updating to SpeakGPT 1.5.0? Add or change API endpoint. Usually it will be done automatically, but if not you can do it manually."
]

function setFullHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Set the height initially
setFullHeight();

// Re-calculate on resize or orientation change
window.addEventListener('resize', setFullHeight);
window.addEventListener('orientationchange', setFullHeight);

function Tips() {
    return (
        <div style={isMobile ? {
            overflowY: "hidden",
            height: "calc(calc(var(--vh, 1vh) * 100) - 92px)"
        } : {}}>
            <h2 className={"page-title"}>Tips</h2>

            <div className={isMobile ? "tips-mob" : "tips"}>
                {tips.map((tip, index) => {
                    return (
                        <ProTip key={index} text={tip} />
                    );
                })}

                <MobileView>
                    <div style={{
                        width: "100%",
                        height: "200px"
                    }}/>
                </MobileView>
            </div>
        </div>
    );
}

export default Tips;