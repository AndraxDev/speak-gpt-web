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
import {MaterialDialog} from "./MaterialDialog";

function ApiKeyChangeDialog(props) {
    const [apiKey, setApiKey] = React.useState("");

    const saveApiKey = () => {
        if (apiKey !== "") {
            localStorage.removeItem('skipApiKeyCheck');
            localStorage.setItem('apiKey', apiKey);
            props.setIsOpen(false);
        }
    }

    return (
        <div className={props.isAssistant ? "dialog-backdrop-assistant" : "dialog-backdrop"} onMouseDown={() => {
            props.setIsOpen(false);
        }}>
            <MaterialDialog open={true}>
            <div className={"dialog-paper"} onMouseDown={(e) => {
                e.stopPropagation()
            }}>
                <h3 className={"dialog-title"}>Change API Key</h3>
                <div className={props.isAssistant ? "dialog-content-assistant" : "dialog-content"}>
                    <MaterialEditText label="API Key" value={apiKey} onChange={(e) => setApiKey(e.target.value)}/>
                    <p className={"warning"}>You can revoke API key <a rel={"noreferrer"} href={"https://platform.openai.com/api-keys"} target={"_blank"}>here</a> and unset it. When you unset an API key your chats will not be removed.</p>
                </div>
                <div className={"dialog-actions"}>
                    <MaterialButtonOutlined24 onClick={() => {
                        props.setIsOpen(false);
                    }}>Cancel</MaterialButtonOutlined24>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <MaterialButtonError onClick={() => {
                        localStorage.removeItem('apiKey');
                        window.location.reload();
                    }}>Unset API key</MaterialButtonError>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <MaterialButton24 onClick={saveApiKey}>Save</MaterialButton24>
                </div>
            </div>
            </MaterialDialog>
        </div>
    );
}

export default ApiKeyChangeDialog;