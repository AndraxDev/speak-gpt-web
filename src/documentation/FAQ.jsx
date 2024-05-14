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
## What is it?

> SpeakGPT is a chatbot that uses external API to provide you access to GPT, Gemini, Claude, Perplexity and other powerful LLMs.

## What is LLM?

> LLM stands for Large Language Model. It's a model that can generate human-like text based on the input it receives.

## Is SpeakGPT free?

> SpeakGPT is only client app that you can access for free and without registration, but some models (like GPT 4, Gemini) are paid and require API key to use.

## Why should I download Android app?

> Android app has more features than web version. It includes offline access, chat import/export, mobile assistant, context menu, quick access, advanced model params, customization and more.

## Where can I find Android app?

> Download it from [Google Play](https://play.google.com/store/apps/details?id=org.teslasoft.assistant) or [GitHub](https://github.com/AndraxDev/speak-gpt).

## Why this app requires API key?

> This app provides you access to different AI models and API providers. API usage is cheaper and most of API providers have pay-as-you-go pricing model. Learn more about how we use API key in our [Privacy Policy](/privacy) and [API key safety](/api/safety).

## How can I get API key?

> You can visit API provider page. Here are some of them: [OpenAI](https://openai.com/), [OpenRouter](https://openrouter.ai/).

## How can I report bugs?

> Here are 2 GitHub repositories where you can report bugs: [For web version click here](https://github.com/AndraxDev/speak-gpt-web), [for mobile version click here](https://github.com/AndraxDev/speak-gpt). Just open issues and describe your problem but pay attention for duplicates. Duplicated issues will be closed without prior notice.

## How can I contribute?

> You can donate us at [Buy me a coffee](https://buymeacoffee.com/andrax_dev) or [Ko-fi](https://ko-fi.com/andrax_dev).

## How can I set an API key?

> For desktop version follow these instructions:
> 1. Launch quick assistant (click on square icon with a circle inside on the top left corner)
> 2. Click on "Settings" button
> 3. Click on "API endpoint" button
> 4. Click edit button on the right side of the default API endpoint
> 5. Enter your API key and click "Save" button
> 6. Change base url (optional, if you want to use another API provider like OpenRouter)

## How can I access Gemini or Claude, I see only GPT?

> You need to setup OpenRouter API endpoint and select it for the current chat.
> OpenRouter base url is: https://openrouter.ai/api/v1/

## I don't see GPT 4 model in the list

> To use GPT 4 you need to have paid OpenAI account (Not GPT Plus). View more info at [OpenAI rate limits](https://platform.openai.com/docs/guides/rate-limits).

## I'm getting quota error when using GPT 4 model

> See previous answer.

## Which limits are applied to me?

> It depends on the API provider, model, usage and your spending. You can view more info at [OpenAI rate limits](https://platform.openai.com/docs/guides/rate-limits).

## Is it expensive to use this app?

> It depends on efficient usage of app, model and API provider.
> For more info about OpenAI pricing visit [OpenAI pricing](https://openai.com/api/pricing/)
> For more info about OpenRouter pricing visit [OpenRouter pricing](https://openrouter.ai/docs#models)

## I had a very large chat and now I received a high bill?

> It's possible because when you are sending a message to the AI model, the whole conversation will be passed to the model input.
> Here are some tricks to avoid high bills:
> - Optimize messages size
> - Don't use multiple topics in a single chat (as previous context will become unuseful and you will be charged for it)
> - Play with prompts, system messages and formulate your tasks exactly
> - For routine tasks like code generating, text translation or summarization use playground. Here you can find additional model params that can help improve models response. Playground is not a chat so only your prompt will me sent to the model.

## Didn't find answer to your question?

> Contact us at [dostapenko82@gmail.com](mailto:dostapenko82@gmail.com)
`;

function Faq() {
    return (
        <DocPage title={"FAQ"}>
            {pageContent}
        </DocPage>
    );
}

export default Faq;