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
import {
    MaterialButtonError,
    MaterialButtonTonal24, MaterialButtonTonalIcon
} from "../widgets/MaterialButton";
import Message from "./Message";
import OpenAI from "openai";
import ConfirmChatClear from "./ConfirmChatClear";
import {CircularProgress} from "@mui/material";
import ChatSettings from "./ChatSettings";
import ApiKeyChangeDialog from "./ApiKeyChangeDialog";
import {
    setGlobalModel,
    setGlobalDalleVersion,
    getGlobalModel,
    getGlobalDalleVersion,
    getGlobalResolution,
    getGlobalSystemMessage, setGlobalResolution, setGlobalSystemMessage
} from "../util/Settings";
import SelectResolutionDialog from "./SelectResolutionDialog";
import SelectModelDialog from "./SelectModelDialog";
import SystemMessageEditDialog from "./SystemMessageEditDialog";
import {isMobile} from 'react-device-detect';

function Assistant({runtimePrompt, type, closeWindow}) {
    const [conversation, setConversation] = React.useState([]);
    const [lockedState, setLockedState] = React.useState(false);
    const [modelDialogOpened, setModelDialogOpened] = React.useState(false);
    const [currentModel, setCurrentModel] = React.useState(getGlobalModel());
    const [useDalle3, setUseDalle3] = React.useState(getGlobalDalleVersion() === "3");
    const [currentImageResolution, setCurrentImageResolution] = React.useState(getGlobalResolution());
    const [resolutionDialogOpened, setResolutionDialogOpened] = React.useState(false);
    const [systemMessage, setSystemMessageX] = React.useState(getGlobalSystemMessage());
    const [systemMessageDialogOpened, setSystemMessageDialogOpened] = React.useState(false);
    const [openAIKeyChangeDialogIsOpened, setOpenAIKeyChangeDialogIsOpened] = React.useState(false);
    const [settingsOpen, setSettingsOpen] = React.useState(false);
    const [clearDialogOpen, setClearDialogOpen] = React.useState(false);
    const [confirmClear, setConfirmClear] = React.useState(false);
    const [selectedFile, setSelectedFile] = React.useState(null);

    useEffect(() => {
        setGlobalModel(currentModel)
        setGlobalDalleVersion(useDalle3 ? "3" : "2")
        setGlobalResolution(currentImageResolution)
        setGlobalSystemMessage(systemMessage)
    }, [useDalle3, currentImageResolution, systemMessage]);

    const getAndroidOS = () => {
        return navigator.userAgent.indexOf("Android") > -1 || navigator.userAgent.indexOf("Linux x86_64") > -1;
    }

    const handleKeyDown = (event) => {
        let isMsAndroid = getAndroidOS()

        // Check if Enter key is pressed without Shift key
        if (event.key === 'Enter' && !event.shiftKey && !isMobile && !isMsAndroid) {
            // Prevent default action to avoid adding a new line
            event.preventDefault();

            // Perform your action here (e.g., submit the text)
            processRequest()
        }
        // Optional: handle other key events or conditions, if necessary
    };

    useEffect(() => {
        console.log("Runtime prompt: " + runtimePrompt)
        if (runtimePrompt !== "" && runtimePrompt !== undefined) {
            document.querySelector(".chat-textarea").value = runtimePrompt;

            if (type === "dall-e") {
                document.querySelector(".chat-textarea").value = "/imagine " + runtimePrompt
            }

            processRequest();
        }
    }, [runtimePrompt, type]);

    useEffect(() => {
        if (confirmClear) {
            clearConversation();
            setConfirmClear(false);
            setClearDialogOpen(false);
        }
    }, [confirmClear])

    useEffect(() => {
        document.getElementById("bottom").scrollIntoView();
    }, [conversation])

    const prepareConversation = (messages) => {
        const msgs = [];

        messages.forEach((e) => {
            if (!e.message.toString().includes("~file:")) {
                msgs.push({
                    content: e.message,
                    role: e.isBot ? "assistant" : "user"
                });
            }
        });

        return msgs;
    }

    async function convertImageToBase64(url) {
        try {
            let urlEncoded = btoa(url);
            const response = await fetch("https://gpt.teslasoft.org/api/v1/images?u=" + urlEncoded);

            if (!response.ok) throw new Error('Network response was not ok.');

            // Step 2: Convert it to a Blob
            const blob = await response.blob();

            return new Promise((resolve, reject) => {
                // Step 3: Use FileReader to read the Blob as a base64 string
                const reader = new FileReader();
                reader.onloadend = () => {
                    // This will be a URL starting with `data:image/png;base64,`
                    resolve(reader.result.replace("data:image/png;base64,", ""));
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error('Error converting image to Base64:', error);
            return null;
        }
    }

    const generateImage = async (prompt) => {
        console.log("Generating image")

        try {
            const openai = new OpenAI({
                apiKey: localStorage.getItem("apiKey"),
                dangerouslyAllowBrowser: true
            });

            const response = await openai.images.generate({
                model: "dall-e-" + getGlobalDalleVersion(),
                prompt: prompt,
                n: 1,
                size: getGlobalResolution(),
            });
            let image = response.data[0].url;

            console.log(image)

            let image1 = await convertImageToBase64(image);

            let c = conversation;
            c.push({
                message: "~file:" + image1,
                isBot: true
            });

            setConversation(c)

        } catch (e) {
            setSelectedFile(null)
            if (e.message.includes("401 Incorrect API key")) {
                let c = conversation;
                c.push({
                    message: "This feature requires a valid API key. API key is invalid or is not set. Please set it in chat settings.",
                    isBot: true
                });

                setConversation(c)
            } else {
                let c = conversation;
                c.push({
                    message: "An error occurred while performing request. Please check your connection and try again later.",
                    isBot: true
                });

                setConversation(c)
            }
        }
    }

    const sendAIRequest = async (messages) => {
        try {
            const openai = new OpenAI({
                apiKey: localStorage.getItem("apiKey"),
                dangerouslyAllowBrowser: true
            });

            if (selectedFile !== null) {
                let ms = messages;

                let prompt = ms[ms.length - 1].content;

                ms[ms.length - 1].content = [
                    {type: "text", text: prompt},
                    {
                        type: "image_url",
                        image_url: {
                            "url": selectedFile,
                        }
                    }
                ]

                const chatCompletion = await openai.chat.completions.create({
                    messages: ms,
                    model: "gpt-4-vision-preview",
                    stream: true,
                });

                const m = conversation;

                m.push({
                    message: "",
                    isBot: true
                });

                setConversation([...m]);

                for await (const chunk of chatCompletion) {
                    const r = chunk.choices[0].delta;

                    const m = conversation;

                    if (chunk.choices[0] !== undefined && chunk.choices[0].delta !== undefined && r !== undefined && chunk.choices[0].delta.content !== undefined) {
                        m[m.length - 1].message += r.content;

                        setConversation([...m]);
                    }
                }

                return "";
            } else {
                let ms = messages;

                if (getGlobalSystemMessage() !== "") {
                    ms.push({
                        content: getGlobalSystemMessage(),
                        role: "system"
                    });
                }

                const chatCompletion = await openai.chat.completions.create({
                    messages: ms,
                    model: getGlobalModel(),
                    stream: true,
                });

                const m = conversation;

                m.push({
                    message: "",
                    isBot: true
                });

                setConversation([...m]);

                for await (const chunk of chatCompletion) {
                    const r = chunk.choices[0].delta;

                    const m = conversation;

                    if (chunk.choices[0] !== undefined && chunk.choices[0].delta !== undefined && r !== undefined && chunk.choices[0].delta.content !== undefined) {
                        m[m.length - 1].message += r.content;

                        setConversation([...m]);
                    }
                }

                return "";
            }
        } catch (e) {
            setSelectedFile(null)
            if (e.message.includes("401 Incorrect API key")) {
                let c = conversation;
                c.push({
                    message: "This feature requires a valid API key. API key is invalid or is not set. Please set it in chat settings.",
                    isBot: true
                });

                setConversation(c)
            } else {
                let c = conversation;
                c.push({
                    message: "An error occurred while performing request. Please check your connection and try again later.",
                    isBot: true
                });

                setConversation(c)
            }
        }
    }

    const processRequest = () => {
        console.debug("Processing AI request");
        if (lockedState) {
            return;
        }

        const messages = conversation;

        setLockedState(true);
        messages.push({
            message: document.querySelector(".chat-textarea").value,
            isBot: false,
            image: selectedFile
        });

        setConversation([...messages]);

        let mx = document.querySelector(".chat-textarea").value
        if (mx.includes("/imagine ")) {
            generateImage(mx.replace("/imagine ", "")).then(r => {
                setLockedState(false);

                if (!getAndroidOS()) {
                    document.querySelector(".chat-textarea").focus();
                }
            })
        } else {
            sendAIRequest(prepareConversation(messages)).then(r => {
                setLockedState(false);
                if (!getAndroidOS()) {
                    document.querySelector(".chat-textarea").focus();
                }
                setSelectedFile(null)
            });
        }

        document.querySelector(".chat-textarea").value = "";
    }

    const clearConversation = () => {
        setConversation([]);
    }

    const processFile = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            let srcData = e.target.result;
            let fileType = file.type;

            if (fileType.startsWith("image")) {
                setSelectedFile(srcData);
            }
        }

        reader.readAsDataURL(file);
    }

    return (
        <div className={"chat-frame"}>
            {
                clearDialogOpen ? <ConfirmChatClear setOpenState={setClearDialogOpen} confirm={setConfirmClear}/> : null
            }
            {
                settingsOpen ? <ChatSettings
                    chatId={null}
                    setIsOpen={setSettingsOpen}
                    apiDialogOpen={setOpenAIKeyChangeDialogIsOpened}
                    setDalleVersion={setUseDalle3}
                    dalle3={useDalle3}
                    model={currentModel}
                    openModelDialog={setModelDialogOpened}
                    resolution={currentImageResolution}
                    openResolutionDialog={setResolutionDialogOpened}
                    systemMessage={systemMessage}
                    openSystemMessageDialog={setSystemMessageDialogOpened}
                /> : null
            }
            {
                openAIKeyChangeDialogIsOpened ? <ApiKeyChangeDialog setIsOpen={setOpenAIKeyChangeDialogIsOpened} /> : null
            }
            {
                resolutionDialogOpened ? <SelectResolutionDialog setResolution={setCurrentImageResolution} resolution={currentImageResolution} setIsOpen={setResolutionDialogOpened} /> : null
            }
            {
                modelDialogOpened ? <SelectModelDialog setModel={setCurrentModel} model={currentModel} setIsOpen={setModelDialogOpened} /> : null
            }
            {
                systemMessageDialogOpened ? <SystemMessageEditDialog message={systemMessage} setIsOpen={setSystemMessageDialogOpened} setMessage={setSystemMessageX} /> : null
            }
            <div className={"chat-area-assistant"}>
                <div className={"chat-history-assistant"}>
                    <div className={"chat-ab-actions-container-assistant"}>
                        <div className={"chat-ab-actions-assistant"}>
                            <MaterialButtonError onClick={() => {
                                closeWindow(false);
                            }}><span className={"material-symbols-outlined"}>cancel</span></MaterialButtonError>
                            &nbsp;&nbsp;&nbsp;
                            <h3 className={"chat-title"}>{"SpeakGPT Quick Assistant"}</h3>
                            &nbsp;&nbsp;&nbsp;
                            <MaterialButtonTonal24 onClick={() => {
                                setSettingsOpen(true);
                            }}><span className={"material-symbols-outlined"}>settings</span></MaterialButtonTonal24>
                        </div>
                    </div>
                    <div style={{
                        height: '120px'
                    }}/>
                    <div>
                        {
                            conversation.map((e, i) => {
                                return (
                                    <Message key={i} isBot={e.isBot} message={e.message} image={e.image === null || e.image === undefined ? null : e.image}/>
                                )
                            })
                        }
                    </div>
                    <div id={"bottom"}></div>
                </div>
                {
                    selectedFile !== null && !lockedState ? <div className={"selected-image-frame"}>
                        <img className={"selected-image"} src={selectedFile} alt={"Selected file"} style={{
                            width: "100%"
                        }}/>
                        <div className={"discard-image"} onClick={() => {
                            setSelectedFile(null);
                        }}><span className={"material-symbols-outlined"}>cancel</span></div>
                    </div>: null
                }
                <div className={"write-bar-assistant"}>
                    <textarea onKeyDown={handleKeyDown} className={"chat-textarea"} id={"assistant-textarea"} placeholder={"Start typing here..."}/>
                    <div>
                        <MaterialButtonTonalIcon className={"chat-send"}><span className={"material-symbols-outlined"}>photo</span><input className={"visually-hidden-input"} onChange={(e) => {
                            if (e.target.files.length !== 0) {
                                processFile(e.target.files[0])
                            }
                        }} type="file" /></MaterialButtonTonalIcon>
                    </div>
                    &nbsp;&nbsp;&nbsp;
                    <div>
                        {
                            lockedState ? <MaterialButtonTonalIcon className={"chat-send"} onClick={() => {
                                    processRequest();
                                }}><CircularProgress style={{
                                    color: "var(--color-accent-900)",
                                }}/></MaterialButtonTonalIcon>
                                :
                                <MaterialButtonTonalIcon className={"chat-send"} onClick={() => {
                                    processRequest();
                                }}><span
                                    className={"material-symbols-outlined"}>send</span></MaterialButtonTonalIcon>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Assistant;