/****************************************************************
 * Copyright (c) 2023-2024 Dmytro Ostapenko. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *****************************************************************/

import React from 'react';
import {Route, Routes} from "react-router-dom";
import MaterialWindow from "./components/MaterialWindow";
import ChatList from "./components/ChatList";
import WelcomePage from "./components/WelcomePage";
import PromptStore from "./components/PromptStore";
import Tips from "./components/Tips";
import AssistantEmbedded from "./components/AssistantEmbedded";
import AssistantMobile from "./components/AssistantMobile";
import NotFound from "./components/NotFound";
import Changelog from "./components/Changelog";
import Privacy from "./documentation/Privacy";
import Terms from "./documentation/Terms";
import ApiSafety from "./documentation/ApiSafety";
import FAQ from "./documentation/FAQ";
import Contact from "./documentation/Contact";
import Debug from "./documentation/Debug";
import DeleteData from "./documentation/DeleteData";

function BaseRoutes() {
    return (
        <Routes>
            <Route path="/" element={
                <WelcomePage/>
            } exact />
            <Route path="/changelog" element={
                <MaterialWindow page={"changelog"}>
                    <Changelog/>
                </MaterialWindow>
            } exact />
            <Route path="/data/delete" element={
                <MaterialWindow page={"delete_data"}>
                    <DeleteData/>
                </MaterialWindow>
            } exact />
            <Route path="/privacy" element={
                <MaterialWindow page={"privacy"}>
                    <Privacy/>
                </MaterialWindow>
            } exact />
            <Route path="/debug" element={
                <MaterialWindow page={"debug"}>
                    <Debug/>
                </MaterialWindow>
            } exact />
            <Route path="/terms" element={
                <MaterialWindow page={"terms"}>
                    <Terms/>
                </MaterialWindow>
            } exact />
            <Route path="/api/safety" element={
                <MaterialWindow page={"api_safety"}>
                    <ApiSafety/>
                </MaterialWindow>
            } exact />
            <Route path="/faq" element={
                <MaterialWindow page={"faq"}>
                    <FAQ/>
                </MaterialWindow>
            } exact />
            <Route path="/contact" element={
                <MaterialWindow page={"contact"}>
                    <Contact/>
                </MaterialWindow>
            } exact />
            <Route path="/chat" element={
                <MaterialWindow page={"chat"}>
                    <ChatList/>
                </MaterialWindow>
            } exact />
            <Route path="/assistant/mobile" element={
                <AssistantMobile/>
            } exact />

            <Route path="/embedded" element={
                <AssistantEmbedded/>
            } exact />
            <Route path="/prompts" element={
                <MaterialWindow page={"prompts"}>
                    <PromptStore/>
                </MaterialWindow>
            } exact />
            <Route path="/prompts/:id" element={
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
            <Route path="/embedded/:payload" element={
                <AssistantEmbedded/>
            } />
            <Route path="*" element={
                <MaterialWindow page={"not_found"}>
                    <NotFound/>
                </MaterialWindow>
            } />
        </Routes>
    );
}

export default BaseRoutes;
