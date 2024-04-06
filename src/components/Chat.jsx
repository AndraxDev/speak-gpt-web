import React from 'react';
import ChatNotSelected from "./ChatNotSelected";
import Chats from "./Chats";

function Chat(props) {
    return (
        <div className={"chat-window"}>
            <div className={"chat-list"}>
                <h2 className={"page-title"}>SpeakGPT</h2>
                <Chats/>
            </div>
            <div className={"chat-content"}>
                <ChatNotSelected/>
            </div>
        </div>
    );
}

export default Chat;
