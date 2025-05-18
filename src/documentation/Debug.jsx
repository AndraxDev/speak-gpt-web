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
import DocPage from "../components/DocPage";

const pageContent = `
Supported app links:

[https://assistant.teslasoft.org/chat](https://assistant.teslasoft.org/chat)

[https://assistant.teslasoft.org/prompts/vswPyF3848](https://assistant.teslasoft.org/prompts/vswPyF3848)

[https://assistant.teslasoft.org/assistant](https://assistant.teslasoft.org/assistant)

> If these links are pointing you to a web pages instead of app or you have 404 error, please make sure you have installed SpeakGPT version 3.21 or newer and opening supported links is permitted for this app.
`;

function Debug() {
    return (
        <DocPage title={"Debug"}>
            {pageContent}
        </DocPage>
    );
}

export default Debug;
