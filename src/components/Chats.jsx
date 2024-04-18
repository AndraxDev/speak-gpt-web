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

import React, {useEffect} from 'react';
import ChatItem from "./ChatItem";
import {sha256} from "js-sha256";

function Chats({selectedChat, id, chats, setSelectedChatForDeletion, setSelectedChatForEdit, ...props}) {

    const [stateSelectedChat, setStateSelectedChat] = React.useState(selectedChat);
    const [selectedChatForDeletionTemp, setSelectedChatForDeletionTemp] = React.useState("");
    const [selectedChatForEditTemp, setSelectedChatForEditTemp] = React.useState("");
    const [isEditTemp, setIsEditTemp] = React.useState(false);
    const [isDeleteTemp, setIsDeleteTemp] = React.useState(false);

    useEffect(() => {
        if (chats === null) return;

        chats.forEach((e) => {
            if (sha256(e.title) === id) {
                setStateSelectedChat(e.title);
            }
        });

        if (id === undefined) {
            setStateSelectedChat("");
        }
    }, [chats, id, selectedChat, stateSelectedChat]);

    useEffect(() => {
        if (isDeleteTemp) {
            setIsDeleteTemp(false);
            setSelectedChatForDeletion(selectedChatForDeletionTemp);
        }

        if (isEditTemp) {
            setIsEditTemp(false);
            setSelectedChatForEdit(selectedChatForEditTemp);
        }
    }, [isEditTemp, isDeleteTemp, setSelectedChatForDeletion, selectedChatForDeletionTemp, setSelectedChatForEdit, selectedChatForEditTemp]);

    return (
        <div>
            {
                chats !== null ?
                chats.map((e) => {
                    return (
                        <div key={sha256(e.title)} onClick={() => {
                            props.setSelected(e.title);
                        }}>
                            <ChatItem isActive={e.title === stateSelectedChat} name={e.title} model={e.model} type={e.type} id={sha256(e.title)} setDeleteChat={setSelectedChatForDeletionTemp} setEditChat={setSelectedChatForEditTemp} setIsDelete={setIsDeleteTemp} setIsEdit={setIsEditTemp}/>
                        </div>
                    )
                }) : null
            }
            <div style={{
                height: '100px'
            }}></div>
        </div>
    );
}

export default Chats;