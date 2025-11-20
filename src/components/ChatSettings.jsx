/****************************************************************
 * Copyright (c) 2023-2025 Dmytro Ostapenko. All rights reserved.
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
import {BrowserView, isMobile, MobileView} from "react-device-detect";
import {MaterialButtonTonalIconV2} from "../widgets/MaterialButton";
import ApiHostChangeDialog from "./ApiHostChangeDialog";
import ApiEndpointSelector from "./ApiEndpointSelector";
import {getApiEndpointId, getGlobalEndpointId, setApiEndpointId, setGlobalEndpointId} from "../util/Settings";
import {MaterialDialog} from "./MaterialDialog";
import AccountCircle from "@mui/icons-material/AccountCircle";
import CancelRounded from "@mui/icons-material/CancelRounded";
import Lan from "@mui/icons-material/Lan";
import Photo from "@mui/icons-material/Photo";
import PhotoSizeSelectActual from "@mui/icons-material/PhotoSizeSelectActual";
import SmartToyRounded from "@mui/icons-material/SmartToyRounded";
import TextFormatRounded from "@mui/icons-material/TextFormatRounded";

function setFullHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Set the height initially
setFullHeight();

// Re-calculate on resize or orientation change
window.addEventListener('resize', setFullHeight);
window.addEventListener('orientationchange', setFullHeight);

function ChatSettings({chatId, setIsOpen, setDalleVersion, dalle3, model, openModelDialog, openResolutionDialog, openSystemMessageDialog, systemMessage, resolution, isAssistant, openImageModelDialog, imageModel}) {
    const [apiHostDialogOpen, setApiHostDialogOpen] = React.useState(false);
    const [apiEndpointSelector, setApiEndpointSelector] = React.useState(false);

    const SettingsComponent = () => {
        return (
            <div style={isMobile ? {
                height: "100dvh",
            } : {}} className={isMobile ? "dialog-paper-settings-mob" : "dialog-paper-settings"}
                 onMouseDown={(e) => {
                     e.stopPropagation();
                 }}>
                <h3 className={"dialog-title-settings"}>Chat settings</h3>
                <div className={isMobile ? "tiles-mob" : "tiles"}>
                    <Tile clickAction={() => {
                        window.open("https://platform.openai.com/account", "_blank")
                    }} icon={<AccountCircle/>} title={"Account"} subtitle={"Manage OpenAI account"}
                          description={"Lorem ipsum dolor sit amet."} checkable={false} checked={false}/>
                    <Tile clickAction={() => {
                        setApiEndpointSelector(true);
                    }} icon={<Lan/>} title={"API Endpoint"} subtitle={"Click to set"}
                          description={"Lorem ipsum dolor sit amet."} checkable={false} checked={false}/>
                    <Tile clickAction={() => {
                        openModelDialog(true);
                    }} icon={<SmartToyRounded/>} title={"AI model"} subtitle={model}
                          description={"Lorem ipsum dolor sit amet."} checkable={false} checked={false}/>
                    <Tile clickAction={() => {
                        openSystemMessageDialog(true);
                    }} icon={<TextFormatRounded/>} title={"System message"} subtitle={"Click to set"}
                          description={"Lorem ipsum dolor sit amet."} checkable={false} checked={false}/>
                    <Tile clickAction={() => {
                        console.log("Open image model dialog");
                        openImageModelDialog(true);
                    }} icon={<Photo/>} title={"Image generation model"} subtitle={imageModel}
                          description={"Lorem ipsum dolor sit amet."} checkable={false} checked={false}/>
                    <Tile clickAction={() => {
                        openResolutionDialog(true);
                    }} icon={<PhotoSizeSelectActual/>} title={"Image resolution"} subtitle={resolution}
                          description={"Lorem ipsum dolor sit amet."} checkable={false} checked={false}/>
                </div>
                <p style={{
                    marginBottom: "4px"
                }} className={"credits"}>App Version: {packageJson.name + "-" + packageJson.version}</p>
                <p className={"credits"}>© 2023-2025 <a href={"https://andrax.dev/"}
                                                        target={"_blank"} rel="noreferrer">AndraxDev</a>. All rights
                    reserved.</p>
                <br/>
            </div>
        )
    }

    return (
        <>
            <MobileView>
                <div className={"back-button-priority-1"}>
                    <MaterialButtonTonalIconV2 onClick={() => setIsOpen(false)}><span
                        className={"material-symbols-outlined"}><CancelRounded/></span></MaterialButtonTonalIconV2>
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
                <BrowserView>
                    {isAssistant ? <SettingsComponent /> : <MaterialDialog open={true}>
                        <SettingsComponent/>
                    </MaterialDialog>}
                </BrowserView>
                <MobileView>
                    <SettingsComponent/>
                </MobileView>
            </div>
        </>
    );
}

export default ChatSettings;