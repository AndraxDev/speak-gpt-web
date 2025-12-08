# SpeakGPT Web

<img src="https://assistant.teslasoft.org/SPEAKGPT_BANNER_WEB.png" style="width: 100%;"/>

SpeakGPT is an advanced and highly intuitive open-source AI assistant that utilizes the powerful OpenAI technologies to provide you with unparalleled performance and functionality.

This is a desktop version of SpeakGPT created using ReactJS and Google Material Design 3.

> [!NOTE]
>
> This project is a part of my Bachelor Thesis. Attribution is required to use this work. Copyright (c) 2023-2026 Dmytro Ostapenko. All rights reserved.
> 
> Cite as: Dmytro Ostapenko (2024), "Review Program Automation Using Copilot Services" Bachelor Thesis, Technical University of Košice, 2024.

## Try it out

Launch SpeakGPT web: [https://assistant.teslasoft.org/](https://assistant.teslasoft.org/)

View SpeakGPT for Android: [https://github.com/AndraxDev/speak-gpt](https://github.com/AndraxDev/speak-gpt).

## Screenshots

<img src="https://assistant.teslasoft.org/scr1.png" style="max-height: 300px"/>
<img src="https://assistant.teslasoft.org/scr2.png" style="max-height: 300px"/>
<img src="https://assistant.teslasoft.org/scr3.png" style="max-height: 300px"/>
<img src="https://assistant.teslasoft.org/scr4.png" style="max-height: 300px"/>
<img src="https://assistant.teslasoft.org/scr5.png" style="max-height: 300px"/>
<img src="https://assistant.teslasoft.org/scr6.png" style="max-height: 300px"/>

## Features

- [x] Chat
- [x] Images generation (DALL-e)
- [x] GPT 4 Vision (use your images and photos with ChatGPT)
- [x] System message
- [x] Prompts store
- [x] Quick assistant
- [x] A lot of different models
- [x] No captcha
- [x] Pay as you go system
- [x] Tips for newbies
- [x] Custom fine-tuned models are supported
- [x] Embedded assistant
- [x] Custom API endpoint
- [x] Supported models from OpenRouter like LLama, Gemini, Mistral, Perplexity, Claude and more
- [x] Playground
- [x] AI Photo editor
- [x] GPT 4o

## Embedded assistant

You can embed SpeakGPT into your website or app. Just use the following code:

```html
<style>
    /* Can be customized depending on your needs */
    .assistant-embedded {
        width: 500px;
        height: calc(100vh - 128px);
        background-color: rgba(50, 50, 50, 0.4);
        position: fixed;
        right: 24px;
        top: 100px;
        z-index: 100000;
        border-radius: 48px;
    }

    .assistant-iframe {
        width: 100%;
        height: 100%;
        border: none;
        background-color: transparent;
    }
</style>

...

<div class="assistant-embedded" id="speakgpt" style="display: none;">
    <!-- Don't forget to include clipboard access otherwise you will not be able to copy bot responses. -->
    <iframe allow="clipboard-write" src="https://assistant.teslasoft.org/embedded" class="assistant-iframe"></iframe>
</div>

...

<script>
    function switchAssistant() {
        if (localStorage.getItem("assistantOpened") === "true") {
            document.getElementById("speakgpt").style.display = "none";
            localStorage.setItem("assistantOpened", "false")
        } else {
            document.getElementById("speakgpt").style.display = "block";
            localStorage.setItem("assistantOpened", "true")
        }
    }

    function loadAssistant() {
        if (localStorage.getItem("assistantOpened") === "true") {
            document.getElementById("speakgpt").style.display = "block";
        } else {
            document.getElementById("speakgpt").style.display = "none";
        }
    }

    loadAssistant();
</script>
```

React implementation:

```jsx
import React, {useState} from "react";

function MyComponent() {
    const [assistantIsOpened, setAssistantIsOpened] = useState(false);
    
    return (
        <div>
            <button className={"btn"} onClick={() => {
                        if (assistantIsOpened) {
                            setAssistantIsOpened(false);
                        } else {
                            setAssistantIsOpened(true);
                        }
                    }}>{assistantIsOpened ? "Close Assistant" : "Open Assistant"}
                    </button>
            
            {
                assistantIsOpened ? <div className={"assistant-embedded"}>
                    <iframe src={"https://assistant.teslasoft.org/embedded"} className={"assistant-iframe"} title={"SpeakGPT"}/>
                </div> : null
            }
        </div>
    );
}

export default MyComponent;
```

## Customize assistant:

Assistant can be customized with a payload. Payload is a base64-encoded JSON string that contains params.
Payload goes after /embedded/ in the URL. Example: 

```html
<iframe allow="clipboard-write" src="https://assistant.teslasoft.org/embedded?payload=eyJuYW1lIjoiRXhhbXBsZSBDaGF0IiwiaW5pdGlhbE1lc3NhZ2UiOiJIZWxsbywgaG93IGFyZSB5b3U%2FIiwiaW5pdGlhbFJlc3BvbnNlIjoiSSdtIGZpbmUsIHRoYW5rIHlvdS4iLCJzeXN0ZW1NZXNzYWdlIjoiVGhpcyBpcyBhbiBleGFtcGxlIGNoYXQuIFBsZWFzZSBiZSBwb2xpdGUuIiwiY2hhdExvY2F0aW9uIjoiZXhhbXBsZUNoYXQifQ%3D%3D"></iframe>
```

To make assistant working properly you must URL encode your payload.

```javascript
let encodedPayload = encodeURIComponent(btoa(json));
```

Example of payload:

```json
{
  "name": "Example Chat",
  "icon": "https://example.com/icon.png",
  "description": "This assistant can provide you with relevant responses based on ...",
  "initialMessage": "Hello, how are you?",
  "initialResponse": "I'm fine, thank you.",
  "systemMessage": "This is an example chat. Please be polite.",
  "chatLocation": "exampleLocation"
}
```
- `name` - name that will be displayed on the top of the assistant window
- `icon` - URL to the icon that will be displayed on the top of the assistant window when conversation is empty
- `description` - description that will be displayed on the top of the assistant window when conversation is empty. Supports HTML
- `initialMessage` - a message that will be sent to the assistant when it's loaded
- `initialResponse` - response of assistant to make conversation work properly
- `systemMessage` - a message with additional content that are not shown in the chat and appended to the end of the chat history.
- `chatLocation` - location of the chat in the indexed database, don't use whitespaces or special characters

More params will be added in the future.

## Want to use SpeakGPT directly in Google Chrome browser?

> [!NOTE]
> 
> Check Directory "Chrome Extension" which contains an unpacked version of
> SpeakGPT for Google Chrome browser. Likely we would not publish it to the
> Chrome Web Store, because it is pretty simple and uses iframe to load an
> embedded version of SpeakGPT which is not allowed by Google.

## API key safety:

SpeakGPT uses OpenAI API to provide you with the best experience. Using API-keys is more secure than using your username/password. Your personal info can't be obtained using API key. OpenAI provides cheap API access to their services. Your API key is stored locally on your device and is not shared with anyone. SpeakGPT does not collect any personal data. SpeakGPT is open-source and you can check the code yourself. Each release of SpeakGPT is checked on VirusTotal.
If you have any concerns you can secure either [revoke your API key](https://platform.openai.com/account/api-keys) or use a separate API key for SpeakGPT.

To secure your API key perform the following steps:

1. Make sure you have separate API key for SpeakGPT
2. Set up billing limit
3. Enable usage monitoring, so you can see how much resources SpeakGPT uses and how much it costs
4. If you have any concerns you can revoke your API key

> Why we obfuscate our code in production releases?
>
> Obfuscation and resources shrinking allows us to optimize app size, it performance and secure it against reverse engineering or tamper and make sure your credentials like API keys in a safe place. You can request an unobfuscated build or compile it by self to make sure our app is safe.


> Developer identity
>
> Developer name: Dmytro Ostapenko (AndraxDev)\
> Contact: dostapenko82@gmail.com, +421951829517\
> Legal address: Dunajska 7, 04001 Košice, Slovakia 04001

## You are appreciated to:

- Report any bugs
- Support me :)
- Request new features. Don't forget to mark issue with a tag


## Buy me a coffee:

<a href="https://buymeacoffee.com/andrax_dev"><img src="https://andrax.dev/bmc_qr.png" width="200"/></a>

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/S6S6X3NCE)

## License

```
Copyright (c) 2023-2026 Dmytro Ostapenko. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
