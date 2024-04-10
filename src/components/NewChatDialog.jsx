import React, {useEffect} from 'react';
import {MaterialEditText} from "../widgets/MaterialEditText";
import {MaterialButton24, MaterialButtonOutlined24} from "../widgets/MaterialButton";

function NewChatDialog({chatName, setChatName, invalidState, invalidMessage, setChatDialogOpen, isEdit, chatModel, setIsEditing, ...props}) {
    const [tempChatName, setTempChatName] = React.useState("");

    useEffect(() => {
        setTempChatName(chatName);
    }, [chatName]);

    return (
        <div className={"dialog-backdrop"} onMouseDown={() => {
            setChatDialogOpen(false);
        }}>
            <div className={"dialog-paper"} onMouseDown={(e) => {
                e.stopPropagation();
            }}>
                <h3 className={"dialog-title"}>{isEdit ? "Edit chat" : "New chat"}</h3>
                <MaterialEditText label={"Chat name"} defaultValue={chatName} helperText={chatName === "" || tempChatName === "" || invalidMessage !== "Please enter chat name." ? invalidMessage : ""} onChange={(e) => {
                    setTempChatName(e.target.value);
                }}/>
                <div className={"dialog-actions"}>
                    <MaterialButtonOutlined24 onClick={() => {
                        setChatDialogOpen(false);
                    }}>Cancel</MaterialButtonOutlined24>
                    &nbsp;&nbsp;&nbsp;
                    <MaterialButton24 onClick={() => {
                        setIsEditing(isEdit);
                        setChatName(tempChatName);
                    }}>{isEdit ? "Save" : "Create"}</MaterialButton24>
                </div>
            </div>
        </div>
    );
}

export default NewChatDialog;
