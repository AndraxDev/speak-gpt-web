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
import Chats from "./Chats";
import CurrentChat from "./CurrentChat";
import {useParams, useNavigate} from "react-router-dom";
import Placeholder from "./Placeholder";
import {MaterialButton16} from "../widgets/MaterialButton";
import NewChatDialog from "./NewChatDialog";
import {modelToType} from "../util/ModelTypeConverter";
import {sha256} from "js-sha256";
import DeleteChatDialog from "./DeleteChatDialog";
import {copySettings, getModel, getSettingsJSON} from "../util/Settings";
import {BrowserView, isMobile, MobileView} from "react-device-detect";

function ChatList() {
    const [selectedChat, setSelectedChat] = React.useState("");
    const [newChatDialogOpen, setNewChatDialogOpen] = React.useState(false);
    const [newChatName, setNewChatName] = React.useState("");
    const [chatNameInvalid, setChatNameInvalid] = React.useState(false);
    const [invalidMessage, setInvalidMessage] = React.useState("");
    // eslint-disable-next-line no-unused-vars
    const [chatModel, setChatModel] = React.useState(localStorage.getItem("globalSettings") === null ? "gpt-3.5-turbo" : JSON.parse(localStorage.getItem("globalSettings")).model);
    const [selectedChatForDeletion, setSelectedChatForDeletion] = React.useState("");
    const [selectedChatForEdit, setSelectedChatForEdit] = React.useState("");
    const [isEditing, setIsEditing] = React.useState(false);
    const [deletionDialogOpen, setDeletionDialogOpen] = React.useState(false);
    const [deleteChatName, setDeleteChatName] = React.useState("");
    const [db, setDb] = React.useState(null);
    const [searchTerm, setSearchTerm] = React.useState("");
    // eslint-disable-next-line no-unused-vars
    const [chatsAreLoaded, setChatsAreLoaded] = React.useState(false);
    const [updateCounter, setUpdateCounter] = React.useState(0);

    let { id } = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        getDatabase()
    }, []);

    useEffect(() => {
        if (db !== null) {
            requestUpdate();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [db, selectedChat])

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
        if (db !== null && db !== undefined) {
            let c = localStorage.getItem("chats") !== undefined && localStorage.getItem("chats") !== null ? JSON.parse(localStorage.getItem("chats")) : [];

            if (c === undefined || c === null) {
                setChats([]);
                return;
            }

            if (searchTerm !== "" && chats !== null) {
                c = chats.filter((e) => {
                    return e.title.toLowerCase().includes(searchTerm.toLowerCase());
                });

                forceUpdate(getChatsListWithModels(c));
            } else {
                forceUpdate(getChatsListWithModels(JSON.parse(localStorage.getItem("chats"))));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [db, searchTerm]);

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
            // console.log("Database opened successfully");
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const requestUpdate = () => {
        getAllFirstMessages(chats).then((res) => {
            setChats(res);
            setChatsAreLoaded(true);
        })
    }

    const forceUpdate = (chats) => {
        getAllFirstMessages(chats).then((res) => {
            setChats(res);
            setChatsAreLoaded(true);
        })
    }

    const receiveLatestAvailableChatName = () => {
        if (chats === undefined || chats === null) return "New chat 1";
        let chatName = "New chat ";
        let chatNumber = 1;

        let c = localStorage.getItem("chats") !== undefined && localStorage.getItem("chats") !== null ? JSON.parse(localStorage.getItem("chats")) : [];

        // eslint-disable-next-line no-unused-vars
        for (const _ of c) {
            let isFound = false;
            for (const element of c) {
                if (element.title === chatName + chatNumber.toString()) {
                    isFound = true;
                    break;
                }
            }

            if (isFound) {
                chatNumber++;
            } else {
                break;

            }
        }

        return chatName + chatNumber.toString();
    }

    const [latestAvailableChatName, setLatestAvailableChatName] = React.useState(receiveLatestAvailableChatName());

    useEffect(() => {
        setLatestAvailableChatName(receiveLatestAvailableChatName());
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    let newChats = []
                    if (localStorage.getItem("chats") === null || localStorage.getItem("chats") === undefined) {
                        newChats = [{
                            title: newChatName,
                            model: getModel(sha256(newChatName)),
                            type: modelToType(getModel(sha256(newChatName)))
                        }]
                    } else {
                        newChats = [...JSON.parse(localStorage.getItem("chats")), {
                            title: newChatName,
                            model: getModel(sha256(newChatName)),
                            type: modelToType(getModel(sha256(newChatName)))
                        }]
                    }

                    localStorage.setItem("chats", JSON.stringify(newChats));

                    setNewChatDialogOpen(false);
                    setNewChatName("");
                    setInvalidMessage("");
                    setChatNameInvalid(false);
                    localStorage.setItem(sha256(newChatName) + ".settings", JSON.stringify(getSettingsJSON("")));
                    updateSearchResults()
                    forceUpdate(newChats);
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

        setChats(newChats);
        forceUpdate(newChats);

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

                forceUpdate(newChats);

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

            forceUpdate(getChatsListWithModels(c));
        } else {
            forceUpdate(getChatsListWithModels(JSON.parse(localStorage.getItem("chats"))));
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deleteChatName, deletionDialogOpen]);

    const getConversation = async (chatId) => {
        const transaction = db.transaction(['chats'], 'readonly');
        const objectStore = transaction.objectStore('chats');
        const request = objectStore.get(chatId);

        return new Promise((resolve, reject) => {
            request.onsuccess = function() {
                let conversation = request.result === undefined ? "[]" : request.result.content;
                resolve(JSON.parse(conversation));
            };

            request.onerror = function(event) {
                reject("Error getting conversation", event.target.errorCode);
            }
        });
    }

    const getAllFirstMessages = async (chats) => {
        const cht = [];
        for (const e of chats) {
            await getConversation(sha256(e.title)).then((result) => {
                if (result.image !== undefined && result.image !== null && result.message.toString().trim() === "") {
                    cht.push({
                        title: e.title,
                        model: getModel(sha256(e.title)),
                        type: modelToType(getModel(sha256(e.title))),
                        firstMessage: "Image",
                    });
                } else {
                    cht.push({
                        title: e.title,
                        model: getModel(sha256(e.title)),
                        type: modelToType(getModel(sha256(e.title))),
                        firstMessage: result.length === 0 ? "No messages yet." : result[0].message,
                    });
                }

            });
        }

        return cht;
    }

    useEffect(() => {
        if (db !== null && chats !== null && chats !== undefined && chats.length > 0 && updateCounter === 0) {
            getAllFirstMessages(chats).then((res) => {
                setChats(res);
                setChatsAreLoaded(true);
                setUpdateCounter(updateCounter + 1);
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [db, chats, updateCounter]);

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
            <div className={isMobile ? "chat-list-container-mob" : "chat-list-container"}>
                <div className={"chat-list-filter"}>
                    <h2 className={"page-title"}>SpeakGPT</h2>
                    <div className={isMobile ? "search-box-mob" : "search-box"}>
                        <input className={"search-input"} type={"text"} placeholder={"Search chats..."} onChange={(e) => {
                            setSearchTerm(e.target.value)
                        }}/>
                        <span className={"search-icon material-symbols-outlined"}>search</span>
                    </div>
                </div>
                <div className={isMobile ? "fab-area-mob" : "fw"}>
                    <BrowserView>
                        <MaterialButton16 className={"fab"} style={{
                            marginLeft: "10px",
                            marginRight: "10px"
                        }} onClick={() => {
                            setNewChatDialogOpen(true)
                        }}>&nbsp;<span className={"material-symbols-outlined"}>add</span>&nbsp;
                            <span>New chat</span>&nbsp;&nbsp;</MaterialButton16>
                    </BrowserView>
                    <MobileView>
                        <MaterialButton16 className={"fab"} style={{
                            marginLeft: "16px",
                            marginRight: "16px"
                        }} onClick={() => {
                            setNewChatDialogOpen(true)
                        }}>&nbsp;<span className={"material-symbols-outlined"}>add</span>&nbsp;
                            <span>New chat</span>&nbsp;&nbsp;</MaterialButton16>
                    </MobileView>
                </div>
                <div style={isMobile ? {
                    height: "calc(calc(var(--vh, 1vh) * 100) - 220px)",
                } : {}} className={isMobile ? "chat-list-mob" : "chat-list"}>
                    {id === undefined ? <Chats chats={chats} id={""} setSelected={setSelectedChat} selectedChat={""}
                                               setSelectedChatForDeletion={setSelectedChatForDeletion}
                                               setSelectedChatForEdit={setSelectedChatForEdit}/>
                        : <Chats chats={chats} id={id} setSelected={setSelectedChat} selectedChat={selectedChat}
                                 setSelectedChatForDeletion={setSelectedChatForDeletion}
                                 setSelectedChatForEdit={setSelectedChatForEdit}/>}
                </div>
            </div>
            <div className={isMobile ? "" : "chat-content"}>
                {id === undefined ? <>
                    { isMobile ? null : <Placeholder icon={"chat"} message={"Create or select a chat to start conversation."}/> }
                    </> :
                    <CurrentChat onUpdate={requestUpdate} chats={chats} id={id} chatName={selectedChat} updateChats={setChats}/>}
            </div>
        </div>
    );
}

export default ChatList;