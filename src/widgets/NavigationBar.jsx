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
import NavigationBarItem from "./NavigationBarItem";
import {MaterialButton16} from "./MaterialButton";
import {Tooltip} from "@mui/material";

function NavigationBar({page, openAssistant}) {
    return (
        <div className={"nav-bar"}>
            <Tooltip title="Launch Quick Assistant" placement="right">
                <MaterialButton16 sx={{
                    height: "64px",
                    width: "64px",
                    padding: "0",
                }} className={"fab"} onClick={() => {
                    openAssistant();
                }}><span className={"material-symbols-outlined"}>group_work</span></MaterialButton16>
            </Tooltip>
            <br/>
            <NavigationBarItem name="Chat" icon="chat" isActive={page === "chat"} page={"/chat"}/>
            <NavigationBarItem name="Prompts" icon="apps" isActive={page === "prompts"} page={"/prompts"}/>
            <NavigationBarItem name="Tips" icon="lightbulb" isActive={page === "tips"} page={"/tips"}/>
        </div>
    );
}

export default NavigationBar;
