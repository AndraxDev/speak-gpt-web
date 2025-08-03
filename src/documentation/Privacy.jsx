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
> This page describes which data we use and why.

## Data we do not collect

- Chats list
- Conversations content
- Audio samples of your voice
- API keys

> This info is securely stored on your device, but it might be sent to OpenAI (or other API providers selected by you) to provide basic functionality. We don't store this info on our servers. To learn more about how your data is used, refer to the Privacy Policy of the API provider you are using.

---

## Optional data we may collect

- Installation ID*
- Crash logs
- Advertising ID
- Device info (mode, OS version, etc)

> This info is used for analytical purposes only. We do not share this info with third-party organizations. This info is collected only when &quot;Usage and diagnostics&quot; feature is enabled. You can also send this info manually. You are able to delete this info from our servers, reset or/and delete installation ID. You can also revoke authorization to use this data without losing access to the app.

---

## Required data we collect

- Name
- User-generated content**

> This data is required for function &quot;Prompts store&quot;. We do not collect this data unless you published a prompt. You can still delete this data by reporting a prompt or contacting us via admin@teslasoft.org. This data is stored permanently unless you request your data to be deleted. This data can be accessed by other users.

---

## Data sharing

- When you use our services, we may share your conversations with AI providers you selected. Some providers may store your conversation for a limited time to improve their models. We do not have access to this data and we do not store it on our servers. To learn more about how your data is used, refer to the Privacy Policy of the API provider you are using.
- Some of AI providers may also store your data indefinitely due to legal holds. And example is OpenAI which received lawsuit from the New Your Times and now has to store all of user data regardless of the laws and their own policies (Except Enterprise and Edu versions or Zero data retention agreements).

---

> *. When you install this app an installation ID will be created. This id is a random UUID string and it does not belong to Android id or any of hardware IDs. You can either reset or delete installation ID. In this case we will stop to collect data associated with installation ID.

> **. User-generated content is all content created and published by users using this app. We may review public content for violations and remove inappropriate content. We don't have access to private content (like chats list, conversations, etc). User-generated content term doesn't include your chat list, chat content or app preferences.

Learn how to delete your data here: [Delete my data](/data/delete)
`;

function Privacy() {
    return (
        <DocPage title={"Privacy Policy"}>
            {pageContent}
        </DocPage>
    );
}

export default Privacy;