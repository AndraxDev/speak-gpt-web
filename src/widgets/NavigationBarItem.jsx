import React from 'react';
import {Link} from "react-router-dom";

function NavigationBarItem({name, icon, isActive, page}) {
    return (
        <Link className={"nav-item"} to={page}>
            <div className={isActive ? "nav-item-selected" : "nav-item-unselected"}>
                <span className="material-symbols-outlined">{icon}</span>
            </div>
            <p className={"nav-item-title"}>{name}</p>
        </Link>
    );
}

export default NavigationBarItem;