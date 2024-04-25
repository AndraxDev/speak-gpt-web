import React from 'react';
import DocPage from "../components/DocPage";

function Debug() {
    return (
        <DocPage>
            <h2 className={"title"}>Debug</h2>
            <p className={"text"}>Supported app links:</p>
            <a href={"https://assistant.teslasoft.org/chat"}>https://assistant.teslasoft.org/chat</a>
            <br/>
            <a href={"https://assistant.teslasoft.org/prompts/vswPyF3848"}>https://assistant.teslasoft.org/prompts/vswPyF3848</a>
            <br/>
            <a href={"https://assistant.teslasoft.org/assistant"}>https://assistant.teslasoft.org/assistant</a>
            <p className={"warning"}>If these links are pointing you to a web pages instead of app or you have 404 error,
                please make sure you have installed SpeakGPT version 3.21 or newer and opening supported links is permitted for this app.</p>
        </DocPage>
    );
}

export default Debug;