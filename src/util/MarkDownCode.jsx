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

import Prism from "../prism.js";

export const linesNumbers = (str) => {
    let lines = str.split("\n").length - 1;

    let l = [];

    for (let i = 0; i < lines; i++) {
        l.push("<span class='line'>" + (i+1) + "</span>");
    }

    return l.join("\n");
}

export const highlightCode = (code, lang, l) => {
    try {
        return Prism.highlight(code, lang, l);
    } catch (e) {
        return null;
    }
}