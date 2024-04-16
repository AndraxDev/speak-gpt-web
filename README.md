# SpeakGPT Desktop

SpeakGPT is an advanced and highly intuitive open-source AI assistant that utilizes the powerful OpenAI technologies to provide you with unparalleled performance and functionality.

This is a desktop version of SpeakGPT created using ReactJS and Google Material Design 3.

> [!NOTE]
> 
> SpeakGPT Desktop is currently early access and may have bugs. Please report any issues you find.

## Try it out

[Launch SpeakGPT Desktop](https://assistant.teslasoft.org/chat)

Mobile app can be found [here](https://github.com/AndraxDev/speak-gpt).

## Screenshots

<img src="https://gpt.teslasoft.org/d/1.png" style="max-height: 300px"/>
<img src="https://gpt.teslasoft.org/d/2.png" style="max-height: 300px"/>
<img src="https://gpt.teslasoft.org/d/3.png" style="max-height: 300px"/>
<img src="https://gpt.teslasoft.org/d/4.png" style="max-height: 300px"/>
<img src="https://gpt.teslasoft.org/d/5.png" style="max-height: 300px"/>
<img src="https://gpt.teslasoft.org/d/6.png" style="max-height: 300px"/>
<img src="https://gpt.teslasoft.org/d/7.png" style="max-height: 300px"/>
<br/>
<img src="https://gpt.teslasoft.org/d/8.png" style="max-height: 300px"/>

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
    <iframe src="https://assistant.teslasoft.org/embedded" class="assistant-iframe"></iframe>
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
> Location: Kosice, Slovakia

## You are appreciated to:

- Report any bugs
- Support me :)
- Request new features. Don't forget to mark issue with a tag


## Buy me a coffee:

<a href = "https://www.paypal.com/donate/?hosted_button_id=KR6BRY2BPEQTL"><img src = "https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif"></a>

## License

```
Copyright (c) 2023-2024 Dmytro Ostapenko. All rights reserved.

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
