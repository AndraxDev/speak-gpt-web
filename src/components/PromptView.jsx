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
import {MaterialButton24, MaterialButtonTonal24, MaterialButtonTonalIconV2} from "../widgets/MaterialButton";
import {CircularProgress} from "@mui/material";
import {isMobile, MobileView} from "react-device-detect";
import {Link} from "react-router-dom";

function setFullHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Set the height initially
setFullHeight();

// Re-calculate on resize or orientation change
window.addEventListener('resize', setFullHeight);
window.addEventListener('orientationchange', setFullHeight);

function PromptView({prompt, updatePrompts}) {
    const [assistantIsOpened, setAssistantIsOpened] = React.useState(false);
    const [assistantIsOpened2, setAssistantIsOpened2] = React.useState(false);
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
        <div style={isMobile ? {
            height: "calc(var(--vh, 1vh) * 100)",
        } : {}} className={isMobile ? "prompt-cont-mob" : "prompt-cont"}>
            <MobileView>
                <Link to={"/prompts"} className={"back-button-v2"}>
                    <MaterialButtonTonalIconV2><span className={"material-symbols-outlined"}>arrow_back</span></MaterialButtonTonalIconV2>
                </Link>
            </MobileView>
            <div className={"prompt-frame"}>
                <h3 style={isMobile ? {
                    margin: "32px 0",
                    width: "calc(100% - 64px)",
                    whiteSpace: "normal",
                    textAlign: "start",
                } : {
                    margin: "24px",
                }} className={"chat-title"}>{prompt.name}</h3>
                <div className={"prompt-area"}>
                    <MaterialEditText multiline defaultValue={currentPrompt} rows={10} id={"prompt"} label={"Prompt"} onChange={(e) => {
                        setModifiedPrompt(e.target.value);
                    }} />
                    <div className={isMobile ? "prompt-tags-mob" : "prompt-tags"}>
                        <p className={isMobile ? "prompt-tag-mob" : "prompt-tag"}>Prompt by: {prompt.author}</p>
                        <p className={isMobile ? "prompt-tag-mob" : "prompt-tag"}>Category: {prompt.category === "" ? "uncategorized" : prompt.category}</p>
                    </div>
                </div>
                <div className={isMobile ? "prompt-actions-mob" : "prompt-actions"}>
                    <MaterialButton24 onClick={() => {
                        setAssistantIsOpened(true)
                    }} sx={isMobile ? {
                        flexGrow: 1,
                        width: "110px",
                        height: "64px",
                        borderRadius: "16px",
                    } : {
                        width: "110px",
                        height: "64px",
                        borderRadius: "16px",
                    }}><span className={"material-symbols-outlined"}>play_arrow</span>&nbsp;&nbsp;<span>Try it</span></MaterialButton24>

                    {
                        likeRequest ? <MaterialButtonTonal24 sx={isMobile ? {
                                flexGrow: 1,
                                width: "110px",
                                height: "64px",
                                borderRadius: "16px",
                            } : {
                            width: "110px",
                            height: "64px",
                            borderRadius: "16px",
                        }}><CircularProgress sx={{
                            color: "var(--color-accent-800)",
                            }}/></MaterialButtonTonal24> :
                            <MaterialButtonTonal24 sx={isMobile ? {
                                flexGrow: 1,
                                width: "110px",
                                height: "64px",
                                borderRadius: "16px",
                            } : {
                                width: "110px",
                                height: "64px",
                                borderRadius: "16px",
                            }} onClick={() => {
                                setLikeRequest(true);
                                likePrompt();
                            }}><span className={"material-symbols-outlined"}>thumb_up</span>&nbsp;&nbsp;<span>{prompt.likes}</span></MaterialButtonTonal24>
                    }
                </div>
            </div>
            {
                assistantIsOpened ? <div style={isMobile ? {
                    height: "calc(var(--vh, 1vh) * 100)",
                    overflow: "hidden"
                } : {}} className={isMobile ? "assistant-container-mob" : "assistant-container"}>
                    <Assistant runtimePrompt={modifiedPrompt} type={prompt.type.toLowerCase()} closeWindow={setAssistantIsOpened} />
                </div> : null
            }

            {
                assistantIsOpened2 ? <div style={isMobile ? {
                    height: "calc(var(--vh, 1vh) * 100)",
                    overflow: "hidden"
                } : {}} className={isMobile ? "assistant-container-mob" : "assistant-container"}>
                    <Assistant runtimePrompt={""} type={""} closeWindow={setAssistantIsOpened2} />
                </div> : null
            }
        </div>
    );
}

export default PromptView;