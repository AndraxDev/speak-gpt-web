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
import {MaterialEditText} from "../widgets/MaterialEditText";
import {MaterialButton24, MaterialButtonError, MaterialButtonOutlined24} from "../widgets/MaterialButton";
import {deleteEndpoint, getApiEndpointById, renameEndpoint, setApiEndpointById} from "../util/Settings";
import {MaterialDialog} from "./MaterialDialog";

function ApiEndpointEditDialog({endpointId, isOpened, setIsOpened, ...props}) {
    const [label, setLabel] = React.useState(endpointId === "" ? "" : getApiEndpointById(endpointId).label);
    const [url, setUrl] = React.useState(endpointId === "" ? "" : getApiEndpointById(endpointId).url);
    const [key, setKey] = React.useState("");
    const previousKey = endpointId === "" ? "" : getApiEndpointById(endpointId).key;

    const setApiEndpoint = () => {
        if (label !== getApiEndpointById(endpointId).label) {
            renameEndpoint(endpointId, label)
        } else {
            setApiEndpointById(label, url, key === "" ? previousKey : key);
        }
        setIsOpened(false);
    }

    return (
        <div className={"priority-ultra dialog-backdrop"} onMouseDown={(e) => {
            e.stopPropagation();
            setIsOpened(false);
        }}>
            <MaterialDialog open={true}>
            <div className={"dialog-paper"} onMouseDown={(e) => {
                e.stopPropagation();
            }}>
                <h3 className={"dialog-title"}>Set API endpoint</h3>
                <div className={"dialog-content"}>
                    <p style={{
                        margin: "0",
                        width: "calc(100% - 32px)"
                    }} className={"hint"}>Let's begin with setup your favorite API endpoint. Since SpeakGPT Web 1.5 you
                        can add multiple API endpoints and use SpeakGPT to access GPR, Gemini, Claude, etc. If you're
                        using local or unknown API and receiving CORS error (see console) make sure CORS headers are
                        present in your API endpoint.</p>
                    <p className={"warning"}>Enter the key only if you are using this app at
                        https://assistant.teslasoft.org/. Other links may be insecure and phishing.</p>
                    <MaterialEditText label="Label" value={label}
                                      onChange={(e) => {
                                          setLabel(e.target.value)
                                      }}/>
                    <br/><br/>
                    <MaterialEditText label="Base URL" value={url}
                                      onChange={(e) => {
                                          setUrl(e.target.value)
                                      }}/>
                    <br/><br/>
                    <MaterialEditText label="API Key (unchanged)" value={key}
                                      onChange={(e) => {
                                          setKey(e.target.value)
                                      }}/>

                </div>
                <div className={"dialog-actions"}>
                    <MaterialButtonOutlined24 onClick={() => {
                        setIsOpened(false);
                    }}>Cancel</MaterialButtonOutlined24>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    {
                        endpointId !== "" ? <>
                            <MaterialButtonError onClick={() => {
                                deleteEndpoint(endpointId);
                                setIsOpened(false);
                            }}>Delete</MaterialButtonError>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                        </> : null
                    }
                    <MaterialButton24 onClick={() => {
                        setApiEndpoint();
                    }}>Save</MaterialButton24>
                </div>
            </div>
            </MaterialDialog>
        </div>
    );
}

export default ApiEndpointEditDialog;