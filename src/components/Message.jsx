import React from 'react';

function Message({isBot, message, ...props}) {
    return (
        <div className={"message"}>
            {isBot ? (
                <div className={"message-bot"}>
                    <div className={"message-author"}>
                        <span className={"message-icon material-symbols-outlined"}>smart_toy</span>
                        <b className={"message-author-2"}>SpeakGPT</b>
                    </div>
                    <p className={"message-content"}>{message}</p>
                </div>
            ) : (
                <div className={"message-user"}>
                    <div className={"message-author"}>
                        <span className={"message-icon material-symbols-outlined"}>account_circle</span>
                        <b className={"message-author-2"}>User</b>
                    </div>
                    <p className={"message-content"}>{message}</p>
                </div>
            )}
        </div>
    );
}

export default Message;