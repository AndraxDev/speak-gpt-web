import React from 'react';
import {MaterialEditText} from "../widgets/MaterialEditText";
import {MaterialButton24, MaterialButtonOutlined24} from "../widgets/MaterialButton";

function ApiKeyChangeDialog(props) {
    const [apiKey, setApiKey] = React.useState("");

    const saveApiKey = () => {
        if (apiKey !== "") {
            localStorage.setItem('apiKey', apiKey);
            props.setIsOpen(false);
        }
    }

    return (
        <div className={"dialog-backdrop"} onMouseDown={() => {
            props.setIsOpen(false);
        }}>
            <div className={"dialog-paper"} onMouseDown={(e) => {
                e.stopPropagation()
            }}>
                <h3 className={"dialog-title"}>Change API Key</h3>
                <MaterialEditText label="API Key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
                <div className={"dialog-actions"}>
                    <MaterialButtonOutlined24 onClick={() => {
                        props.setIsOpen(false);
                    }}>Cancel</MaterialButtonOutlined24>
                    &nbsp;&nbsp;&nbsp;
                    <MaterialButton24 onClick={saveApiKey}>Save</MaterialButton24>
                </div>
            </div>
        </div>
    );
}

export default ApiKeyChangeDialog;