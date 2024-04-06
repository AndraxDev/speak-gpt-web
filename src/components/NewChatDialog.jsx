import React from 'react';
import {MaterialEditText} from "../widgets/MaterialEditText";
import {MaterialButton24, MaterialButtonOutlined24} from "../widgets/MaterialButton";

function NewChatDialog({chatName, setChatName, invalidState, invalidMessage, setChatDialogOpen, isEdit, chatModel, setChatModel, setIsEditing, ...props}) {
    const [tempChatName, setTempChatName] = React.useState("");
    const [tempChatModel, setTempChatModel] = React.useState(chatModel);
    return (
        <div className={"dialog-backdrop"} onMouseDown={() => {
            setChatDialogOpen(false);
        }}>
            <div className={"dialog-paper"} onMouseDown={(e) => {
                e.stopPropagation();
            }}>
                <h3 className={"dialog-title"}>{isEdit ? "Edit chat" : "New chat"}</h3>
                <MaterialEditText label={"Chat name"} defaultValue={chatName} helperText={tempChatName === "" || invalidMessage !== "Please enter chat name." ? invalidMessage : ""} onChange={(e) => {
                    setTempChatName(e.target.value);
                }}/>
                <br/>
                <MaterialEditText label={"AI model"} defaultValue={chatModel} onChange={(e) => {
                    setTempChatModel(e.target.value);
                }}/>
                <div className={"dialog-actions"}>
                    <MaterialButtonOutlined24 onClick={() => {
                        setChatDialogOpen(false);
                    }}>Cancel</MaterialButtonOutlined24>
                    &nbsp;&nbsp;&nbsp;
                    <MaterialButton24 onClick={() => {
                        setIsEditing(isEdit);
                        setChatModel(tempChatModel);
                        setChatName(tempChatName);
                    }}>{isEdit ? "Save" : "Create"}</MaterialButton24>
                </div>
            </div>
        </div>
    );
}

export default NewChatDialog;
