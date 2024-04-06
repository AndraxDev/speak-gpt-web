import React from 'react';
import {Route, Routes} from "react-router-dom";
import MaterialWindow from "./components/MaterialWindow";
import ChatList from "./components/ChatList";
import WelcomePage from "./components/WelcomePage";
import PromptStore from "./components/PromptStore";
import Tips from "./components/Tips";
import Chat from "./components/Chat";
import PromptView from "./components/PromptView";

function BaseRoutes(props) {
    return (
        <Routes>
            <Route path="/" element={
                <WelcomePage/>
            } exact />
            <Route path="/chat" element={
                <MaterialWindow page={"chat"}>
                    <ChatList/>
                </MaterialWindow>
            } exact />
            <Route path="/prompts" element={
                <MaterialWindow page={"prompts"}>
                    <PromptStore/>
                </MaterialWindow>
            } exact />
            <Route path="/tips" element={
                <MaterialWindow page={"tips"}>
                    <Tips/>
                </MaterialWindow>
            } exact />
            <Route path="/chat/:id" element={
                <MaterialWindow page={"chat"}>
                    <ChatList/>
                </MaterialWindow>
            } />
            <Route path="/prompts/:id" element={
                <MaterialWindow page={"prompts"}>
                    <PromptView/>
                </MaterialWindow>
            } />
        </Routes>
    );
}

export default BaseRoutes;
