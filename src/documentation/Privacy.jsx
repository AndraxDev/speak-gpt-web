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

## Data we do not collect in any case:

- Chats list
- Conversations content
- Audio samples of your voice
- API keys and other API settings information

> This info is securely stored on your device, but it might be sent to OpenAI (or other API providers selected by you) to provide basic functionality. We don't store this info on our servers. To learn more about how your data is used, refer to the Privacy Policy of the API provider you are using.

---

## Optional data we may collect in exclusive cases:

- Installation ID*
- Crash logs
- Device info (mode, OS version, etc)

### This data is collected only in these cases:

- You post a prompt (we identify your device to prevent abuse and spam)
- You intentionally sent a bug report
- You intentionally shared this info with developer to troubleshoot an issue
- You are a member of Teslasoft organization and you are using an internal test version of the app

> Analytics has been removed in the latest version. Additionally, no ads are present in the app (were removed in the last versions). Because previous versions contained ads and used AD id, Google Play may show "Contain ads" label on the app page.

---

## When you post a prompt we may also collect the following info:

- Your name (it will be shown as author name near to the prompt). Nicknames are allowed.
- Information about prompt you publish. THis includes prompt text, description, and other metadata.

> This data is required for function &quot;Prompts Library&quot;. We do not collect this data unless you published a prompt. You can still delete this data by reporting a prompt or contacting us via admin@teslasoft.org. This data is stored permanently unless you request your data to be deleted. This data can be accessed by other users.

---

## Data sharing

- When you use our services, we may share your conversations with AI providers you selected. Some providers may store your conversation for a limited time to improve their models and ensure AI is used safely and responsibly. We do not have access to this data and we do not store it on our servers. To learn more about how your data is used, refer to the Privacy Policy of the API provider you are using.
- Some of AI providers may also store your data indefinitely due to legal holds. An example is OpenAI, which received lawsuit from the New Your Times and now has to store all of user data regardless of the laws and their own policies (Except Enterprise and Edu versions or Zero data retention agreements).

---

> \\* When you install this app an installation ID will be created. This id is a random UUID string and it does not belong to Android id or any of hardware IDs. You can either reset or delete installation ID. In this case we will stop to collect data associated with installation ID.

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