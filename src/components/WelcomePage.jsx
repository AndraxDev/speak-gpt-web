import React from 'react';
import {Link} from "react-router-dom";
import {MaterialButton24} from "../widgets/MaterialButton";

function WelcomePage(props) {
    return (
        <div>
            <h2 className={"title"}>SpeakGPT web is alpha</h2>
            <p className={"text"}>This version of SpeakGPT is experimental. You can try it before official release.
                Click the button below
                to launch SpeakGPT.</p>
            <Link to={"/chat"}><MaterialButton24>Launch SpeakGPT</MaterialButton24></Link>
            <br/><br/>
            <code className={"comment"}>// Developer note: This page must be replaced with welcome page.</code>
            <h3 className={"title"}>Changelog:</h3>
            <code className={"title"}>0.0.1-alpha1</code><br/>
            <code className={"text"}>- Initial release</code><br/>
            <code className={"text"}>- You can create multiple chats</code><br/>
            <code className={"text"}>- You can select different AI models</code>
        </div>
    );
}

export default WelcomePage;
