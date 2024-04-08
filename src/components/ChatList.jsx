import React, {useEffect} from 'react';
import Chats from "./Chats";
import CurrentChat from "./CurrentChat";
import {useParams} from "react-router-dom";
import ChatNotSelected from "./ChatNotSelected";
import {MaterialButton16} from "../widgets/MaterialButton";
import NewChatDialog from "./NewChatDialog";
import {modelToType} from "../util/ModelTypeConverter";
import {sha256} from "js-sha256";
import DeleteChatDialog from "./DeleteChatDialog";

function ChatList(props) {
    const [selectedChat, setSelectedChat] = React.useState("");
    const [newChatDialogOpen, setNewChatDialogOpen] = React.useState(false);
    const [newChatName, setNewChatName] = React.useState("");
    const [chatNameInvalid, setChatNameInvalid] = React.useState(false);
    const [invalidMessage, setInvalidMessage] = React.useState("");
    const [chatModel, setChatModel] = React.useState("gpt-3.5-turbo");
    const [selectedChatForDeletion, setSelectedChatForDeletion] = React.useState("");
    const [selectedChatForEdit, setSelectedChatForEdit] = React.useState("");
    const [isEditing, setIsEditing] = React.useState(false);
    const [deletionDialogOpen, setDeletionDialogOpen] = React.useState(false);
    const [deleteChatName, setDeleteChatName] = React.useState("");
    const [db, setDb] = React.useState(null);

    useEffect(() => {
        getDatabase()
    }, []);

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

    const saveConversation = (chatId, conversation, closeChatId, closeChatName) => {
        const transaction = db.transaction(['chats'], 'readwrite');
        const objectStore = transaction.objectStore('chats');
        const request = objectStore.put({ chatId: chatId, content: conversation });

        request.onsuccess = function() {
            console.log("Conversation saved successfully");
            closeEditAndUpdate(closeChatId, closeChatName)
        };

        request.onerror = function(event) {
            console.log("Error saving conversation", event);
        }
    }

    const deleteConversation = (chatId) => {
        saveConversation(chatId, "[]", "", "");
    }

    let { id } = useParams();

    const [chats, setChats] = React.useState(localStorage.getItem("chats") !== null ? JSON.parse(localStorage.getItem("chats")) : []);

    useEffect(() => {
        if (!isEditing) {
            if (newChatName !== "" && newChatDialogOpen) {
                let isFoundChat = false;

                chats.forEach((e) => {
                    if (e.title === newChatName) {
                        isFoundChat = true;
                    }
                });

                if (!isFoundChat) {
                    setChats([...chats, {
                        title: newChatName,
                        model: chatModel,
                        type: modelToType(chatModel)
                    }])

                    setNewChatDialogOpen(false);
                    setNewChatName("");
                    setInvalidMessage("");
                    setChatNameInvalid(false);
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
        let newChats = chats.filter((e) => {
            return e.title !== chatName;
        });

        setChats(newChats);
        localStorage.setItem("chats", JSON.stringify(newChats));
        deleteConversation(sha256(chatName));
        localStorage.removeItem(sha256(chatName) + ".settings");

        setDeleteChatName("");

        if (id === sha256(chatName)) {
            window.location.replace("/chat");
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
                let newChats = chats

                newChats.push({
                    title: newChatName,
                    model: chatModel,
                    type: modelToType(chatModel)
                })

                newChats = newChats.filter((e) => {
                    return e.title !== chatName;
                });

                setChats(newChats)

                const transaction = db.transaction(['chats'], 'readonly');
                const objectStore = transaction.objectStore('chats');
                const request = objectStore.getAll();

                request.onsuccess = function() {
                    let isFound = false;

                    request.result.forEach((e) => {
                        if (e.chatId === sha256(chatName)) {
                            console.log("Found conversation", e.content);
                            isFound = true;
                            saveConversation(sha256(newChatName), e.content, id, chatName);
                        }
                    });

                    if (!isFound) {
                        saveConversation(sha256(newChatName), "[]", id, chatName);
                    }
                };

                request.onerror = function(event) {
                    console.log("Error getting conversation", event.target.errorCode);
                }
            }
        }
    }

    const closeEditAndUpdate = (id, chatName) => {
        deleteConversation(sha256(chatName));

        setNewChatDialogOpen(false);

        if (id === sha256(chatName) && chatName !== "") {
            window.location.replace("/chat/" + sha256(newChatName));
        }
    }

    useEffect(() => {
        if (selectedChatForEdit !== "" && isEditing) {
            renameChat(selectedChatForEdit, newChatName);
        }
    }, [selectedChatForEdit, newChatName]);

    useEffect(() => {
        localStorage.setItem("chats", JSON.stringify(chats));
    }, [chats]);

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
        if (deleteChatName !== "") {
            deleteChat(deleteChatName);
        }
    }, [deleteChatName]);

    return (
        <div className={"chat-window"}>
            {
                newChatDialogOpen && selectedChatForEdit === "" ? <NewChatDialog chatName={""} setChatName={setNewChatName} invalidState={chatNameInvalid} invalidMessage={invalidMessage} setChatDialogOpen={setNewChatDialogOpen} isEdit={false} chatModel={chatModel} setChatModel={setChatModel} setIsEditing={setIsEditing} /> : null
            }
            {
                newChatDialogOpen && selectedChatForEdit !== "" ? <NewChatDialog chatName={selectedChatForEdit} setChatName={setNewChatName} invalidState={chatNameInvalid} invalidMessage={invalidMessage} setChatDialogOpen={setNewChatDialogOpen} isEdit={true} chatModel={chatModel} setChatModel={setChatModel} setIsEditing={setIsEditing} /> : null
            }
            {
                deletionDialogOpen ? <DeleteChatDialog setOpenState={setDeletionDialogOpen} chatName={selectedChatForDeletion} setChatName={setDeleteChatName} /> : null
            }
            <div className={"chat-list"}>
                <h2 className={"page-title"}>SpeakGPT</h2>
                <div className={"fw"}>
                    <MaterialButton16 className={"fab"} style={{
                        marginLeft: "16px",
                        marginRight: "16px"
                    }} onClick={() => {
                        setNewChatDialogOpen(true)
                    }}>&nbsp;<span className={"material-symbols-outlined"}>add</span>&nbsp;<span>New chat</span>&nbsp;&nbsp;</MaterialButton16>
                </div>
                {id === undefined ? <Chats chats={chats} id={""} setSelected={setSelectedChat} selectedChat={""} setSelectedChatForDeletion={setSelectedChatForDeletion} setSelectedChatForEdit={setSelectedChatForEdit}/>
                    : <Chats chats={chats} id={id} setSelected={setSelectedChat} selectedChat={selectedChat} setSelectedChatForDeletion={setSelectedChatForDeletion} setSelectedChatForEdit={setSelectedChatForEdit}/>}
            </div>
            <div className={"chat-content"}>
                {id === undefined ? <ChatNotSelected/> : <CurrentChat chats={chats} id={id} chatName={selectedChat}/>}
            </div>
        </div>
    );
}

export default ChatList;