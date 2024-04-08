import React from 'react';
import {Link} from "react-router-dom";
import {MaterialButton24} from "../widgets/MaterialButton";

function WelcomePage(props) {
    return (
        <div>
            <h2 className={"title"}>SpeakGPT web on alpha stage</h2>
            <p className={"text"}>This version of SpeakGPT is experimental. You can try it before official release.
                Click the button below
                to launch SpeakGPT.</p>
            <Link to={"/chat"}><MaterialButton24>Launch SpeakGPT</MaterialButton24></Link>
            <br/><br/>
            <code className={"comment"}>// Developer note: This page must be replaced with welcome page.</code>
            <h3 className={"title"}>Changelog:</h3>
            <code className={"title"}>0.0.3-alpha3</code><br/>
            <code className={"text"}>- Added image generation.</code><br/>
            <code className={"text"}>- Fixed minor bugs.</code><br/>
            <br/>
            <code className={"title"}>0.0.2-alpha2</code><br/>
            <code className={"text"}>- Changed chats location. Chats are now located in the indexed DB. We're preparing
                for image generation and chats import/export. You might also noticed that you chats has gone. Open
                Developers Tools > Console and put command localStorage.chatId, where chatId is a sha256 hash of the
                chat name to recover a chat. You can load chat as JSON in SpeakGPT mobile app now. Web version will
                receive this feature soon.</code><br/>
            <code className={"text"}>- Added autoscroll in chats.</code><br/>
            <br/>
            <code className={"title"}>0.0.1-alpha1</code><br/>
            <code className={"text"}>- Initial release.</code><br/>
            <code className={"text"}>- You can create multiple chats.</code><br/>
            <code className={"text"}>- You can select different AI models.</code>
        </div>
    );
}

export default WelcomePage;
