import React from 'react';

function ChatNotSelected(props) {
    return (
        <div className={"placeholder-bg"}>
            <span className={"placeholder-icon material-symbols-outlined"}>chat</span>
            <p className={"placeholder-text"}>Create or select a chat to start conversation.</p>
        </div>
    );
}

export default ChatNotSelected;