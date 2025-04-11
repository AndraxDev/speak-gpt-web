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
import gpt from "./../gpt.svg";
import {Link} from "react-router-dom";
import {isMobile} from "react-device-detect";

function ChatItem({name, id, model, type, firstMessage, isActive, setDeleteChat, setEditChat, setIsDelete, setIsEdit, ...props}) {

    const [intType, setIntType] = React.useState(0);
    const [color, setColor] = React.useState("#ff0000");

    const generateSvgBase64 = (color) => {
        let template = ` 
<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 184 184"
    id="vector">
    <path
        id="path"
        d="M 92 12 C 80.568 12 69.903 6.628 59.172 2.686 C 54.443 0.948 49.332 0 44 0 C 19.7 0 0 19.7 0 44 C 0 49.332 0.948 54.443 2.686 59.172 C 6.628 69.903 12 80.568 12 92 C 12 103.432 6.628 114.097 2.686 124.828 C 0.948 129.557 0 134.668 0 140 C 0 164.301 19.7 184 44 184 C 49.332 184 54.443 183.052 59.172 181.314 C 69.903 177.372 80.568 172 92 172 C 103.432 172 114.097 177.372 124.828 181.314 C 129.557 183.052 134.668 184 140 184 C 164.301 184 184 164.301 184 140 C 184 134.668 183.052 129.557 181.314 124.828 C 177.372 114.097 172 103.432 172 92 C 172 80.568 177.372 69.903 181.314 59.172 C 183.052 54.443 184 49.332 184 44 C 184 19.7 164.301 0 140 0 C 134.668 0 129.557 0.948 124.828 2.686 C 114.097 6.628 103.432 12 92 12 Z"
        fill="COLOR" fill-opacity="0.4"/>
</svg>
        `
        template = template.replace("COLOR", color);
        return "data:image/svg+xml;base64," + btoa(template);
    }

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
                    <p className={isMobile ? "chat-item-model-mob" : "chat-item-model"}>{model}</p>
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
