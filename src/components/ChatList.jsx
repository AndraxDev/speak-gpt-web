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

const exampleChats = [
    {
        title: "Chat 1",
        model: "gpt-3.5-turbo",
        type: "GPT 3.5"
    },
    {
        title: "Chat 2",
        model: "gpt-4-turbo-preview",
        type: "GPT 4 Turbo"
    },
    {
        title: "Chat 3",
        model: "gpt-4",
        type: "GPT 4"
    },
    {
        title: "Chat 4",
        model: "custom-fine-tuned-model",
        type: "FT"
    }
];

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
        localStorage.removeItem(sha256(chatName));
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

                localStorage.setItem(sha256(newChatName), localStorage.getItem(sha256(chatName)) !== null ? localStorage.getItem(sha256(chatName)) : "[]");
                localStorage.setItem(sha256(newChatName) + ".settings", localStorage.getItem(sha256(chatName) + ".settings") !== null ? localStorage.getItem(sha256(chatName) + ".settings") : "{}");

                setNewChatDialogOpen(false);

                if (id === sha256(chatName)) {
                    window.location.replace("/chat/" + sha256(newChatName));
                }
            }
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