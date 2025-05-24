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
import {MaterialButton24} from "../widgets/MaterialButton";
import {MaterialEditText} from "../widgets/MaterialEditText";
import {getApiHost, setApiHost} from "../util/Settings";
import {MaterialDialog} from "./MaterialDialog";

function ApiHostChangeDialog({chatId, setOpen, setApiHostD}) {
    const [apiHostX, setApiHostX] = React.useState(getApiHost(chatId));

    return (
        <div className={"priority dialog-backdrop"} onMouseDown={(e) => {
            e.stopPropagation();
            setOpen(false)
        }}>
            <MaterialDialog open={true}>
            <div className={"dialog-paper"} onMouseDown={(e) => e.stopPropagation()}>
                <h3 className={"dialog-title"}>API Host</h3>
                <div className={"dialog-content"}>
                    <p>Change API host if you are using custom OpenAI API endpoint.</p>
                    <MaterialEditText defaultValue={apiHostX} onChange={(e) => setApiHostX(e.target.value)} />
                </div>
                <div className={"dialog-actions"}>
                    <MaterialButton24 onClick={() => {
                        setApiHost(chatId, apiHostX);
                        if (setApiHostD !== undefined) setApiHostD(apiHostX);
                        setOpen(false);
                    }}>Save</MaterialButton24>
                </div>
            </div>
            </MaterialDialog>
        </div>
    );
}

export default ApiHostChangeDialog;