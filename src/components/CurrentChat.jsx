import React, {useEffect} from 'react';
import {MaterialButtonTonal} from "../widgets/MaterialButton";
import Message from "./Message";
import OpenAI from "openai";
import {sha256} from "js-sha256";

function CurrentChat({chats, id, chatName}) {
    const [conversation, setConversation] = React.useState([]);
    const [lockedState, setLockedState] = React.useState(false);
    const [stateSelectedChat, setStateSelectedChat] = React.useState(chatName);
    const [db, setDb] = React.useState(null);

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
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: "1024x1024",
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

        const chatCompletion = await openai.chat.completions.create({
            messages: messages,
            model: "gpt-4-turbo-preview",
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

    const processRequest = () => {
        if (lockedState) {
            return;
        }

        const messages = conversation;

        setLockedState(true);
        messages.push({
            message: document.querySelector(".chat-textarea").value,
            isBot: false
        });

        setConversation([...messages]);
        saveConversation(sha256(stateSelectedChat), JSON.stringify(messages));

        let mx = document.querySelector(".chat-textarea").value
        if (mx.includes("/imagine ")) {
            generateImage(mx.replace("/imagine ", "")).then(r => {
                setLockedState(false)
            })
        } else {
            sendAIRequest(prepareConversation(messages)).then(r => {
                setLockedState(false);
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

    return (
        <div className={"chat-frame"}>
            <div className={"chat-area"}>
                <div className={"chat-history"}>
                    <h3 className={"chat-title"}>{stateSelectedChat}</h3>
                    <div>
                        {
                            conversation.map((e, i) => {
                                return (
                                    <Message key={i} isBot={e.isBot} message={e.message}/>
                                )
                            })
                        }
                    </div>
                    <div id={"bottom"}></div>
                </div>
                <div className={"write-bar"}>
                    <textarea onKeyDown={handleKeyDown} className={"chat-textarea"} placeholder={"Start typing here..."}/>
                    <div>
                        <MaterialButtonTonal className={"chat-send"} onClick={() => {
                            processRequest();
                        }}><span
                            className={"material-symbols-outlined"}>send</span></MaterialButtonTonal>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CurrentChat;