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
import {Link} from "react-router-dom";
import {MaterialButton24} from "../widgets/MaterialButton";
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

function WelcomePage() {
    return (
        <div style={isMobile ? {
                padding: "24px",
                overflowY: "auto",
                height: "calc(calc(var(--vh, 1vh) * 100) - 140px)"
        } : {
                padding: "24px",
                overflowY: "auto",
                height: "calc(100vh - 48px)"
        }}>
                <h2 className={"title"}>Changelog</h2>
                <p className={"warning"}>This version of SpeakGPT is currently experimental. You can try it before
                        official release. Be careful as some rough edges may appear.
                        Click the button below
                        to launch SpeakGPT.</p>
                <code className={"title"}>1.0.0-rc4</code><br/>
                <code className={"text"}>- Added first message in chat list</code><br/>
                <br/>
                <code className={"title"}>1.0.0-rc3</code><br/>
                <code className={"text"}>- Improved mobile UI</code><br/>
                <br/>
                <code className={"title"}>1.0.0-rc2</code><br/>
                <code className={"text"}>- Bugfix</code><br/>
                <br/>
                <code className={"title"}>1.0.0-rc1</code><br/>
                <code className={"text"}>- Mobile version</code><br/>
                <br/>
                <code className={"title"}>0.9.0-beta09</code><br/>
                <code className={"text"}>- Personalize embedded assistants with icon and description</code><br/>
                <br/>
                <code className={"title"}>0.8.0-beta08</code><br/>
                <code className={"text"}>- Customize embedded assistants with payload</code><br/>
                <br/>
                <code className={"title"}>0.7.0-beta07</code><br/>
                <code className={"text"}>- Embedded assistant chats are now saved</code><br/>
                <br/>
                <code className={"title"}>0.6.0-beta06</code><br/>
                <code className={"text"}>- Assistant message bar autofocus</code><br/>
                <br/>
                <code className={"title"}>0.5.0-beta05</code><br/>
                <code className={"text"}>- Small fixes</code><br/>
                <br/>
                <code className={"title"}>0.4.0-beta04</code><br/>
                <code className={"text"}>- Added mobile assistant</code><br/>
                <br/>
                <code className={"title"}>0.3.0-beta03</code><br/>
                <code className={"text"}>- Minor fixes</code><br/>
                <br/>
                <code className={"title"}>0.2.0-beta02</code><br/>
                <code className={"text"}>- Added embedded assistant</code><br/>
                <br/>
                <code className={"title"}>0.1.1-beta01</code><br/>
                <code className={"text"}>- Minor fixes</code><br/>
                <br/>
                <code className={"title"}>0.1.0-beta01</code><br/>
                <code className={"text"}>- First public beta release.</code><br/>
                <code className={"text"}>- Improved images upload.</code><br/>
                <br/>
                <code className={"title"}>0.0.14-alpha14</code><br/>
                <code className={"text"}>- Finished Prompts Store.</code><br/>
                <code className={"text"}>- Added Quick Assistant.</code><br/>
                <br/>
                <code className={"title"}>0.0.13-alpha13</code><br/>
                <code className={"text"}>- UI improvements.</code><br/>
                <br/>
                <code className={"title"}>0.0.12-alpha12</code><br/>
                <code className={"text"}>- Added code highlighting form more programming languages.</code><br/>
                <br/>
                <code className={"title"}>0.0.11-alpha11</code><br/>
                <code className={"text"}>- Now you can unset your API key and skip API key setup.</code><br/>
                <code className={"text"}>- Added full list of available models</code><br/>
                <br/>
                <code className={"title"}>0.0.10-alpha10</code><br/>
                <code className={"text"}>- Search chat added</code><br/>
                <code className={"text"}>- Tips page added</code><br/>
                <br/>
                <code className={"title"}>0.0.9-alpha9</code><br/>
                <code className={"text"}>- Minor bugs fixed</code><br/>
                <br/>
                <code className={"title"}>0.0.8-alpha8</code><br/>
                <code className={"text"}>- Implemented GPT 4 Vision</code><br/>
                <code className={"text"}>- Chats settings are now take effect</code><br/>
                <br/>
                <code className={"title"}>0.0.7-alpha7</code><br/>
                <code className={"text"}>- Added chat settings</code><br/>
                <br/>
                <code className={"title"}>0.0.6-alpha6</code><br/>
                <code className={"text"}>- Added ability to clear chats</code><br/>
                <code className={"text"}>- Bugs fixed</code><br/>
                <br/>
                <code className={"title"}>0.0.5-alpha5</code><br/>
                <code className={"text"}>- Minor bugs fixed</code><br/>
                <br/>
                <code className={"title"}>0.0.4-alpha4</code><br/>
                <code className={"text"}>- Added code highlighting</code><br/>
                <code className={"text"}>- Minor improvements</code><br/>
                <br/>
                <code className={"title"}>0.0.3-alpha3</code><br/>
                <code className={"text"}>- Added image generation.</code><br/>
                <code className={"text"}>- Fixed minor bugs.</code><br/>
                <br/>
                <code className={"title"}>0.0.2-alpha2</code><br/>
                <code className={"text"}>- Changed chats location. Chats are now located in the indexed DB. We're
                        preparing
                        for image generation and chats import/export. You might also noticed that you chats has gone.
                        Open
                        Developers Tools > Console and put command localStorage.chatId, where chatId is a sha256 hash of
                        the
                        chat name to recover a chat. You can load chat as JSON in SpeakGPT mobile app now. Web version
                        will
                        receive this feature soon.</code><br/>
                <code className={"text"}>- Added autoscroll in chats.</code><br/>
                <br/>
                <code className={"title"}>0.0.1-alpha1</code><br/>
                <code className={"text"}>- Initial release.</code><br/>
                <code className={"text"}>- You can create multiple chats.</code><br/>
                <code className={"text"}>- You can select different AI models.</code>
        </div>
    );
}

export default WelcomePage;
