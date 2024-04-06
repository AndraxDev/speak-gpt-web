import React from 'react';
import NavigationBarItem from "./NavigationBarItem";

function NavigationBar({page}) {
    return (
        <div className={"nav-bar"}>
            <NavigationBarItem name="Chat" icon="chat" isActive={page === "chat"} page={"/chat"}/>
            <NavigationBarItem name="Prompts" icon="apps" isActive={page === "prompts"} page={"/prompts"}/>
            <NavigationBarItem name="Tips" icon="lightbulb" isActive={page === "tips"} page={"/tips"}/>
        </div>
    );
}

export default NavigationBar;
