import React, {useEffect} from 'react';
import gpt from "./../gpt.svg";
import {Link} from "react-router-dom";

function ChatItem({name, id, model, type, isActive, setDeleteChat, setEditChat, setIsDelete, setIsEdit, ...props}) {

    const [intType, setIntType] = React.useState(0);

    useEffect(() => {
        if (type === "GPT 3.5") {
            setIntType(1);
        } else if (type === "GPT 4 Turbo") {
            setIntType(2);
        } else if (type === "GPT 4") {
            setIntType(3);
        } else if (type === "FT") {
            setIntType(4);
        } else if (type === "GPT 3.5 (0125)") {
            setIntType(5);
        }
    }, [type]);

    return (
        <Link to={"/chat/" + id} style={{
            textDecoration: 'none',
            color: 'inherit'
        }}>
            <div className={isActive ? "chat-item-active-" + intType.toString() + " chat-item" : "chat-item-" + intType.toString() + " chat-item"}>
                <div className={"chat-icon-frame-" + intType.toString() + " chat-icon-frame"}>
                    <img className={"chat-icon"} src={gpt} alt={"GPT"}/>
                </div>
                <div className={"chat-item-info"}>
                    <h3 className={"chat-item-title"}>{name}</h3>
                    <p className={"chat-item-model"}>{model}</p>
                </div>
                <div className={"chat-actions"}><span onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setIsEdit(true)
                    setEditChat(name)
                    setDeleteChat("")
                }} className={"action material-symbols-outlined"}>edit</span>&nbsp;<span onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setIsDelete(true)
                    setDeleteChat(name)
                    setEditChat("")
                }} className={"action-dangerous material-symbols-outlined"}>cancel</span></div>
            </div>
        </Link>
    );
}

export default ChatItem;
