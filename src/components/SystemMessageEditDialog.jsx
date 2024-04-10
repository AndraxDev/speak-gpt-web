import React from 'react';
import {MaterialEditText} from "../widgets/MaterialEditText";
import {MaterialButton24, MaterialButtonOutlined24} from "../widgets/MaterialButton";

function SystemMessageEditDialog({setIsOpen, message, setMessage}) {

    const [currentMessage, setCurrentMessage] = React.useState(message);

    return (
        <div className={"dialog-backdrop"} onMouseDown={() => {
            setIsOpen(false);
        }}>
            <div className={"dialog-paper"} onMouseDown={(e) => {
                e.stopPropagation()
            }}>
                <h3 className={"dialog-title"}>Edit system message</h3>
                <MaterialEditText label="System message" defaultValue={message} onChange={(e) => {
                    setCurrentMessage(e.target.value);
                }}/>
                <div className={"dialog-actions"}>
                    <MaterialButtonOutlined24 onClick={() => {
                        setIsOpen(false);
                    }}>Cancel</MaterialButtonOutlined24>
                    &nbsp;&nbsp;&nbsp;
                    <MaterialButton24 onClick={() => {
                        setMessage(currentMessage)
                        setIsOpen(false);
                    }}>Save</MaterialButton24>
                </div>
            </div>
        </div>
    );
}

export default SystemMessageEditDialog;