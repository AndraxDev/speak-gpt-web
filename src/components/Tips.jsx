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
import ProTip from "./ProTip";

const tips = [
    "Start your message with /imagine to generate an image.",
    "Search tricks:\n\nUse \"author:\" " +
    "prefix to search by author.\nUse \"title:\" " +
    "prefix to search by title.\nUse \"id:\" " +
    "prefix to search by id.\nUse \"cat:\" " +
    "prefix to search y category.\nUse \"type:\" " +
    "prefix to search by type.",
    "ChatGPT is stuffy? Try out other models. Sometimes you may get very interesting results.",
    "Only GPT models can remember previous messages. Other models are not optimized for it.",
    "Sometimes some weird or useless features may appear. It because this app is in beta test.",
    "SpeakGPT is too slow? Try to reduce max tokens per output."

]

function Tips(props) {



    return (
        <div>
            <h2 className={"page-title"}>Tips</h2>

            <div className={"tips"}>
                {tips.map((tip, index) => {
                    return (
                        <ProTip key={index} text={tip} />
                    );
                })}
            </div>
        </div>
    );
}

export default Tips;