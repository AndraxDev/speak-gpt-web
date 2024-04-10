import React from 'react';
import Tile from "./Tile";

function ChatSettings({chatId, setIsOpen}) {

    const [tile1Checked, setTile1Checked] = React.useState(false);
    const [tile2Checked, setTile2Checked] = React.useState(false);
    const [tile3Checked, setTile3Checked] = React.useState(false);

    return (
        <div className={"dialog-backdrop"} onMouseDown={() => {
            setIsOpen(false);
        }}>
            <div className={"dialog-paper-settings"} onMouseDown={(e) => {
                e.stopPropagation();
            }}>
                <h3 className={"dialog-title-settings"}>Chat settings</h3>
                <div className={"tiles"}>
                    <Tile icon={"experiment"} title={"Title"} subtitle={"Subtitle"} description={"Lorem ipsum dolor sit amet."} checkable={true} checked={false} setChecked={setTile1Checked}/>
                    <Tile icon={"experiment"} title={"Title"} subtitle={"Subtitle"} description={"Lorem ipsum dolor sit amet."} checkable={true} checked={false} setChecked={setTile2Checked}/>
                    <Tile icon={"experiment"} title={"Title"} subtitle={"Subtitle"} description={"Lorem ipsum dolor sit amet."} checkable={true} checked={false} setChecked={setTile3Checked}/>
                </div>

            </div>
        </div>
    );
}

export default ChatSettings;