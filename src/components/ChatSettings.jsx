import React from 'react';
import Tile from "./Tile"
import packageJson from '../../package.json';

function ChatSettings({chatId, setIsOpen, apiDialogOpen, setDalleVersion, dalle3, model, openModelDialog, openResolutionDialog, openSystemMessageDialog, systemMessage, resolution}) {
    return (
        <div className={"dialog-backdrop"} onMouseDown={() => {
            setIsOpen(false);
        }}>

            <div className={"dialog-paper-settings"} onMouseDown={(e) => {
                e.stopPropagation();
            }}>
                <h3 className={"dialog-title-settings"}>Chat settings</h3>
                <div className={"tiles"}>
                    <Tile clickAction={() => {
                        window.open("https://platform.openai.com/account", "_blank")
                    }} icon={"account_circle"} title={"Account"} subtitle={"Manage OpenAI account"}
                          description={"Lorem ipsum dolor sit amet."} checkable={false} checked={false}/>
                    <Tile clickAction={() => {
                        apiDialogOpen(true);
                    }} icon={"key"} title={"API key"} subtitle={"Set API key"}
                          description={"Lorem ipsum dolor sit amet."} checkable={false} checked={false}/>
                    <Tile clickAction={() => {
                        openModelDialog(true);
                    }} icon={"key"} title={"AI model"} subtitle={model}
                          description={"Lorem ipsum dolor sit amet."} checkable={false} checked={false}/>
                    <Tile clickAction={() => {
                        openSystemMessageDialog(true);
                    }} icon={"key"} title={"System message"} subtitle={"Click to set"}
                          description={"Lorem ipsum dolor sit amet."} checkable={false} checked={false}/>
                    <Tile icon={"key"} title={"Use DALL-e 3"} subtitle={dalle3 ? "DALL-e 3 is using" : "DALL-e 2 is using"}
                          description={"Lorem ipsum dolor sit amet."} checkable={true} checked={dalle3} setChecked={setDalleVersion}/>
                    <Tile clickAction={() => {
                        openResolutionDialog(true);
                    }} icon={"key"} title={"Image resolution"} subtitle={resolution}
                          description={"Lorem ipsum dolor sit amet."} checkable={false} checked={false}/>
                </div>
                <p className={"credits"}>Software version: {packageJson.name + " " + packageJson.version}</p>
                <p className={"credits"}>Copyright: (C) 2024 <a href={"https://andrax.dev/"} target={"_blank"}>AndraxDev</a>. All rights reserved.</p>
                <br/>
            </div>
        </div>
    );
}

export default ChatSettings;