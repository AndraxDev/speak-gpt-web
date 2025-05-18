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
import {Link} from "react-router-dom";
import {BrowserView, MobileView} from "react-device-detect";

function NavigationBarItem({name, icon, isActive, page}) {
    return (
        <>
            <MobileView>
                <Link className={"nav-item-mob"} to={page}>
                <div className={isActive ? "nav-item-selected-container-mob" : "nav-item-unselected-container-mob"}>
                    <div className={isActive ? "nav-item-selected-mob" : "nav-item-unselected-mob"}>
                        <span style={{
                            fontSize: "22px"
                        }} className="material-symbols-outlined">{icon}</span>
                    </div>
                </div>
                <p className={"nav-item-title-mob"}>{name}</p>
                </Link>
            </MobileView>
            <BrowserView>
                <Link className={"nav-item"} to={page}>
                <div className={isActive ? "nav-item-selected-container" : "nav-item-unselected-container"}>
                    <div className={isActive ? "nav-item-selected" : "nav-item-unselected"}>
                        <span style={{
                            fontSize: "22px"
                        }} className="material-symbols-outlined">{icon}</span>
                    </div>
                </div>
                <p className={"nav-item-title"}>{name}</p>
                </Link>
            </BrowserView>
        </>
    );
}

export default NavigationBarItem;