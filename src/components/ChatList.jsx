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
import Chats from "./Chats";
import CurrentChat from "./CurrentChat";
import {useParams, useNavigate} from "react-router-dom";
import ChatNotSelected from "./ChatNotSelected";
import {MaterialButton16} from "../widgets/MaterialButton";
import NewChatDialog from "./NewChatDialog";
import {modelToType} from "../util/ModelTypeConverter";
import {sha256} from "js-sha256";
import DeleteChatDialog from "./DeleteChatDialog";
import {copySettings, getModel, getSettingsJSON} from "../util/Settings";

function ChatList() {
    const [selectedChat, setSelectedChat] = React.useState("");
    const [newChatDialogOpen, setNewChatDialogOpen] = React.useState(false);
    const [newChatName, setNewChatName] = React.useState("");
    const [chatNameInvalid, setChatNameInvalid] = React.useState(false);
    const [invalidMessage, setInvalidMessage] = React.useState("");
    const [chatModel, setChatModel] = React.useState(localStorage.getItem("globalSettings") === null ? "gpt-3.5-turbo" : JSON.parse(localStorage.getItem("globalSettings")).model);
    const [selectedChatForDeletion, setSelectedChatForDeletion] = React.useState("");
    const [selectedChatForEdit, setSelectedChatForEdit] = React.useState("");
    const [isEditing, setIsEditing] = React.useState(false);
    const [deletionDialogOpen, setDeletionDialogOpen] = React.useState(false);
    const [deleteChatName, setDeleteChatName] = React.useState("");
    const [db, setDb] = React.useState(null);
    const [searchTerm, setSearchTerm] = React.useState("");

    let { id } = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        getDatabase()
    }, []);

    const getChatsList = () => {
        let c = localStorage.getItem("chats") !== undefined && localStorage.getItem("chats") !== null ? JSON.parse(localStorage.getItem("chats")) : [];
        let cc = [];
        c.forEach((e) => {
            cc.push({
                title: e.title,
                model: getModel(sha256(e.title)),
                type: modelToType(getModel(sha256(e.title)))
            });
        })

        return cc;
    }

    const getChatsListWithModels = (chatList) => {
        if (chatList === undefined || chatList === null) return [];

        let cc = [];

        chatList.forEach((e) => {
            cc.push({
                title: e.title,
                model: getModel(sha256(e.title)),
                type: modelToType(getModel(sha256(e.title)))
            });
        })

        return cc;
    }

    useEffect(() => {
        let c = localStorage.getItem("chats") !== undefined && localStorage.getItem("chats") !== null ? JSON.parse(localStorage.getItem("chats")) : [];

        if (c === undefined || c === null) {
            setChats([]);
            return;
        }

        if (searchTerm !== "" && chats !== null) {
            c = chats.filter((e) => {
                return e.title.toLowerCase().includes(searchTerm.toLowerCase());
            });

            setChats(getChatsListWithModels(c));
        } else {
            setChats(getChatsListWithModels(JSON.parse(localStorage.getItem("chats"))));
        }
    }, [searchTerm]);

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

    const saveConversation = (chatId, conversation, closeChatId, closeChatName, isDelete) => {
        const transaction = db.transaction(['chats'], 'readwrite');
        const objectStore = transaction.objectStore('chats');
        const request = objectStore.put({ chatId: chatId, content: conversation });

        request.onsuccess = function() {
            console.log("Conversation saved successfully");
            if (!isDelete) {
                closeEditAndUpdate(closeChatId, closeChatName)
            } else {
                if (id === chatId && chatId !== "") {
                    navigate("/chat/" + sha256(newChatName));
                }
            }
        };

        request.onerror = function(event) {
            console.log("Error saving conversation", event);
        }
    }

    useEffect(() => {
        if (id === "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855") {
            setSelectedChat("");
            navigate("/chat");
        } else if (id === undefined) {
            setSelectedChat("");
        }
    }, [id]);

    const deleteConversation = (chatId) => {
        saveConversation(chatId, "[]", "", "", true);
        setDeletionDialogOpen(false);
        setSelectedChatForEdit("");
        setSelectedChatForDeletion("");
        setDeleteChatName("");
        setNewChatDialogOpen(false);
        setIsEditing(false);
    }

    const [chats, setChats] = React.useState(getChatsList());

    const receiveLatestAvailableChatName = () => {
        if (chats === undefined || chats === null) return "New chat 1";
        let chatName = "New chat ";
        let chatNumber = 1;

        let c = localStorage.getItem("chats") !== undefined && localStorage.getItem("chats") !== null ? JSON.parse(localStorage.getItem("chats")) : [];

        c.forEach((e) => {
            if (e.title === chatName + chatNumber.toString()) {
                chatNumber++;
            }
        });

        return chatName + chatNumber.toString();
    }

    const [latestAvailableChatName, setLatestAvailableChatName] = React.useState(receiveLatestAvailableChatName());

    useEffect(() => {
        setLatestAvailableChatName(receiveLatestAvailableChatName());
    }, [chats]);

    useEffect(() => {
        if (!isEditing) {
            if (newChatName !== "" && newChatDialogOpen) {
                let isFoundChat = false;

                if (chats !== null) {
                    chats.forEach((e) => {
                        if (e.title === newChatName) {
                            isFoundChat = true;
                        }
                    });
                }

                if (!isFoundChat) {
                    if (localStorage.getItem("chats") === null || localStorage.getItem("chats") === undefined) {
                        localStorage.setItem("chats", JSON.stringify([{
                            title: newChatName,
                            model: getModel(sha256(newChatName)),
                            type: modelToType(getModel(sha256(newChatName)))
                        }]));
                    } else {
                        localStorage.setItem("chats", JSON.stringify([...JSON.parse(localStorage.getItem("chats")), {
                            title: newChatName,
                            model: getModel(sha256(newChatName)),
                            type: modelToType(getModel(sha256(newChatName)))
                        }]));
                    }

                    setNewChatDialogOpen(false);
                    setNewChatName("");
                    setInvalidMessage("");
                    setChatNameInvalid(false);
                    localStorage.setItem(sha256(newChatName) + ".settings", JSON.stringify(getSettingsJSON("")));
                    updateSearchResults()
                    navigate("/chat/" + sha256(newChatName));
                } else {
                    setChatNameInvalid(true);
                    setInvalidMessage("Chat name already exists.");
                }
            } else {
                setChatNameInvalid(true);
                setInvalidMessage("Please enter chat name.");
            }
        }
    }, [chats, newChatName, newChatDialogOpen]);

    const deleteChat = (chatName) => {
        let c = localStorage.getItem("chats") !== undefined && localStorage.getItem("chats") !== null ? JSON.parse(localStorage.getItem("chats")) : [];
        let newChats = c.filter((e) => {
            return e.title !== chatName;
        });

        localStorage.setItem("chats", JSON.stringify(newChats));
        deleteConversation(sha256(chatName));
        localStorage.removeItem(sha256(chatName) + ".settings");

        updateSearchResults()

        setDeletionDialogOpen(false);
        setSelectedChatForEdit("");
        setSelectedChatForDeletion("");
        setDeleteChatName("");
        setNewChatDialogOpen(false);
        setIsEditing(false);

        if (id === sha256(chatName)) {
            navigate("/chat");
        }
    }

    const renameChat = (chatName, newChatName) => {
        if (chatName !== "" && newChatName !== "") {
            let isFoundChat = false;

            chats.forEach((e) => {
                if (e.title === newChatName) {
                    isFoundChat = true;
                }
            });

            if (!isFoundChat) {
                let newChats = localStorage.getItem("chats") !== undefined && localStorage.getItem("chats") !== null ? JSON.parse(localStorage.getItem("chats")) : [];

                newChats.push({
                    title: newChatName,
                    model: getModel(sha256(newChatName)),
                    type: modelToType(getModel(sha256(newChatName)))
                })

                newChats = newChats.filter((e) => {
                    return e.title !== chatName;
                });

                localStorage.setItem("chats", JSON.stringify(newChats));

                const transaction = db.transaction(['chats'], 'readonly');
                const objectStore = transaction.objectStore('chats');
                const request = objectStore.getAll();

                request.onsuccess = function() {
                    let isFound = false;

                    request.result.forEach((e) => {
                        if (e.chatId === sha256(chatName)) {
                            isFound = true;
                            copySettings(sha256(chatName), sha256(newChatName));
                            updateSearchResults()
                            saveConversation(sha256(newChatName), e.content, id, chatName, false);
                        }
                    });

                    if (!isFound) {
                        saveConversation(sha256(newChatName), "[]", id, chatName, false);
                    }
                };

                request.onerror = function(event) {
                    console.log("Error getting conversation", event.target.errorCode);
                }
            }
        }
    }

    const updateSearchResults = () => {
        if (searchTerm !== "") {
            let c = localStorage.getItem("chats") !== undefined && localStorage.getItem("chats") !== null ? JSON.parse(localStorage.getItem("chats")) : [];

            c = c.filter((e) => {
                return e.title.toLowerCase().includes(searchTerm.toLowerCase());
            });

            setChats(getChatsListWithModels(c));
        } else {
            setChats(getChatsListWithModels(JSON.parse(localStorage.getItem("chats"))));
        }
    }

    const closeEditAndUpdate = (id, chatName) => {
        deleteConversation(sha256(chatName));

        setNewChatDialogOpen(false);

        if (id === sha256(chatName) && chatName !== "") {
            navigate("/chat/" + sha256(newChatName));
        }
    }

    useEffect(() => {
        if (selectedChatForEdit !== "" && isEditing) {
            renameChat(selectedChatForEdit, newChatName);
        }
    }, [selectedChatForEdit, newChatName]);

    useEffect(() => {
        if (selectedChatForDeletion !== "") {
            setDeletionDialogOpen(true);
        }

        if (selectedChatForEdit !== "") {
            setIsEditing(true);
            setNewChatDialogOpen(true)
        }
    }, [selectedChatForDeletion, selectedChatForEdit]);

    useEffect(() => {
        if (!newChatDialogOpen && !deletionDialogOpen) {
            setNewChatName("");
            setChatNameInvalid(false);
            setInvalidMessage("");
            setIsEditing(false);
            setSelectedChatForEdit("");
            setSelectedChatForDeletion("");
        }
    }, [newChatDialogOpen, deletionDialogOpen]);

    useEffect(() => {
        if (deleteChatName !== "" && !deletionDialogOpen) {
            deleteChat(deleteChatName);
            setDeleteChatName("");
            setDeletionDialogOpen(false);
        }
    }, [deleteChatName, deletionDialogOpen]);

    return (
        <div className={"chat-window"}>
            {
                newChatDialogOpen && selectedChatForEdit === "" && latestAvailableChatName !== "" ? <NewChatDialog chatName={latestAvailableChatName} setChatName={setNewChatName} invalidState={chatNameInvalid || latestAvailableChatName === ""} invalidMessage={invalidMessage || latestAvailableChatName === ""} setChatDialogOpen={setNewChatDialogOpen} isEdit={false} chatModel={chatModel} setIsEditing={setIsEditing} /> : null
            }
            {
                newChatDialogOpen && selectedChatForEdit !== "" ? <NewChatDialog chatName={selectedChatForEdit} setChatName={setNewChatName} invalidState={chatNameInvalid} invalidMessage={invalidMessage} setChatDialogOpen={setNewChatDialogOpen} isEdit={true} chatModel={chatModel} setIsEditing={setIsEditing} /> : null
            }
            {
                deletionDialogOpen ? <DeleteChatDialog setOpenState={setDeletionDialogOpen} chatName={selectedChatForDeletion} setChatName={setDeleteChatName} /> : null
            }
            <div className={"chat-list-container"}>
                <div className={"chat-list-filter"}>
                    <h2 className={"page-title"}>SpeakGPT</h2>
                    <div className={"search-box"}>
                        <input className={"search-input"} type={"text"} placeholder={"Search chats..."} onChange={(e) => {
                            setSearchTerm(e.target.value)
                        }}/>
                        <span className={"search-icon material-symbols-outlined"}>search</span>
                    </div>
                    <br/>
                </div>
                <div className={"fw"}>
                    <MaterialButton16 className={"fab"} style={{
                        marginLeft: "16px",
                        marginRight: "16px"
                    }} onClick={() => {
                        setNewChatDialogOpen(true)
                    }}>&nbsp;<span className={"material-symbols-outlined"}>add</span>&nbsp;
                        <span>New chat</span>&nbsp;&nbsp;</MaterialButton16>
                </div>
                <div className={"chat-list"}>
                    {id === undefined ? <Chats chats={chats} id={""} setSelected={setSelectedChat} selectedChat={""}
                                               setSelectedChatForDeletion={setSelectedChatForDeletion}
                                               setSelectedChatForEdit={setSelectedChatForEdit}/>
                        : <Chats chats={chats} id={id} setSelected={setSelectedChat} selectedChat={selectedChat}
                                 setSelectedChatForDeletion={setSelectedChatForDeletion}
                                 setSelectedChatForEdit={setSelectedChatForEdit}/>}
                </div>
            </div>
            <div className={"chat-content"}>
                {id === undefined ? <ChatNotSelected/> :
                    <CurrentChat chats={chats} id={id} chatName={selectedChat} updateChats={setChats}/>}
            </div>
        </div>
    );
}

export default ChatList;