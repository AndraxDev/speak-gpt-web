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
This page describes some tricks how you can optimize your costs when using SpeakGPT.

## How chat models are billed?

Let's assume the following example chat:

> [System] > System message
>
> [User] > Message 1
>
> [Assistant] > Message 2
>
> [User] > Message 3
>
> [Assistant] > Message 4
>
> [User] > Message 5
>
> [Assistant] > Message 6

When you use chat models, then you will be billed for th entire chat, because chat history becomes input context. So you will be billed for system message and first 2 messages (User + Bot messages) 3 times because you perform 3 server requests and each time, system and first 2 messages are included in the user input.
Respectfully, you will be billed for the third and fourth messages 2 times, because it included in 2 server requests. This is the underwater stone in the API billing system.

To avoid this we created Playground mode that can be used for bulk actions like generating translations or config files.
Playground does not remember your messages so you wil be billed only once for each message.

## When to use right features?

### Chat

> You can use chats for non-bulk actions like asking questions, generating text, performing iterative code generation, etc. Don't use single chat for multiple tokens. It will confuse AI model and incurr additional charges. Create a new chat for each topics and you will see how much money you would save.

### Playground

> You can use Playground for bulk actions like generating translations, config files, etc.

## Use right model!

> Some of models are expensive, but not all of the are suited for performing actions. For easy tasks it is not necessary to use expensive and powerful models.

> Interesting fact: GPT 3.5 is less capable than gpt 4o, but it 10 times more expensive. This is because OpenAI rarely changes prices for existing models and pushing developers to use better models.

## Set budget limits and alerts

> Check if your API provider allows to set soft and hard budget limits. This will help you to avoid unexpected costs. Please note, that hitting hard limit will stop your API key and you will not be able to use it until you remove the limit. Soft limit will just notify you about exceeding the limit, but will not stop your API key.
`;

function Optimize(props) {
    return (
        <DocPage title={"Optimize costs"}>
            {pageContent}
        </DocPage>
    );
}

export default Optimize;