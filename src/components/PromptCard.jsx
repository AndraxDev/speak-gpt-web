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

import {isMobile} from "react-device-detect";

function PromptCard({prompt, onPromptClick}) {
    return (
        <div className={(isMobile ? "card-mob" : "card") + " cat-" + prompt.category} onClick={() => {
            onPromptClick();
        }}>
            <p className={"card-first-line"}>{prompt.name}</p>
            <p className={"card-second-line"}>{prompt.desc}</p>
            <div className={"card-third-line"}><p className={"card-author"}>{prompt.author}</p><div className={"like"}><span style={{
                paddingTop: "2px"
            }}>{prompt.likes}</span>&nbsp;&nbsp;<span
                className={"material-symbols-outlined"}>thumb_up</span></div>
            </div>
        </div>
    );
}

export default PromptCard;