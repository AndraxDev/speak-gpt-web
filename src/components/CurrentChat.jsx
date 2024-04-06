import React, {useEffect} from 'react';
import {MaterialButtonTonal} from "../widgets/MaterialButton";
import Message from "./Message";
import OpenAI from "openai";
import {sha256} from "js-sha256";

function CurrentChat({chats, id, chatName}) {
    const [conversation, setConversation] = React.useState([]);
    const [lockedState, setLockedState] = React.useState(false);
    const [stateSelectedChat, setStateSelectedChat] = React.useState(chatName);

    useEffect(() => {
        chats.forEach((e) => {
            if (sha256(e.title) === id) {
                setStateSelectedChat(e.title);
            }
        });

        if (id === undefined) {
            setStateSelectedChat("");
        }
    }, [id, chatName]);

    useEffect(() => {
        if (stateSelectedChat === "") {
            setConversation([]);
            return;
        }
        setConversation(localStorage.getItem(sha256(stateSelectedChat)) !== null ? JSON.parse(localStorage.getItem(sha256(stateSelectedChat))) : []);
    }, [stateSelectedChat]);

    const prepareConversation = (messages) => {
        const msgs = [];

        messages.forEach((e) => {
            msgs.push({
                content: e.message,
                role: e.isBot ? "assistant" : "user"
            });
        });

        return msgs;
    }

    const sendAIRequest = async (messages) => {
        const openai = new OpenAI({
            apiKey: localStorage.getItem("apiKey"),
            dangerouslyAllowBrowser: true
        });

        const chatCompletion = await openai.chat.completions.create({
            messages: messages,
            model: "gpt-4-turbo-preview",
            stream: true,
        });

        const m = conversation;

        m.push({
            message: "",
            isBot: true
        });

        setConversation([...m]);
        localStorage.setItem(sha256(stateSelectedChat), JSON.stringify(m));

        for await (const chunk of chatCompletion) {
            const r = chunk.choices[0].delta;

            const m = conversation;

            if (chunk.choices[0] !== undefined && chunk.choices[0].delta !== undefined && r !== undefined && chunk.choices[0].delta.content !== undefined) {
                m[m.length - 1].message += r.content;

                setConversation([...m]);
                localStorage.setItem(sha256(stateSelectedChat), JSON.stringify(m));
            }
        }

        return "";
    }

    const processRequest = () => {
        if (lockedState) {
            return;
        }

        const messages = conversation;

        setLockedState(true);
        messages.push({
            message: document.querySelector(".chat-textarea").value,
            isBot: false
        });

        document.querySelector(".chat-textarea").value = "";

        setConversation([...messages]);
        localStorage.setItem(sha256(stateSelectedChat), JSON.stringify(messages));

        sendAIRequest(prepareConversation(messages)).then(r => {
            setLockedState(false);
        });
    }

    return (
        <div className={"chat-frame"}>
            <div className={"chat-area"}>
                <div className={"chat-history"}>
                    <h3 className={"chat-title"}>{stateSelectedChat}</h3>
                    <div>
                        {
                            conversation.map((e, i) => {
                                return (
                                    <Message key={i} isBot={e.isBot} message={e.message}/>
                                )
                            })
                        }
                    </div>
                </div>
                <div className={"write-bar"}>
                    <textarea className={"chat-textarea"} placeholder={"Start typing here..."}/>
                    <div>
                        <MaterialButtonTonal className={"chat-send"} onClick={() => {
                            processRequest();
                        }}><span
                            className={"material-symbols-outlined"}>send</span></MaterialButtonTonal>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CurrentChat;