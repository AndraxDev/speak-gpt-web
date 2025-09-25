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
import {MaterialButton24} from "../widgets/MaterialButton.jsx";
import {isMobile} from "react-device-detect";
import {Link} from "react-router-dom";

function Debug() {
    return (
        <div className={isMobile ? "doc-bg-mob" : "doc-bg"} style={isMobile ? {
            padding: "24px",
            overflowY: "auto",
            height: "calc(calc(var(--vh, 1vh) * 100) - 140px)"
        } : {
            padding: "24px",
            overflowY: "auto",
            height: "calc(100vh - 48px)"
        }}>
            <div className={isMobile ? "doc-header-mob" : "doc-header"}>
                <Link to={"/"}><span className={"doc-title material-symbols-outlined"}>arrow_back</span></Link>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <h2 className={"doc-title"}>Debug</h2>
            </div>
            <br/><br/>
            <span className={"text"}>Supported app links:</span>
            <br/>
            <span className={"text"}>Just launch SpeakGPT mobile app (home screen):</span>
            <a href={"https://assistant.teslasoft.org/chat"}>https://assistant.teslasoft.org/chat</a>
            <br/>
            <span className={"text"}>Open a prompt inside SpeakGPT mobile app:</span>
            <a href={"https://assistant.teslasoft.org/prompts/vswPyF3848"}>https://assistant.teslasoft.org/prompts/vswPyF3848</a>
            <br/>
            <span className={"text"}>Launch SpeakGPT mobile assistant:</span>
            <a href={"https://assistant.teslasoft.org/assistant"}>https://assistant.teslasoft.org/assistant</a>
            <br/>
            <blockquote>
                <p style={{ padding: "16px 8px" }}>
                    If these links are pointing you to a web pages instead of app or you have 404 error, please make sure you have installed SpeakGPT version 3.21 or higher and opening supported links is permitted for this app.
                </p>
            </blockquote>

            <div style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                marginTop: "48px"
            }}>
                <a href={"/assistant"}>
                    <MaterialButton24 sx={{
                        border: "none",
                        transition: "border-radius 0.2s",
                        borderRadius: "48px",
                        width: "240px",
                        height: "72px",
                        fontSize: "18px",
                        "&:active": {
                            backgroundColor: "#fff",
                            borderRadius: "24px",
                            border: "none",
                            transition: "border-radius 0.2s",
                        }
                    }}>Launch Assistant</MaterialButton24>
                </a>
            </div>
        </div>
    );
}

export default Debug;
