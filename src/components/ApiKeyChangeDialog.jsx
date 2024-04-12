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
import {MaterialButton24, MaterialButtonError, MaterialButtonOutlined24} from "../widgets/MaterialButton";

function ApiKeyChangeDialog(props) {
    const [apiKey, setApiKey] = React.useState("");

    const saveApiKey = () => {
        if (apiKey !== "") {
            localStorage.setItem('apiKey', apiKey);
            props.setIsOpen(false);
        }
    }

    return (
        <div className={"dialog-backdrop"} onMouseDown={() => {
            props.setIsOpen(false);
        }}>
            <div className={"dialog-paper"} onMouseDown={(e) => {
                e.stopPropagation()
            }}>
                <h3 className={"dialog-title"}>Change API Key</h3>
                <MaterialEditText label="API Key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
                <div className={"dialog-actions"}>
                    <MaterialButtonOutlined24 onClick={() => {
                        props.setIsOpen(false);
                    }}>Cancel</MaterialButtonOutlined24>
                    &nbsp;&nbsp;&nbsp;
                    <MaterialButtonError onClick={() => {
                        localStorage.removeItem('apiKey');
                    }}>Delete OpenAI key</MaterialButtonError>
                    &nbsp;&nbsp;&nbsp;
                    <MaterialButton24 onClick={saveApiKey}>Save</MaterialButton24>
                </div>
            </div>
        </div>
    );
}

export default ApiKeyChangeDialog;