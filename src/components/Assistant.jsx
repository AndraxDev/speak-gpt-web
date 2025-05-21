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
import {
    MaterialButtonTonalIconV2, MaterialButtonTonalIconV3
} from "../widgets/MaterialButton";
import Message from "./Message";
import OpenAI from "openai";
import ConfirmChatClear from "./ConfirmChatClear";
import {Alert, CircularProgress, Snackbar} from "@mui/material";
import ChatSettings from "./ChatSettings";
import ApiKeyChangeDialog from "./ApiKeyChangeDialog";
import {
    setGlobalModel,
    setGlobalDalleVersion,
    getGlobalModel,
    getGlobalDalleVersion,
    getGlobalResolution,
    getGlobalSystemMessage,
    setGlobalResolution,
    setGlobalSystemMessage,
    migrateFromLegacyAPIs,
    getApiEndpointById, findOpenAIEndpointIdOrNull, getGlobalEndpointId
} from "../util/Settings";
import SelectResolutionDialog from "./SelectResolutionDialog";
import SelectModelDialog from "./SelectModelDialog";
import SystemMessageEditDialog from "./SystemMessageEditDialog";
import {isMobile} from 'react-device-detect';
import {supportedFileTypes} from "../util/ModelTypeConverter";

const getDefaultDescription = () => {
    return (`
        What can this assistant do:<br/><br/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;Answer your question<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;Generate code<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;Solve math problems<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;Translate text<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;Generate images and artworks<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;Process png/jpg images
    `);
}

function setFullHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

let activeControllers = [];

// Set the height initially
setFullHeight();

// Re-calculate on resize or orientation change
window.addEventListener('resize', setFullHeight);
window.addEventListener('orientationchange', setFullHeight);

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
    const [errorSnackBar, setErrorSnackBar] = React.useState(false);
    const [errorSnackBarMessage, setErrorSnackBarMessage] = React.useState("");

    useEffect(() => {
        setGlobalModel(currentModel)
        setGlobalDalleVersion(useDalle3 ? "3" : "2")
        setGlobalResolution(currentImageResolution)
        setGlobalSystemMessage(systemMessage)
    }, [currentModel, useDalle3, currentImageResolution, systemMessage]);

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
            const response = await fetch("https://assistant.teslasoft.org/api/v1/images?u=" + urlEncoded);

            if (!response.ok) {
                setErrorSnackBarMessage("Failed fetch image from the server.");
                setErrorSnackBar(true);
                return
            }

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
            migrateFromLegacyAPIs();
            let endpointId = findOpenAIEndpointIdOrNull()
            if (endpointId !== null) {
                const openai = new OpenAI({
                    apiKey: getApiEndpointById(endpointId).key,
                    dangerouslyAllowBrowser: true,
                    baseURL: getApiEndpointById(endpointId).url
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
            } else {
                let c = conversation;
                c.push({
                    message: "This feature uses OpenAI API. Please add OpenAI endpoint in chat settings.",
                    isBot: true
                });

                setConversation(c)
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

    const sendAIRequest = async (messages) => {
        try {
            migrateFromLegacyAPIs()
            let openai = new OpenAI({
                apiKey: getApiEndpointById(getGlobalEndpointId()).key,
                dangerouslyAllowBrowser: true,
                baseURL: getApiEndpointById(getGlobalEndpointId()).url
            });

            if (selectedFile !== null) {
                if (findOpenAIEndpointIdOrNull() !== null) {
                    openai = new OpenAI({
                        apiKey: getApiEndpointById(findOpenAIEndpointIdOrNull()).key,
                        dangerouslyAllowBrowser: true,
                        baseURL: getApiEndpointById(findOpenAIEndpointIdOrNull()).url
                    });
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

                    const controller = new AbortController();
                    const { signal } = controller;

                    activeControllers.push(controller);

                    const chatCompletion = await openai.chat.completions.create({
                        messages: ms,
                        model: "gpt-4o",
                        stream: true,
                    }, {
                        signal: signal
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
                } else {
                    let c = conversation;
                    c.push({
                        message: "This feature uses OpenAI API. Please add OpenAI endpoint in chat settings.",
                        isBot: true
                    });

                    setConversation([...c])
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

                const controller = new AbortController();
                const { signal } = controller;

                activeControllers.push(controller);

                const chatCompletion = await openai.chat.completions.create({
                    messages: ms,
                    model: getGlobalModel(),
                    stream: true,
                }, {
                    signal: signal
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

    const cancelRequest = () => {
        activeControllers.forEach(controller => controller.abort());
        activeControllers = []; // clear the list after aborting
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
        if (mx.toString().trim().startsWith("/imagine ")) {
            generateImage(mx.replace("/imagine ", "")).then(r => {
                setLockedState(false);

                if (!getAndroidOS() && !isMobile) {
                    document.querySelector(".chat-textarea").focus();
                }
            })
        } else {
            sendAIRequest(prepareConversation(messages)).then(r => {
                setLockedState(false);
                if (!getAndroidOS() && !isMobile) {
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
        try {
            const reader = new FileReader();
            reader.onload = (e) => {
                let srcData = e.target.result;
                let fileType = file.type;

                if (supportedFileTypes.includes(fileType)) {
                    if (!getAndroidOS() && !isMobile) {
                        document.querySelector(".chat-textarea").focus();
                    }
                    setSelectedFile(srcData);
                } else {
                    setErrorSnackBarMessage("Unsupported file type. Supported images format: jpg, png, gif, webp");
                    setErrorSnackBar(true);
                }
            }

            reader.readAsDataURL(file);
        } catch (e) {
            console.error("Error processing file: " + e)
            setErrorSnackBarMessage("Failed to read file.");
            setErrorSnackBar(true);
        }
    }

    function preventDefaults (e) {
        e.preventDefault();
    }

    function highlight(e, e2) {
        e.classList.add('highlight-a');
        e2.classList.add('highlight2-a');
        e2.classList.add('unhighlighted')
    }

    function unhighlight(e, e2) {
        e.classList.remove('highlight-a');
        e2.classList.remove('highlight2-a');
        e2.classList.remove('unhighlighted')
    }

    function handleDrop(e) {
        let dt = e.dataTransfer;
        let files = dt.files;

        handleFiles(files);
    }

    function handleFiles(files) {
        processFile(files[0])
    }

    useEffect(() => {
        let dropArea = document.getElementById('drop-area');
        let dropArea2 = document.getElementById('drop-area-2');

        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, preventDefaults, false);
        });

        // Highlight drop area when item is dragged over it
        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, () => {highlight(dropArea, dropArea2)}, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropArea2.addEventListener(eventName, () => {unhighlight(dropArea, dropArea2)}, false);
        });

        dropArea.addEventListener('drop', handleDrop, false);

        /* Temporarily removed due to a bug */
        /* Update: Moved to experiment */
        if (localStorage.getItem("experiment-2502") === "true") {
            document.querySelector(".chat-textarea").addEventListener('paste', function (e) {
                e.preventDefault();
                const items = (e.clipboardData || window.clipboardData).items;
                let containsImage = false;
                for (const item of items) {
                    if (item.type.indexOf("image") === 0) {
                        const blob = item.getAsFile();
                        document.querySelector(".chat-textarea").value = ''
                        document.querySelector(".chat-textarea").innerHTML = ''
                        processFile(blob);
                        containsImage = true;
                    } else if (item.kind === 'string' && !containsImage) {
                        // Handle non-image content like plain text
                        item.getAsString(function (s) {
                            document.execCommand('insertHTML', false, s);
                        });
                    }
                }

                if (containsImage) {
                    document.querySelector(".chat-textarea").value = ''
                    document.querySelector(".chat-textarea").innerHTML = ''
                }
            });
        }
    }, [])

    useEffect(() => {
        if (!getAndroidOS() && !isMobile) {
            document.querySelector(".chat-textarea").focus();
        }
    }, [])

    function autoresize(textarea) {
        // Initial setup
        const singleLineHeight = 16;  // This should match line-height in your CSS
        const maxLines = 30;
        const minHeight = 16;

        // Ensure that we calculate based on a minimal state
        textarea.style.height = 'auto';  // Temporarily make height auto

        const lines = textarea.value.split('\n').length;

        // Check if the current content is less than the minimum height
        if (lines === 0) {
            textarea.style.height = `${minHeight}px`;
        } else if (lines < maxLines) {
            textarea.style.height = `${minHeight*lines}px`;
        } else if (lines > maxLines) {
            textarea.style.overflowY = 'auto';  // Enable scrolling when content exceeds max height
            textarea.style.height = `${singleLineHeight*maxLines}px`;
        } else {
            textarea.style.overflowY = 'hidden';  // Hide scrollbar when content is below max height
            textarea.style.height = `${singleLineHeight*lines}px`;
        }
    }

    return (
        <div className={"chat-frame"}>
            <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'center'}} open={errorSnackBar} autoHideDuration={6000} onClose={() => {
                setErrorSnackBar(false);
            }}>
                <Alert
                    onClose={() => {
                        setErrorSnackBar(false);
                    }}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {errorSnackBarMessage}
                </Alert>
            </Snackbar>
            {
                clearDialogOpen ? <ConfirmChatClear setOpenState={setClearDialogOpen} confirm={setConfirmClear} isAssistant={true}/> : null
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
                    isAssistant={true}
                /> : null
            }
            {
                openAIKeyChangeDialogIsOpened ? <ApiKeyChangeDialog setIsOpen={setOpenAIKeyChangeDialogIsOpened} isAssistant={true} /> : null
            }
            {
                resolutionDialogOpened ? <SelectResolutionDialog setResolution={setCurrentImageResolution} resolution={currentImageResolution} setIsOpen={setResolutionDialogOpened} isAssistant={true} /> : null
            }
            {
                modelDialogOpened ? <SelectModelDialog setModel={setCurrentModel} model={currentModel} setIsOpen={setModelDialogOpened} isAssistant={true} chatId={""} /> : null
            }
            {
                systemMessageDialogOpened ? <SystemMessageEditDialog message={systemMessage} setIsOpen={setSystemMessageDialogOpened} setMessage={setSystemMessageX} isAssistant={true} /> : null
            }
            <div className={"chat-area-assistant"}>
                <div className={"chat-history-assistant"} style={isMobile ? {
                    height: "calc(calc(var(--vh, 1vh) * 100) - 158px)"
                } : {}} id={"drop-area"}>
                    <div className={"unhiglighted drop-frame"} id={"drop-area-2"}>
                        <span style={{
                            fontSize: "120px"
                        }} className={"placeholder-icon material-symbols-outlined"}>photo</span>
                        <p className={"placeholder-text"}>Drag your images here to use it with SpeakGPT.</p>
                    </div>
                    <div className={"chat-ab-actions-container-assistant"}>
                        <div className={"chat-ab-actions-assistant"}>
                            <MaterialButtonTonalIconV2 onClick={() => {
                                closeWindow(false);
                            }}><span className={"material-symbols-outlined"}>cancel</span></MaterialButtonTonalIconV2>
                            &nbsp;&nbsp;&nbsp;
                            <h3 className={"chat-title"}>SpeakGPT Quick Assistant</h3>
                            &nbsp;&nbsp;&nbsp;
                            <MaterialButtonTonalIconV2 onClick={() => {
                                setSettingsOpen(true);
                            }}><span className={"material-symbols-outlined"}>settings</span></MaterialButtonTonalIconV2>
                        </div>
                    </div>
                    <div style={{
                        height: '16px'
                    }}/>
                    <div>
                        {
                            conversation.length !== 0 ? conversation.map((e, i) => {
                                return (
                                    <Message key={i} isBot={e.isBot} message={e.message}
                                             image={e.image === null || e.image === undefined ? null : e.image} isAssistant={true}/>
                                )
                            }) : <div className={"empty-assistant"}>
                                <img className={"empty-assistant-icon"} src={"/logo512.png"} alt={"SpeakGPT"}/>
                                <div>
                                    <p className={"empty-assistant-description"} dangerouslySetInnerHTML={{__html: getDefaultDescription()}}></p>
                                </div>
                                <br/>
                                <p className={"empty-assistant-disclaimer"}>Generative AI is experimental. Sometimes
                                    assistant may produce inaccurate or irrelevant results.</p>
                            </div>
                        }
                    </div>
                    <div id={"bottom"}></div>
                </div>
                {
                    selectedFile !== null && !lockedState ? <div className={"selected-image-frame-assistant"}>
                        <img className={"selected-image"} src={selectedFile} alt={"Selected file"} style={{
                            width: "100%"
                        }}/>
                        <div className={"discard-image"} onClick={() => {
                            setSelectedFile(null);
                        }}><span className={"material-symbols-outlined"}>cancel</span></div>
                    </div>: null
                }
                <div className={"write-bar-container-home"}>
                    <div className={"write-bar-assistant"}>
                        <textarea onInput={() => {
                            autoresize(document.querySelector(".chat-textarea"))
                        }} onKeyDown={handleKeyDown} className={"chat-textarea"} id={"assistant-textarea"} placeholder={"Start typing here..."}/>
                        <div>
                            <MaterialButtonTonalIconV3 className={"chat-send"}><span className={"material-symbols-outlined"}>photo</span><input className={"visually-hidden-input"} onChange={(e) => {
                                if (e.target.files.length !== 0) {
                                    processFile(e.target.files[0])
                                }
                            }} type="file" /></MaterialButtonTonalIconV3>
                        </div>
                        &nbsp;&nbsp;&nbsp;
                        <div>
                            {
                                lockedState ? <MaterialButtonTonalIconV3 className={"chat-send"} onClick={() => {
                                        cancelRequest();
                                    }}><CircularProgress style={{
                                        color: "var(--color-accent-900)",
                                    }}/><img src={"/cancel.svg"} className={"cancel-cross"}/></MaterialButtonTonalIconV3>
                                    :
                                    <MaterialButtonTonalIconV3 className={"chat-send"} onClick={() => {
                                        processRequest();
                                    }}><span
                                        className={"material-symbols-outlined"}>send</span></MaterialButtonTonalIconV3>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Assistant;