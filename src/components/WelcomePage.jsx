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

function WelcomePage() {
    return (
        <div>
                <h2 className={"title"}>SpeakGPT Desktop</h2>
                <p className={"warning"}>This version of SpeakGPT is currently on alpha stage. You can try it before
                        official release. Be careful as some rough edges may appear.
                        Click the button below
                        to launch SpeakGPT.</p>
                <Link to={"/chat"}><MaterialButton24>Launch SpeakGPT</MaterialButton24></Link>
                <br/><br/>
                <code className={"comment"}>// Developer note: This page must be replaced with welcome page.</code>
                <h3 className={"title"}>Changelog:</h3>
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
