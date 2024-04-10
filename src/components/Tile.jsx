import React from 'react';

function Tile({icon, title, subtitle, description, checkable, checked, setChecked}) {
    const [checkedState, setCheckedState] = React.useState(checked);

    return (
        <div onClick={() => {
            if (checkable) {
                setCheckedState(!checkedState);
                setChecked(!checkedState);
            }
        }} className={checkedState ? "tile-bg-active" : "tile-bg"}>
            <div className={"tile-icon-frame"}>
                <span className={"tile-icon material-symbols-outlined"}>{icon}</span>
            </div>
            <div className={"tile-content-frame"}>
                <p className={"tile-title"}> {title}</p>
                <p className={"tile-subtitle"}>{subtitle}</p>
            </div>
        </div>
    );
}

export default Tile;