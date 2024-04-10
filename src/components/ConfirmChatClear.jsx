import React from 'react';
import {MaterialButton24, MaterialButtonOutlined24} from "../widgets/MaterialButton";

function ConfirmChatClear({setOpenState, confirm}) {
    return (
        <div className={"dialog-backdrop"} onMouseDown={() => {
            confirm(false);
            setOpenState(false);
        }}>
            <div className={"dialog-paper"} onMouseDown={(e) => {
                e.stopPropagation();
            }}>
                <h3 className={"dialog-title"}>Clear chat</h3>
                <p className={"dialog-content"}>Are you sure you want to clear this chat?</p>
                <div className={"dialog-actions"}>
                    <MaterialButtonOutlined24 onClick={() => {
                        confirm(false);
                        setOpenState(false);
                    }}>Cancel</MaterialButtonOutlined24>
                    &nbsp;&nbsp;&nbsp;
                    <MaterialButton24 onClick={() => {
                        confirm(true);
                        setOpenState(false);
                    }}>Delete</MaterialButton24>
                </div>
            </div>
        </div>
    );
}

export default ConfirmChatClear;