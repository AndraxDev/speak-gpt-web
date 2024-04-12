import React, {useEffect} from 'react';
import ChatItem from "./ChatItem";
import {sha256} from "js-sha256";

function Chats({selectedChat, id, chats, setSelectedChatForDeletion, setSelectedChatForEdit, ...props}) {

    const [stateSelectedChat, setStateSelectedChat] = React.useState(selectedChat);
    const [selectedChatForDeletionTemp, setSelectedChatForDeletionTemp] = React.useState("");
    const [selectedChatForEditTemp, setSelectedChatForEditTemp] = React.useState("");
    const [isEditTemp, setIsEditTemp] = React.useState(false);
    const [isDeleteTemp, setIsDeleteTemp] = React.useState(false);

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
    }, [chats, id, selectedChat, stateSelectedChat]);

    useEffect(() => {
        if (isDeleteTemp) {
            setIsDeleteTemp(false);
            console.log("Deletion triggered");

            setSelectedChatForDeletion(selectedChatForDeletionTemp);
        }

        if (isEditTemp) {
            setIsEditTemp(false);

            setSelectedChatForEdit(selectedChatForEditTemp);
        }
    }, [isEditTemp, isDeleteTemp, setSelectedChatForDeletion, selectedChatForDeletionTemp, setSelectedChatForEdit, selectedChatForEditTemp]);

    return (
        <div>
            {
                chats !== null ?
                chats.map((e) => {
                    return (
                        <div key={sha256(e.title)} onClick={() => {
                            props.setSelected(e.title);
                        }}>
                            <ChatItem isActive={e.title === stateSelectedChat} name={e.title} model={e.model} type={e.type} id={sha256(e.title)} setDeleteChat={setSelectedChatForDeletionTemp} setEditChat={setSelectedChatForEditTemp} setIsDelete={setIsDeleteTemp} setIsEdit={setIsEditTemp}/>
                        </div>
                    )
                }) : null
            }
            <div style={{
                height: '100px'
            }}></div>
        </div>
    );
}

export default Chats;