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
import Tile from "./Tile"
import packageJson from '../../package.json';
import {isMobile, MobileView} from "react-device-detect";
import {MaterialButtonTonalIconV2} from "../widgets/MaterialButton";
import ApiHostChangeDialog from "./ApiHostChangeDialog";
import ApiEndpointSelector from "./ApiEndpointSelector";
import {getApiEndpointId, getGlobalEndpointId, setApiEndpointId, setGlobalEndpointId} from "../util/Settings";

function setFullHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Set the height initially
setFullHeight();

// Re-calculate on resize or orientation change
window.addEventListener('resize', setFullHeight);
window.addEventListener('orientationchange', setFullHeight);

function ChatSettings({chatId, setIsOpen, apiDialogOpen, setDalleVersion, dalle3, model, openModelDialog, openResolutionDialog, openSystemMessageDialog, systemMessage, resolution, isAssistant}) {
    const [apiHostDialogOpen, setApiHostDialogOpen] = React.useState(false);
    const [apiEndpointSelector, setApiEndpointSelector] = React.useState(false);

    return (
        <>
            <MobileView>
                <div className={"back-button-priority-1"}>
                    <MaterialButtonTonalIconV2 onClick={() => setIsOpen(false)}><span
                        className={"material-symbols-outlined"}>cancel</span></MaterialButtonTonalIconV2>
                </div>
            </MobileView>
            <div className={isAssistant ? "dialog-backdrop-assistant" : "dialog-backdrop"} onMouseDown={(e) => {
                e.stopPropagation();
                setIsOpen(false);
            }}>
                {
                    apiEndpointSelector ? <ApiEndpointSelector isOpened={apiEndpointSelector} setIsOpened={setApiEndpointSelector} isAssistant={isAssistant} selectedApiEndpointId={(chatId !== undefined && chatId !== null) ? getApiEndpointId(chatId) : getGlobalEndpointId()} setSelectedApiEndpointId={(endpointId) => {
                        if (chatId !== undefined && chatId !== null) {
                            setApiEndpointId(chatId, endpointId);
                        } else {
                            setGlobalEndpointId(endpointId)
                        }
                    }} /> : null
                }
                {
                    apiHostDialogOpen ? <ApiHostChangeDialog chatId={chatId} setOpen={setApiHostDialogOpen}/> : null
                }
                <div style={isMobile ? {
                    height: "calc(var(--vh, 1vh) * 100)",
                } : {}} className={isMobile ? "dialog-paper-settings-mob" : "dialog-paper-settings"}
                     onMouseDown={(e) => {
                         e.stopPropagation();
                     }}>
                    <h3 className={"dialog-title-settings"}>Chat settings</h3>
                    <div className={isMobile ? "tiles-mob" : "tiles"}>
                        <Tile clickAction={() => {
                            window.open("https://platform.openai.com/account", "_blank")
                        }} icon={"account_circle"} title={"Account"} subtitle={"Manage OpenAI account"}
                              description={"Lorem ipsum dolor sit amet."} checkable={false} checked={false}/>
                        <Tile clickAction={() => {
                            setApiEndpointSelector(true);
                        }} icon={"lan"} title={"API Endpoint"} subtitle={"Click to set"}
                              description={"Lorem ipsum dolor sit amet."} checkable={false} checked={false}/>
                        <Tile clickAction={() => {
                            openModelDialog(true);
                        }} icon={"key"} title={"AI model"} subtitle={model}
                              description={"Lorem ipsum dolor sit amet."} checkable={false} checked={false}/>
                        <Tile clickAction={() => {
                            openSystemMessageDialog(true);
                        }} icon={"key"} title={"System message"} subtitle={"Click to set"}
                              description={"Lorem ipsum dolor sit amet."} checkable={false} checked={false}/>
                        <Tile icon={"key"} title={"Use DALL-e 3"}
                              subtitle={dalle3 ? "DALL-e 3 is using" : "DALL-e 2 is using"}
                              description={"Lorem ipsum dolor sit amet."} checkable={true} checked={dalle3}
                              setChecked={setDalleVersion}/>
                        <Tile clickAction={() => {
                            openResolutionDialog(true);
                        }} icon={"key"} title={"Image resolution"} subtitle={resolution}
                              description={"Lorem ipsum dolor sit amet."} checkable={false} checked={false}/>
                        {/*<Tile clickAction={() => {*/}
                        {/*    setApiHostDialogOpen(true);*/}
                        {/*}} icon={"lan"} title={"Custom API host"} subtitle={"DEPRECATED"}*/}
                        {/*      description={"Lorem ipsum dolor sit amet."} checkable={false} checked={false}/>*/}
                        {/*<Tile clickAction={() => {*/}
                        {/*    apiDialogOpen(true);*/}
                        {/*}} icon={"key"} title={"API key"} subtitle={"DEPRECATED"}*/}
                        {/*      description={"Lorem ipsum dolor sit amet."} checkable={false} checked={false}/>*/}
                    </div>
                    <p className={"credits"}>Software version: {packageJson.name + " " + packageJson.version}</p>
                    <p className={"credits"}>Copyright: (C) 2024 <a href={"https://andrax.dev/"}
                                                                    target={"_blank"}>AndraxDev</a>. All rights
                        reserved.</p>
                    <br/>
                </div>
            </div>
        </>
    );
}

export default ChatSettings;