import React from 'react';
import {MaterialEditText} from "../widgets/MaterialEditText";
import {MaterialButton24} from "../widgets/MaterialButton";

function ApiKeyChangeDialog(props) {
    const [apiKey, setApiKey] = React.useState("");

    const saveApiKey = () => {
        if (apiKey !== "") {
            localStorage.setItem('apiKey', apiKey);
            window.location.reload();
        }
    }

    return (
        <div className={"dialog-backdrop"}>
            <div className={"dialog-paper"}>
            <h3 className={"dialog-title"}>Change API Key</h3>
            <MaterialEditText label="API Key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
                <div className={"dialog-actions"}>
                    <MaterialButton24 onClick={saveApiKey}>Save</MaterialButton24>
                </div>
            </div>
        </div>
    );
}

export default ApiKeyChangeDialog;