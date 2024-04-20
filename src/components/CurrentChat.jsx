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
    MaterialButtonError, MaterialButtonTonal24Icon, MaterialButtonTonalIcon, MaterialButtonTonalIconV2
} from "../widgets/MaterialButton";
import Message from "./Message";
import OpenAI from "openai";
import {sha256} from "js-sha256";
import ConfirmChatClear from "./ConfirmChatClear";
import {Alert, CircularProgress, Snackbar} from "@mui/material";
import ChatSettings from "./ChatSettings";
import ApiKeyChangeDialog from "./ApiKeyChangeDialog";
import {getModel, setModel, getSystemMessage, setSystemMessage, getDalleVersion, setDalleVersion, getResolution, setResolution} from "../util/Settings";
import SelectResolutionDialog from "./SelectResolutionDialog";
import SelectModelDialog from "./SelectModelDialog";
import {modelToType, supportedFileTypes} from "../util/ModelTypeConverter";
import SystemMessageEditDialog from "./SystemMessageEditDialog";
import {isMobile, MobileView} from 'react-device-detect';
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

function CurrentChat({chats, id, chatName, updateChats}) {
    const [conversation, setConversation] = React.useState([]);
    const [lockedState, setLockedState] = React.useState(false);
    const [stateSelectedChat, setStateSelectedChat] = React.useState(chatName);
    const [db, setDb] = React.useState(null);
    const [currentModel, setCurrentModel] = React.useState(getModel(id));
    const [modelDialogOpened, setModelDialogOpened] = React.useState(false);
    const [useDalle3, setUseDalle3] = React.useState(getDalleVersion(id) === "3");
    const [currentImageResolution, setCurrentImageResolution] = React.useState(getResolution(id));
    const [resolutionDialogOpened, setResolutionDialogOpened] = React.useState(false);
    const [systemMessage, setSystemMessageX] = React.useState(getSystemMessage(id));
    const [systemMessageDialogOpened, setSystemMessageDialogOpened] = React.useState(false);
    // const [slashCommands, setSlashCommands] = React.useState(true);
    const [openAIKeyChangeDialogIsOpened, setOpenAIKeyChangeDialogIsOpened] = React.useState(false);
    const [settingsOpen, setSettingsOpen] = React.useState(false);
    const [clearDialogOpen, setClearDialogOpen] = React.useState(false);
    const [confirmClear, setConfirmClear] = React.useState(false);
    const [selectedFile, setSelectedFile] = React.useState(null);
    const [errorSnackBar, setErrorSnackBar] = React.useState(false);
    const [errorSnackBarMessage, setErrorSnackBarMessage] = React.useState("");

    useEffect(() => {
        let c = [];

        chats.forEach((e) => {
            if (sha256(e.title) === id) {
                c.push({
                    title: e.title,
                    model: currentModel,
                    type: modelToType(currentModel)
                })
            } else {
                c.push(e);
            }
        })

        updateChats(c);
    }, [currentModel, modelDialogOpened])

    // Load settings
    useEffect(() => {
        setCurrentModel(getModel(id))
        setCurrentImageResolution(getResolution(id))
        setUseDalle3(getDalleVersion(id) === "3")
        setSystemMessageX(getSystemMessage(id))
    }, [id]);
    
    useEffect(() => {
        setModel(id, currentModel)
        setDalleVersion(id, useDalle3 ? "3" : "2")
        setResolution(id, currentImageResolution)
        setSystemMessage(id, systemMessage)
    }, [currentModel, useDalle3, currentImageResolution, systemMessage, id]);

    const getAndroidOS = () => {
        return navigator.userAgent.indexOf("Android") > -1 || navigator.userAgent.indexOf("Linux x86_64") > -1;
    }

    const handleKeyDown = (event) => {
        let isMsAndroid = getAndroidOS()

        if (event.key === 'Enter' && !event.shiftKey && !isMobile && !isMsAndroid) {
            event.preventDefault();
            processRequest()
        }
    };

    useEffect(() => {
        getDatabase()
    }, []);

    useEffect(() => {
        if (confirmClear) {
            clearConversation();
            setConfirmClear(false);
            setClearDialogOpen(false);
        }
    }, [confirmClear])

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
    }, [chats, id, chatName]);

    useEffect(() => {
        if (stateSelectedChat === "") {
            setConversation([]);
            return;
        }

        if (db !== undefined && db !== null) {
            getConversation(sha256(stateSelectedChat));
        }
    }, [db, stateSelectedChat]);

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
            const openai = new OpenAI({
                apiKey: localStorage.getItem("apiKey"),
                dangerouslyAllowBrowser: true
            });

            const response = await openai.images.generate({
                model: "dall-e-" + getDalleVersion(id),
                prompt: prompt,
                n: 1,
                size: getResolution(id),
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

            saveConversation(sha256(stateSelectedChat), JSON.stringify(c));
        } catch (e) {
            setSelectedFile(null)
            if (e.message.includes("401 Incorrect API key")) {
                let c = conversation;
                c.push({
                    message: "This feature requires a valid API key. API key is invalid or is not set. Please set it in chat settings.",
                    isBot: true
                });

                setConversation(c)

                saveConversation(sha256(stateSelectedChat), JSON.stringify(c));
            } else {
                let c = conversation;
                c.push({
                    message: "An error occurred while performing request. Please check your connection and try again later.",
                    isBot: true
                });

                setConversation(c)

                saveConversation(sha256(stateSelectedChat), JSON.stringify(c));
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

                // setSelectedFile(null)

                setConversation([...m]);
                saveConversation(sha256(stateSelectedChat), JSON.stringify(m));

                for await (const chunk of chatCompletion) {
                    const r = chunk.choices[0].delta;

                    const m = conversation;

                    if (chunk.choices[0] !== undefined && chunk.choices[0].delta !== undefined && r !== undefined && chunk.choices[0].delta.content !== undefined) {
                        m[m.length - 1].message += r.content;

                        setConversation([...m]);
                    }
                }

                saveConversation(sha256(stateSelectedChat), JSON.stringify(m));

                return "";
            } else {
                let ms = messages;

                if (getSystemMessage(id) !== "") {
                    ms.push({
                        content: getSystemMessage(id),
                        role: "system"
                    });
                }

                const chatCompletion = await openai.chat.completions.create({
                    messages: ms,
                    model: getModel(id),
                    stream: true,
                });

                const m = conversation;

                m.push({
                    message: "",
                    isBot: true
                });

                setConversation([...m]);
                saveConversation(sha256(stateSelectedChat), JSON.stringify(m));

                for await (const chunk of chatCompletion) {
                    const r = chunk.choices[0].delta;

                    const m = conversation;

                    if (chunk.choices[0] !== undefined && chunk.choices[0].delta !== undefined && r !== undefined && chunk.choices[0].delta.content !== undefined) {
                        m[m.length - 1].message += r.content;

                        setConversation([...m]);
                    }
                }

                saveConversation(sha256(stateSelectedChat), JSON.stringify(m));

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

                saveConversation(sha256(stateSelectedChat), JSON.stringify(c));
            } else {
                let c = conversation;
                c.push({
                    message: "An error occurred while performing request. Please check your connection and try again later.",
                    isBot: true
                });

                setConversation(c)

                saveConversation(sha256(stateSelectedChat), JSON.stringify(c));
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
        saveConversation(sha256(stateSelectedChat), JSON.stringify(messages));

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
                setSelectedFile(null);
            });
        }

        document.querySelector(".chat-textarea").value = "";
    }

    const getDatabase = () => {
        let db;

        const request = indexedDB.open("chats", 1);

        request.onupgradeneeded = function(event) {
            // Save the IDBDatabase interface
            db = event.target.result;

            // Create an objectStore for this database
            if (!db.objectStoreNames.contains('chats')) {
                db.createObjectStore('chats', { keyPath: 'chatId'});
            }
        };

        request.onsuccess = function(event) {
            db = event.target.result;
            setDb(db)
            console.log("Database opened successfully");
        };

        request.onerror = function(event) {
            console.log("Error opening database", event.target.errorCode);
        };
    }

    const getConversation = (chatId) => {
        const transaction = db.transaction(['chats'], 'readonly');
        const objectStore = transaction.objectStore('chats');
        const request = objectStore.getAll();

        request.onsuccess = function() {
            let isFound = false;

            request.result.forEach((e) => {
                if (e.chatId === chatId) {
                    isFound = true;
                    setConversation(JSON.parse(e.content));
                }
            });

            if (!isFound) {
                setConversation([]);
            }
        };

        request.onerror = function(event) {
            console.log("Error getting conversation", event.target.errorCode);
        }
    }

    const saveConversation = (chatId, conversation) => {
        const transaction = db.transaction(['chats'], 'readwrite');
        const objectStore = transaction.objectStore('chats');
        const request = objectStore.put({ chatId: chatId, content: conversation });

        request.onsuccess = function() {
            console.log("Conversation saved successfully");
        };

        request.onerror = function(event) {
            console.log("Error saving conversation", event);
        }
    }

    const clearConversation = () => {
        setConversation([]);
        saveConversation(sha256(stateSelectedChat), JSON.stringify([]));
    }

    const processFile = (file) => {
        try {
            const reader = new FileReader();
            reader.onload = (e) => {
                let srcData = e.target.result;
                let fileType = file.type;

                if (supportedFileTypes.includes(fileType)) {
                    document.querySelector(".chat-textarea").focus();
                    setSelectedFile(srcData);
                } else {
                    setErrorSnackBarMessage("Unsupported file type. Supported images format: jpg, png, gif, webp");
                    setErrorSnackBar(true);
                }
            }

            reader.readAsDataURL(file);
        } catch (e) {
            console.error("Error processing file", e);
            setErrorSnackBarMessage("Failed to read file.");
            setErrorSnackBar(true);
        }
    }

    function autoresize(textarea) {
        // Initial setup
        const singleLineHeight = 16;  // This should match line-height in your CSS
        const maxLines = 4;
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

    function preventDefaults (e) {
        e.preventDefault();
    }

    function highlight(e, e2) {
        e.classList.add('highlight');
        e2.classList.add('highlight2');
        e2.classList.add('unhighlighted')
    }

    function unhighlight(e, e2) {
        e.classList.remove('highlight');
        e2.classList.remove('highlight2');
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

        /* Temporarily removed due to issues with pasting images
        document.querySelector(".chat-textarea").addEventListener('paste', function(e) {
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
                    item.getAsString(function(s) {
                        document.execCommand('insertHTML', false, s);
                    });
                }
            }

            if (containsImage) {
                document.querySelector(".chat-textarea").value = ''
                document.querySelector(".chat-textarea").innerHTML = ''
            }
        });
        */
    }, [])

    return (
        <div style={isMobile ? {
            height: "calc(var(--vh, 1vh) * 100)"
        } : {}} className={isMobile ? "chat-fixed chat-frame-mob" : "chat-frame"}>
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
            <MobileView>
                <Link to={"/chat"} className={"back-button"}>
                    <MaterialButtonTonalIconV2><span className={"material-symbols-outlined"}>arrow_back</span></MaterialButtonTonalIconV2>
                </Link>
            </MobileView>
            {
                clearDialogOpen ? <ConfirmChatClear setOpenState={setClearDialogOpen} confirm={setConfirmClear} isAssistant={false}/> : null
            }
            {
                settingsOpen ? <ChatSettings
                    chatId={stateSelectedChat}
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
                    isAssistant={false}
                /> : null
            }
            {
                openAIKeyChangeDialogIsOpened ? <ApiKeyChangeDialog setIsOpen={setOpenAIKeyChangeDialogIsOpened} isAssistant={false} /> : null
            }
            {
                resolutionDialogOpened ? <SelectResolutionDialog setResolution={setCurrentImageResolution} resolution={currentImageResolution} setIsOpen={setResolutionDialogOpened} isAssistant={false} /> : null
            }
            {
                modelDialogOpened ? <SelectModelDialog setModel={setCurrentModel} model={currentModel} setIsOpen={setModelDialogOpened} isAssistant={false} /> : null
            }
            {
                systemMessageDialogOpened ? <SystemMessageEditDialog message={systemMessage} setIsOpen={setSystemMessageDialogOpened} setMessage={setSystemMessageX} isAssistant={false} /> : null
            }
            <div className={isMobile ? "" : "chat-area"}>
                <div style={isMobile ? {
                    height: "calc(calc(var(--vh, 1vh) * 100) - 90px)"
                } : {}} className={isMobile ? "chat-history-mob" : "chat-history"} id={"drop-area"}>
                    <div className={isMobile ? "unhiglighted drop-frame-mob" : "unhiglighted drop-frame"} id={"drop-area-2"}>
                        <span className={"placeholder-icon material-symbols-outlined"}>photo</span>
                        <p className={"placeholder-text"}>Drag your images here to use it with SpeakGPT.</p>
                    </div>
                    <div className={isMobile ? "chat-ab-actions-container-mob" : "chat-ab-actions-container"}>
                        <div style={isMobile ? {
                            width: "calc(100% - 100px)",
                            marginLeft: "72px",
                        } : {}} className={"chat-ab-actions"}>
                            <MaterialButtonError onClick={() => {
                                setConfirmClear(false);
                                setClearDialogOpen(true);
                            }}><span className={"material-symbols-outlined"}>cancel</span></MaterialButtonError>
                            &nbsp;&nbsp;&nbsp;
                            <h3 className={isMobile ? "chat-title-mob" : "chat-title"}>{stateSelectedChat}</h3>
                            &nbsp;&nbsp;&nbsp;
                            <MaterialButtonTonal24Icon onClick={() => {
                                setSettingsOpen(true);
                            }}><span className={"material-symbols-outlined"}>settings</span></MaterialButtonTonal24Icon>
                        </div>
                    </div>
                    <div style={{
                        height: '120px'
                    }}/>
                    <div>
                        {
                            conversation.map((e, i) => {
                                return (
                                    <Message key={i} isBot={e.isBot} message={e.message}
                                             image={e.image === null || e.image === undefined ? null : e.image} isAssistant={false}/>
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
                <div className={isMobile ? "write-bar-mob" : "write-bar"}>
                    <textarea onInput={() => {
                        autoresize(document.querySelector(".chat-textarea"))
                    }} onKeyDown={handleKeyDown} className={"chat-textarea"} placeholder={"Start typing here..."}/>
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

export default CurrentChat;