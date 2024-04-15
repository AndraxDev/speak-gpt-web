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
import {MaterialButton24, MaterialButtonOutlined24} from "../widgets/MaterialButton";

function SystemMessageEditDialog({setIsOpen, message, setMessage}) {

    const [currentMessage, setCurrentMessage] = React.useState(message);

    return (
        <div className={"dialog-backdrop"} onMouseDown={() => {
            setIsOpen(false);
        }}>
            <div className={"dialog-paper"} onMouseDown={(e) => {
                e.stopPropagation()
            }}>
                <h3 className={"dialog-title"}>Edit system message</h3>
                <MaterialEditText rows={4} multiline label="System message" defaultValue={message} onChange={(e) => {
                    setCurrentMessage(e.target.value);
                }}/>
                <div className={"dialog-actions"}>
                    <MaterialButtonOutlined24 onClick={() => {
                        setIsOpen(false);
                    }}>Cancel</MaterialButtonOutlined24>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <MaterialButton24 onClick={() => {
                        setMessage(currentMessage)
                        setIsOpen(false);
                    }}>Save</MaterialButton24>
                </div>
            </div>
        </div>
    );
}

export default SystemMessageEditDialog;