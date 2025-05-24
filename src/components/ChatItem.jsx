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

import React, {useEffect} from 'react';
import gpt from "./../gpt.svg";
import {Link} from "react-router-dom";
import {isMobile} from "react-device-detect";

function ChatItem({name, id, model, type, firstMessage, isActive, setDeleteChat, setEditChat, setIsDelete, setIsEdit, ...props}) {

    const [intType, setIntType] = React.useState(0);

    useEffect(() => {
        if (type === "GPT 3.5") {
            setIntType(1);
        } else if (type === "GPT 4 Turbo") {
            setIntType(2);
        } else if (type === "GPT 4") {
            setIntType(3);
        } else if (type === "FT") {
            setIntType(4);
        } else if (type === "GPT 3.5 (0125)") {
            setIntType(5);
        } else if (type === "O1") {
            setIntType(5);
        }
    }, [type]);

    return (
        <Link to={"/chat/" + id} style={{
            textDecoration: 'none',
            color: 'inherit'
        }}>
            <div className={isActive && !isMobile ? "chat-item-active-" + intType.toString() + " " + (isMobile ? "chat-item-mob" : "chat-item") : "chat-item-" + intType.toString() + " " + (isMobile ? "chat-item-mob" : "chat-item")}>
                <div className={"chat-icon-frame-" + intType.toString() + " " + (isMobile ? "chat-icon-frame-mob" : "chat-icon-frame")} style={{
                    // background: "url(" + generateSvgBase64(color) + ")", backgroundSize: "cover"
                }}>
                    <img className={isMobile ? "chat-icon-mob" : "chat-icon"} src={gpt} alt={"GPT"}/>
                </div>
                <div className={isMobile ? "chat-item-info-mob" : "chat-item-info"}>
                    <h3 className={isMobile ? "chat-item-title-mob" : "chat-item-title"}>{name}</h3>
                    <p className={isMobile ? "chat-item-message-mob" : "chat-item-message"}>{firstMessage}</p>
                    {/*<p className={isMobile ? "chat-item-model-mob" : "chat-item-model"}>{model}</p>*/}
                </div>
                <div className={"chat-actions"}><span onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setIsEdit(true)
                    setEditChat(name)
                    setDeleteChat("")
                }} style={isMobile ? {
                    fontSize: "20px",
                } : {
                    fontSize: "14px"
                }} className={(isMobile ? "action-mob" : "action") + " material-symbols-outlined"}>edit</span>&nbsp;<span onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setIsDelete(true)
                    setDeleteChat(name)
                    setEditChat("")
                }} style={isMobile ? {
                    fontSize: "20px",
                } : {
                    fontSize: "14px"
                }} className={(isMobile ? "action-dangerous-mob" : "action-dangerous") + " material-symbols-outlined"}>cancel</span></div>
            </div>
        </Link>
    );
}

export default ChatItem;
