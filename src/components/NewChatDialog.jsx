/****************************************************************
 * Copyright (c) 2023-2026 Dmytro Ostapenko. All rights reserved.
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

import {useEffect, useState} from 'react';
import {MaterialEditText} from "../widgets/MaterialEditText";
import {MaterialButton24, MaterialButtonOutlined24} from "../widgets/MaterialButton";
import {MaterialDialog} from "./MaterialDialog";
import PropTypes from "prop-types";

function NewChatDialog({chatName, setChatName, invalidMessage, setChatDialogOpen, isEdit, setIsEditing}) {
    const [tempChatName, setTempChatName] = useState("");

    useEffect(() => {
        setTempChatName(chatName);
    }, [chatName]);

    return (
        <div className={"dialog-backdrop"} onMouseDown={() => {
            setChatDialogOpen(false);
        }}>
            <MaterialDialog open={true}>
            <div className={"dialog-paper"} onMouseDown={(e) => {
                e.stopPropagation();
            }}>
                <h3 className={"dialog-title"}>{isEdit ? "Edit chat" : "New chat"}</h3>
                <MaterialEditText label={"Chat name"} defaultValue={chatName} helperText={chatName === "" || tempChatName === "" || invalidMessage !== "Please enter chat name." ? invalidMessage : ""} onChange={(e) => {
                    setTempChatName(e.target.value);
                }}/>
                <div className={"dialog-actions"}>
                    <MaterialButtonOutlined24 onClick={() => {
                        setChatDialogOpen(false);
                    }}>Cancel</MaterialButtonOutlined24>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <MaterialButton24 onClick={() => {
                        setIsEditing(isEdit);
                        setChatName(tempChatName);
                    }}>{isEdit ? "Save" : "Create"}</MaterialButton24>
                </div>
            </div>
            </MaterialDialog>
        </div>
    );
}

NewChatDialog.propTypes = {
    chatName: PropTypes.string,
    setChatName: PropTypes.func,
    invalidMessage: PropTypes.string,
    setChatDialogOpen: PropTypes.func,
    isEdit: PropTypes.bool,
    setIsEditing: PropTypes.func
}

export default NewChatDialog;
