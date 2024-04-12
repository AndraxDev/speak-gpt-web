import React, {useEffect} from 'react';
import {
    MaterialButtonError,
    MaterialButtonTonal,
    MaterialButtonTonal24,
    VisuallyHiddenInput
} from "../widgets/MaterialButton";
import Message from "./Message";
import OpenAI from "openai";
import {sha256} from "js-sha256";
import ConfirmChatClear from "./ConfirmChatClear";
import {CircularProgress} from "@mui/material";
import ChatSettings from "./ChatSettings";
import ApiKeyChangeDialog from "./ApiKeyChangeDialog";
import {getModel, setModel, getSystemMessage, setSystemMessage, getDalleVersion, setDalleVersion, getResolution, setResolution} from "../util/Settings";
import SelectResolutionDialog from "./SelectResolutionDialog";
import SelectModelDialog from "./SelectModelDialog";
import {modelToType} from "../util/ModelTypeConverter";
import SystemMessageEditDialog from "./SystemMessageEditDialog";

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

    const handleKeyDown = (event) => {
        // Check if Enter key is pressed without Shift key
        if (event.key === 'Enter' && !event.shiftKey) {
            // Prevent default action to avoid adding a new line
            event.preventDefault();

            // Perform your action here (e.g., submit the text)
            processRequest()
        }
        // Optional: handle other key events or conditions, if necessary
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

        // setConversation(localStorage.getItem(sha256(stateSelectedChat)) !== null ? JSON.parse(localStorage.getItem(sha256(stateSelectedChat))) : []);
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
    }

    const sendAIRequest = async (messages) => {
        const openai = new OpenAI({
            apiKey: localStorage.getItem("apiKey"),
            dangerouslyAllowBrowser: true
        });

        if (selectedFile !== null) {
            let ms = messages;

            let prompt = ms[ms.length - 1].content;

            ms[ms.length - 1].content = [
                { type: "text", text: prompt },
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
    }

    const processRequest = () => {
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
            })
        } else {
            sendAIRequest(prepareConversation(messages)).then(r => {
                setLockedState(false);
                setSelectedFile(null)
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
            <div className={"chat-area"}>
                <div className={"chat-history"}>
                    <div className={"chat-ab-actions-container"}>
                        <div className={"chat-ab-actions"}>
                            <MaterialButtonError onClick={() => {
                                setConfirmClear(false);
                                setClearDialogOpen(true);
                            }}><span className={"material-symbols-outlined"}>cancel</span></MaterialButtonError>
                            &nbsp;&nbsp;&nbsp;
                            <h3 className={"chat-title"}>{stateSelectedChat}</h3>
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
                <div className={"write-bar"}>
                    <textarea onKeyDown={handleKeyDown} className={"chat-textarea"} placeholder={"Start typing here..."}/>
                    <div>
                        <MaterialButtonTonal className={"chat-send"}><span className={"material-symbols-outlined"}>photo</span><input className={"visually-hidden-input"} onChange={(e) => {
                            if (e.target.files.length !== 0) {
                                processFile(e.target.files[0])
                            }
                        }} type="file" /></MaterialButtonTonal>
                    </div>
                    &nbsp;&nbsp;&nbsp;
                    <div>
                        {
                            lockedState ? <MaterialButtonTonal className={"chat-send"} onClick={() => {
                                processRequest();
                            }}><CircularProgress style={{
                                    color: "var(--color-accent-900)",
                                }}/></MaterialButtonTonal>
                                :
                                <MaterialButtonTonal className={"chat-send"} onClick={() => {
                                    processRequest();
                                }}><span
                                    className={"material-symbols-outlined"}>send</span></MaterialButtonTonal>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CurrentChat;