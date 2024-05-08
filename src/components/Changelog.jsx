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
import DocPage from "./DocPage";

const pageContent = `
> This version of SpeakGPT is currently experimental. You can try it before official release. Be careful as some rough edges may appear.

## 1.4.0
- Added AI photo editor

## 1.3.0
- Added AI playground

## 1.2.0
- Fixed /imagine command

## 1.1.0
- Updated features list

## 1.0.0-rc6
- Added documentation and legal pages
- Now you will no longer see API key dialog on the main screen. API key dialog will be shown only when you need to enter API key to perform API-restricted actions.
- Fixed Markdown lists appearance

## 1.0.0-rc5
- Added support for app and deep links

## 1.0.0-rc4
- Added first message in chat list

## 1.0.0-rc3
- Improved mobile UI

## 1.0.0-rc2
- Bugfix

## 1.0.0-rc1
- Mobile version

## 0.9.0-beta09
- Personalize embedded assistants with icon and description


## 0.8.0-beta08
- Customize embedded assistants with payload

## 0.7.0-beta07
- Embedded assistant chats are now saved

## 0.6.0-beta06
- Assistant message bar autofocus

## 0.5.0-beta05
- Small fixes

## 0.4.0-beta04
- Added mobile assistant

## 0.3.0-beta03
- Minor fixes

## 0.2.0-beta02
- Added embedded assistant

## 0.1.1-beta01
- Minor fixes

## 0.1.0-beta01
- First public beta release.
- Improved images upload.

## 0.0.14-alpha14
- Finished Prompts Store.
- Added Quick Assistant.

## 0.0.13-alpha13
- UI improvements.

## 0.0.12-alpha12
- Added code highlighting form more programming languages.

## 0.0.11-alpha11
- Now you can unset your API key and skip API key setup.
- Added full list of available models

## 0.0.10-alpha10
- Search chat added
- Tips page added

## 0.0.9-alpha9
- Minor bugs fixed

## 0.0.8-alpha8
- Implemented GPT 4 Vision
- Chats settings are now take effect

## 0.0.7-alpha7
- Added chat settings

## 0.0.6-alpha6
- Added ability to clear chats
- Bugs fixed

## 0.0.5-alpha5
- Minor bugs fixed

## 0.0.4-alpha4
- Added code highlighting
- Minor improvements

## 0.0.3-alpha3
- Added image generation.
- Fixed minor bugs.

## 0.0.2-alpha2
- Changed chats location. Chats are now located in the indexed DB. We're preparing for image generation and chats import/export. You might also noticed that you chats has gone. Open Developers Tools > Console and put command localStorage.chatId, where chatId is a sha256 hash of the chat name to recover a chat. You can load chat as JSON in SpeakGPT mobile app now. Web version will receive this feature soon.
- Added autoscroll in chats.

## 0.0.1-alpha1
- Initial release.
- You can create multiple chats.
- You can select different AI models.

`;

function WelcomePage() {
    return (
        <DocPage title={"Changelog"}>
            {pageContent}
        </DocPage>
    );
}

export default WelcomePage;
