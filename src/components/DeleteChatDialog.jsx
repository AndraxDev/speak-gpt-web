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
import {MaterialButton24, MaterialButtonOutlined24} from "../widgets/MaterialButton";
import {MaterialDialog} from "./MaterialDialog";

function DeleteChatDialog({setOpenState, chatName, setChatName, ...props}) {
    return (
        <div className={"dialog-backdrop"} onMouseDown={() => {
            setChatName("");
            setOpenState(false);
        }}>
            <MaterialDialog open={true}>
            <div className={"dialog-paper"} onMouseDown={(e) => {
                e.stopPropagation();
            }}>
                <h3 className={"dialog-title"}>Confirm deletion</h3>
                <p className={"dialog-content"}>Are you sure you want to delete this chat?</p>
                <div className={"dialog-actions"}>
                    <MaterialButtonOutlined24 onClick={() => {
                        setChatName("");
                        setOpenState(false);
                    }}>Cancel</MaterialButtonOutlined24>
                    &nbsp;&nbsp;&nbsp;
                    <MaterialButton24 onClick={() => {
                        setChatName(chatName);
                        setOpenState(false);
                    }}>Delete</MaterialButton24>
                </div>
            </div>
            </MaterialDialog>
        </div>
    );
}

export default DeleteChatDialog;