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
import DocPage from "../components/DocPage";

const pageContent = `
> This page describes which data we use and why.

## Data we DO NOT collect

- Chats list
- Conversations content
- Audio samples of your voice
- API keys

> This info is securely stored on your device and encrypted with a military-grade encryption (AES-256-GCM), but it might be sent to OpenAI (or other API providers selected by you) to provide basic functionality. We don't store this info on our servers. To learn more about how your data is used, refer to the Privacy Policy of the API provider you are using.

---

## Optional data we may collect

> No optional data is collected. SpeakGPT Lite does not contain any proprietary services, online features or analytics.

---

## Required data we collect

> No required data is collected. SpeakGPT Lite does not contain any proprietary services, online features or analytics. SpeakGPT Lite does not contain Prompt Library so you cannot interact with it through this app.

---

Learn how to delete your data here: [Delete my data](/data/delete)
`;

function Privacy() {
    return (
        <DocPage title={"Privacy Policy for SpeakGPT Lite"}>
            {pageContent}
        </DocPage>
    );
}

export default Privacy;