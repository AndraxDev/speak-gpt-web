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
import {MaterialEditText} from "../widgets/MaterialEditText";
import Assistant from "./Assistant";
import {MaterialButton24, MaterialButtonTonal24} from "../widgets/MaterialButton";
import {CircularProgress} from "@mui/material";

function PromptView({prompt, updatePrompts}) {
    const [assistantIsOpened, setAssistantIsOpened] = React.useState(false);
    const [currentPrompt, setCurrentPrompt] = React.useState(prompt.prompt);
    const [modifiedPrompt, setModifiedPrompt] = React.useState(prompt.prompt);
    const [likeRequest, setLikeRequest] = React.useState(false);
    const [likeStatus, setLikeStatus] = React.useState(localStorage.getItem("likedPrompt" + prompt.id) === "true");

    useEffect(() => {
        setCurrentPrompt(prompt.prompt);
        setModifiedPrompt(prompt.prompt);
        document.getElementById("prompt").value = prompt.prompt;
    }, [prompt]);

    const likePrompt = () => {
        if (likeStatus) {
            console.log("Dislike");
            fetch("https://gpt.teslasoft.org/api/v1/dislike?api_key=16790f7ac03237764a8a0ad36eede490&id=" + prompt.id).then((r) =>
                r.json()
            ).then((r) => {
                if (r.code === 200) {
                    setLikeStatus(false);
                    localStorage.setItem("likedPrompt" + prompt.id, "false");
                    updatePrompts();
                }

                setLikeRequest(false);
            }).catch(() => {
                setLikeRequest(false);
            });
        } else {
            console.log("Like");
            fetch("https://gpt.teslasoft.org/api/v1/like?api_key=16790f7ac03237764a8a0ad36eede490&id=" + prompt.id).then((r) =>
                r.json()
            ).then((r) => {
                if (r.code === 200) {
                    setLikeStatus(true);
                    localStorage.setItem("likedPrompt" + prompt.id, "true");
                    updatePrompts();
                }

                setLikeRequest(false);
            }).catch(() => {
                setLikeRequest(false);
            });
        }
    }

    return (
        <div className={"prompt-cont"}>
            <div className={"prompt-frame"}>
                <h3 style={{
                    margin: "24px",
                }} className={"chat-title"}>{prompt.name}</h3>
                <div className={"prompt-area"}>
                    <MaterialEditText multiline defaultValue={currentPrompt} rows={10} id={"prompt"} label={"Prompt"} onChange={(e) => {
                        setModifiedPrompt(e.target.value);
                    }} />
                    <div className={"prompt-tags"}>
                        <p className={"prompt-tag"}>Prompt by: {prompt.author}</p>
                        <p className={"prompt-tag"}>Category: {prompt.category === "" ? "uncategorized" : prompt.category}</p>
                    </div>
                </div>
                <div className={"prompt-actions"}>
                    <MaterialButton24 onClick={() => {
                        setAssistantIsOpened(true)
                    }} sx={{
                        width: "150px",
                        height: "64px",
                        borderRadius: "16px",
                    }}><span className={"material-symbols-outlined"}>play_arrow</span>&nbsp;<span>Try it</span></MaterialButton24>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    {
                        likeRequest ? <MaterialButtonTonal24 sx={{
                            width: "150px",
                            height: "64px",
                            borderRadius: "16px",
                        }}><CircularProgress sx={{
                            color: "var(--color-accent-800)",
                            }}/></MaterialButtonTonal24> :
                            <MaterialButtonTonal24 sx={{
                                width: "150px",
                                height: "64px",
                                borderRadius: "16px",
                            }} onClick={() => {
                                setLikeRequest(true);
                                likePrompt();
                            }}><span className={"material-symbols-outlined"}>thumb_up</span>&nbsp;<span>{prompt.likes}</span></MaterialButtonTonal24>
                    }
                </div>
            </div>
            {
                assistantIsOpened ? <div className={"assistant-container"}>
                    <Assistant runtimePrompt={modifiedPrompt} type={prompt.type.toLowerCase()} closeWindow={setAssistantIsOpened} />
                </div> : null
            }
        </div>
    );
}

export default PromptView;