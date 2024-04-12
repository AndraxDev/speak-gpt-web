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
import {MaterialEditText} from "../widgets/MaterialEditText";
import {MaterialButton24} from "../widgets/MaterialButton";

function ApiKeyDialog(props) {
    const [apiKey, setApiKey] = React.useState("");

    const saveApiKey = () => {
        if (apiKey !== "") {
            localStorage.setItem('apiKey', apiKey);
            window.location.reload();
        }
    }

    return (
        <>
            {
                localStorage.getItem('apiKey') === null || localStorage.getItem('apiKey') === undefined || localStorage.getItem('apiKey') === "" ?
                    <div className={"priority dialog-backdrop"}>
                        <div className={"dialog-paper"}>
                            <h3 className={"dialog-title"}>Setup</h3>
                            <p className={"dialog-content"}>To use this software you need to provide your OpenAI API key. SpeakGPT uses paid OpenAI models. API usage is significantly cheaper than fixed subscription. API-key authentication is safer than username/password authentication. App can access only API but not account info. You can revoke API key anytime without losing your account. API key is stored only on your device.</p>
                            <MaterialEditText label="API Key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
                            <p className={"warning"}>Enter the key only if you are using this app at https://assistant.teslasoft.org/. Other links may be insecure and phishing.</p>
                            <div className={"dialog-actions"}>
                                <MaterialButton24 onClick={saveApiKey}>Save</MaterialButton24>
                            </div>
                        </div>
                    </div>
                    : null
            }
        </>
    );
}

export default ApiKeyDialog;