import React from 'react';
import {MaterialEditText} from "../widgets/MaterialEditText";
import {MaterialButton24} from "../widgets/MaterialButton";

function ApiKeyDialog(props) {
    const [apiKey, setApiKey] = React.useState("");

    const saveApiKey = () => {
        if (apiKey !== "") {
            localStorage.setItem('apiKey', apiKey);
            window.location.reload();
        }
    }

    return (
        <>
            {
                localStorage.getItem('apiKey') === null || localStorage.getItem('apiKey') === undefined || localStorage.getItem('apiKey') === "" ?
                    <div className={"dialog-backdrop"}>
                        <div className={"dialog-paper"}>
                            <h3 className={"dialog-title"}>Setup</h3>
                            <p className={"dialog-content"}>To use this software you need to provide your OpenAI API key. SpeakGPT uses paid OpenAI models. API usage is significantly cheaper than fixed subscription. API-key authentication is safer than username/password authentication. App can access only API but not account info. You can revoke API key anytime without losing your account. API key is stored only on your device.</p>
                            <MaterialEditText label="API Key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
                            <p className={"warning"}>Enter the key only if you are using this app at https://assistant.teslasoft.org/. Other links may be insecure and phishing.</p>
                            <div className={"dialog-actions"}>
                                <MaterialButton24 onClick={saveApiKey}>Save</MaterialButton24>
                            </div>
                        </div>
                    </div>
                    : null
            }
        </>
    );
}

export default ApiKeyDialog;