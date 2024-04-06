import React from 'react';
import {MaterialButton24, MaterialButtonOutlined24} from "../widgets/MaterialButton";

function DeleteChatDialog({setOpenState, chatName, setChatName, ...props}) {
    return (
        <div className={"dialog-backdrop"} onMouseDown={() => {
            setChatName("");
            setOpenState(false);
        }}>
            <div className={"dialog-paper"} onMouseDown={(e) => {
                e.stopPropagation();
            }}>
                <h3 className={"dialog-title"}>Confirm deletion</h3>
                <p className={"dialog-content"}>Are you sure you want to delete this chat?</p>
                <div className={"dialog-actions"}>
                    <MaterialButtonOutlined24 onClick={() => {
                        setChatName("");
                        setOpenState(false);
                    }}>Cancel</MaterialButtonOutlined24>
                    &nbsp;&nbsp;&nbsp;
                    <MaterialButton24 onClick={() => {
                        setChatName(chatName);
                        setOpenState(false);
                    }}>Delete</MaterialButton24>
                </div>
            </div>
        </div>
    );
}

export default DeleteChatDialog;