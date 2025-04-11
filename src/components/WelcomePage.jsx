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
import {Link} from "react-router-dom";
import {MaterialButton24, MaterialButtonOutlined24} from "../widgets/MaterialButton";
import {BrowserView, isMobile, MobileView} from "react-device-detect";
import {sha256} from "js-sha256";
import Assistant from "./Assistant";
import LazyHydrate from "react-lazy-hydration";

function setFullHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

const features = [
    {
        title: "Answer your question",
        icon: "help",
        description: "Get comprehensive answers from a vast knowledge base on a multitude of topics and queries.",
        buttonLink: "/chat",
        buttonLabel: "Start a chat",
        buttonType: "link",
        target: "_self",
        tintBackground: "rgba(49,40,40,0.8)",
        tintForeground: "rgb(255,168,168)"
    },
    {
        title: "Generate code",
        icon: "code",
        description: "Create efficient and customizable code snippets tailored to your specific programming needs.",
        buttonLink: "Generate code snippet for a Python function that calculates the factorial of a number.",
        buttonLabel: "Try an example",
        buttonType: "assistant",
        tintBackground: "rgba(49,41,39,0.8)",
        tintForeground: "rgb(255,189,157)"
    },
    {
        title: "Solve math problems",
        icon: "function",
        description: "Solve complex mathematical equations and problems with precision, from basic arithmetic to advanced calculus.",
        buttonLink: "Solve the integral of x^2 from 0 to 1.",
        buttonLabel: "Try an example",
        buttonType: "assistant",
        tintBackground: "rgba(44,42,35,0.8)",
        tintForeground: "rgb(255,242,176)"
    },
    {
        title: "Translate text",
        icon: "translate",
        description: "Translate text from over 170 languages, ensuring accurate and context-aware communication.",
        buttonLink: "Translate the phrase 'Hello, how are you?' to French.",
        buttonLabel: "Try an example",
        buttonType: "assistant",
        tintBackground: "rgba(37,40,33,0.8)",
        tintForeground: "rgb(216,255,158)"
    },
    {
        title: "Generate images",
        icon: "imagesmode",
        description: "Generate unique images and digital artworks from textual descriptions for your creative projects.",
        buttonLink: "/imagine Generate an image of a sunset over the ocean.",
        buttonLabel: "Try an example",
        buttonType: "assistant",
        tintBackground: "rgba(34,42,40,0.8)",
        tintForeground: "rgb(174,255,233)"
    },
    {
        title: "Process png/jpg images",
        icon: "folder",
        description: "Include images in your queries and receive detailed information, analysis, and processing of the image content.",
        buttonLink: "/chat",
        buttonLabel: "Start a chat",
        buttonType: "link",
        target: "_self",
        tintBackground: "rgba(38,40,47,0.8)",
        tintForeground: "rgb(183,200,255)"
    },
    {
        title: "Custom assistants",
        icon: "group_work",
        description: "Embed personalized assistant to your site using just 1 line of code.",
        buttonLink: "https://github.com/AndraxDev/speak-gpt-web",
        buttonLabel: "Open documentation",
        buttonType: "link",
        target: "_blank",
        tintBackground: "rgba(37,35,44,0.8)",
        tintForeground: "rgb(198,185,255)"
    },
    {
        title: "Prompts Store",
        icon: "apps",
        description: "Explore and share AI-driven prompts in a collaborative community, enhancing creativity and inspiration among users and share your own.",
        buttonLink: "/prompts",
        buttonLabel: "Explore prompts",
        buttonType: "link",
        target: "_self",
        tintBackground: "rgba(44,38,44,0.8)",
        tintForeground: "rgb(255,176,244)"
    },
    {
        title: "Privacy",
        icon: "visibility_off",
        description: "Your data is not used for training AI models. All your conversation and credentials are stored locally and no other apps have access to these data.",
        buttonLink: "/chat",
        buttonLabel: "Start a chat",
        buttonType: "link",
        target: "_self",
        tintBackground: "rgba(49,40,40,0.8)",
        tintForeground: "rgb(255,168,168)"
    },
    {
        title: "Different AI models",
        icon: "extension",
        description: "Access GPT, Gemini, Claude, Mistral, LLama and other powerful AI models.",
        buttonLink: "/chat",
        buttonLabel: "Start a chat",
        buttonType: "link",
        tintBackground: "rgba(49,41,39,0.8)",
        tintForeground: "rgb(255,189,157)"
    },
    {
        title: "Playground",
        icon: "terminal",
        description: "Play with different AI models and see how they work.",
        buttonLink: "/playground",
        buttonLabel: "Launch playground",
        buttonType: "link",
        tintBackground: "rgba(44,42,35,0.8)",
        tintForeground: "rgb(255,242,176)"
    },
    {
        title: "AI Photo Editor",
        icon: "photo",
        description: "Edit your photos using DALL-e.",
        buttonLink: "/editor",
        buttonLabel: "Launch AI Photo Editor",
        buttonType: "link",
        tintBackground: "rgba(37,40,33,0.8)",
        tintForeground: "rgb(216,255,158)"
    },
];

const mobileFeatures = [
    {
        title: "Assistant",
        icon: "group_work",
        description: "Make SpeakGPT your default assistant and access SpeakGPT from any app or site.",
        tintBackground: "rgba(20,20,20,0.8)",
        tintForeground: "rgb(255,255,255)"
    },
    {
        title: "WhisperAI",
        icon: "graphic_eq",
        description: "Use your voice to access SpeakGPT. Currently it support WhisperAI and Google Speech recognition. Voice language is detected automatically.",
        tintBackground: "rgba(40,40,40,0.8)",
        tintForeground: "rgb(255,255,255)"
    },
    {
        title: "Text-To-Speech",
        icon: "text_to_speech",
        description: "Mobile app supports pronouncing text using OpenAI TTS and Google TTS.",
        tintBackground: "rgba(20,20,20,0.8)",
        tintForeground: "rgb(255,255,255)"
    },
    {
        title: "Offline mode",
        icon: "cloud_off",
        description: "Access your saved chats while you're offline.",
        tintBackground: "rgba(40,40,40,0.8)",
        tintForeground: "rgb(255,255,255)"
    },
    {
        title: "Context menu",
        icon: "lists",
        description: "Select text in any app and select 'SpeakGPT' in your context menu to use this text with assistant. Currently you can summarize, explain, translate text, use it as prompt or generate images.",
        tintBackground: "rgba(20,20,20,0.8)",
        tintForeground: "rgb(255,255,255)"
    },
    {
        title: "Experiments",
        icon: "science",
        description: "Sometimes we're rolling out new interesting functions for a limited time period. Check out 'Experiments' section in the app.",
        tintBackground: "rgba(40,40,40,0.8)",
        tintForeground: "rgb(255,255,255)"
    },
    {
        title: "Fine-tunes",
        icon: "token",
        description: "Mobile version allows you to use you fine-tuned models.",
        tintBackground: "rgba(20,20,20,0.8)",
        tintForeground: "rgb(255,255,255)"
    },
    {
        title: "Dynamic theme",
        icon: "palette",
        description: "Theme depends on you wallpaper and settings (requires Android 12+ and supported device). Also you can use AMOLED mode to save power while using SpeakGPT (A supported display is required).",
        tintBackground: "rgba(40,40,40,0.8)",
        tintForeground: "rgb(255,255,255)"
    }
]

// Set the height initially
setFullHeight();

// Re-calculate on resize or orientation change
window.addEventListener('resize', setFullHeight);
window.addEventListener('orientationchange', setFullHeight);

function WelcomePage() {

    const [prompt, setPrompt] = React.useState("");
    const [assistantIsOpen, setAssistantIsOpen] = React.useState(false);
    const [mobileQrOpened, setMobileQrOpened] = React.useState(false);

    return (
        <LazyHydrate ssrOnly className={"v-background"} style={{
            overflowY: "auto",
            height: "calc(var(--vh, 1vh) * 100)",
            backgroundColor: "var(--color-accent-50)"
        }}>
            <BrowserView className={"v-container"}>
                <div className={"header"}>
                    <div className={"app-info"}>
                        <img src={"./logo192.webp"} alt={"SpeakGPT"} className={"app-logo"}/>
                        <div className={"app-info-text"}>
                            <h1 className={"app-title"}>SpeakGPT</h1>
                            <p className={"app-desc"}>SpeakGPT is an advanced and highly intuitive open-source AI assistant that utilizes the powerful large language models (LLM) to provide you with unparalleled performance and functionality. Officially it supports GPT models, LLAMA, MIXTRAL, GEMMA, Gemini (regular and pro) Vision, DALL-E and other models.</p>
                            <div className={"btn-row"}>
                                <a href={"/chat"}><MaterialButton24>Launch SpeakGPT</MaterialButton24></a>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <MaterialButtonOutlined24 onClick={() => setMobileQrOpened(true)}>Get mobile app</MaterialButtonOutlined24>
                            </div>
                        </div>
                    </div>

                    {
                        mobileQrOpened ? <div className={"priority dialog-backdrop"} onMouseDown={() => {
                            setMobileQrOpened(false);
                        }}>
                            <div className={"dialog-paper"} onMouseDown={(e) => {
                                e.stopPropagation()
                            }}>
                                <img src={"./qr.png"} alt={"SpeakGPT"} className={"mobile-qr"}/>
                                <p className={"get-mobile-app"}>Scan this code from your phone.</p>
                            </div>
                        </div> : null
                    }
                </div>
                <div className={"body"}>
                    <h2 className={"app-subtitle"}>Features</h2>
                    <div className={"feature-cards"}>
                        {
                            features.map((feature) => <div style={{
                                backgroundColor: feature.tintBackground,
                            }} className={"feature-card"} key={sha256(feature.title)}>
                                <div><span style={{
                                    color: feature.tintForeground,
                                    fontSize: "48px",
                                    width: "48px",
                                    height: "48px"
                                }} className={"feature-card-icon material-symbols-outlined"}>{feature.icon}</span></div>
                                <div className={"feature-info"}>
                                    <h3 className={"feature-card-title"} style={{
                                        color: feature.tintForeground,
                                    }}>{feature.title}</h3>
                                    <p className={"feature-card-text"}>{feature.description}</p>
                                    <div className={"feature-button-area"}>
                                        {
                                            feature.buttonType === "link" ? <Link to={feature.buttonLink}
                                                                                  target={feature.target}><MaterialButton24
                                                    sx={{
                                                        backgroundColor: feature.tintForeground,
                                                        border: "none",
                                                        "&:hover": {
                                                            backgroundColor: "#fff",
                                                            border: "none"
                                                        }
                                                    }}>{feature.buttonLabel}</MaterialButton24></Link> :
                                                <MaterialButton24 sx={{
                                                    backgroundColor: feature.tintForeground,
                                                    border: "none",
                                                    "&:hover": {
                                                        backgroundColor: "#fff",
                                                        border: "none"
                                                    }
                                                }} onClick={() => {
                                                    setPrompt(feature.buttonLink);
                                                    setAssistantIsOpen(true);
                                                }}>{feature.buttonLabel}</MaterialButton24>
                                        }
                                    </div>
                                </div>
                            </div>)
                        }
                    </div>
                    <h2 className={"app-subtitle"}>Exclusive mobile features</h2>
                    <div className={"feature-cards"}>
                        {
                            mobileFeatures.map((feature) => <div style={{
                                backgroundColor: feature.tintBackground,
                            }} className={"feature-card"} key={sha256(feature.title)}>
                                <div><span style={{
                                    color: feature.tintForeground,
                                    fontSize: "48px",
                                    width: "48px",
                                    height: "48px"
                                }} className={"feature-card-icon material-symbols-outlined"}>{feature.icon}</span></div>
                                <div className={"feature-info"}>
                                    <h3 className={"feature-card-title"} style={{
                                        color: feature.tintForeground,
                                    }}>{feature.title}</h3>
                                    <p className={"feature-card-text"}>{feature.description}</p>
                                </div>
                            </div>)
                        }
                    </div>
                </div>
                <div className={"footer"}>
                    <p className={"api-disclaimer"}>
                        This app requires an OpenAI key to work. You can get it by visiting <a
                        href={"https://platform.openai.com/api-keys"} target={"_blank"} className={"link-special"}>OpenAI</a>. Learn more about API <Link className={"link-special"} to={"/api/safety"}>safety principles</Link>.
                    </p>
                    <hr className={"footer-divider"}/>
                    <div className={"footer-content"}>
                        <div className={"footer-column"}>
                            <Link className={"footer-link"} to={"/terms"}>Terms of Service</Link>
                            <Link className={"footer-link"} to={"/privacy"}>Privacy Policy</Link>
                            <Link className={"footer-link"} to={"/api/safety"}>API safety</Link>
                            {/*<Link className={"footer-link"} to={"/docs"}>Developer documentation</Link>*/}
                            <Link className={"footer-link"} to={"/faq"}>FAQ</Link>
                            <Link className={"footer-link"} to={"/contact"}>Contact</Link>
                            <Link className={"footer-link"} to={"/changelog"}>Changelog</Link>
                            <a className={"footer-link"} href={"/sitemap.xml"}>Site map</a>
                        </div>
                        <div className={"vertical-divider"}></div>
                        <div className={"footer-column"}>
                            <Link className={"footer-link"} to={"https://github.com/AndraxDev/speak-gpt-web"}
                                  target={"_blank"}>GitHub</Link>
                            <Link className={"footer-link"} to={"https://github.com/AndraxDev/speak-gpt"}
                                  target={"_blank"}>GitHub
                                (Android)</Link>
                            <Link className={"footer-link"} to={"https://play.google.com/store/apps/details?id=org.teslasoft.assistant"}>Get it on Google Play</Link>
                            <Link className={"footer-link"} to={"https://buymeacoffee.com/andrax_dev"}
                                  target={"_blank"}>Buy me a
                                coffee</Link>
                            <Link className={"footer-link"} to={"https://ko-fi.com/andrax_dev"}
                                  target={"_blank"}>Ko-fi</Link>
                            <Link className={"footer-link"} to={"https://andrax.dev"} target={"_blank"}>AndraxDev</Link>
                            <Link className={"footer-link"} to={"https://teslasoft.org"}
                                  target={"_blank"}>Teslasoft</Link>
                        </div>
                    </div>
                    <hr className={"footer-divider"}/>
                    <p className={"copyright"}>© 2023-2025 <a href={"https://andrax.dev/"} target={"_blank"} className={"link-special"} rel="noreferrer">AndraxDev</a>. All rights reserved.</p>
                </div>
            </BrowserView>
            <MobileView className={"v-container-mob"}>
                <div className={"header-mob"}>
                    <div className={"app-info-mob"}>
                        <img src={"./logo192.webp"} alt={"SpeakGPT"} className={"app-logo-mob"}/>
                        <div className={"app-info-text"}>
                            <h1 className={"app-title-mob"}>SpeakGPT</h1>
                            <p className={"app-desc-mob"}>SpeakGPT is an advanced and highly intuitive open-source AI assistant that utilizes the powerful large language models (LLM) to provide you with unparalleled performance and functionality. Officially it supports GPT models, LLAMA, MIXTRAL, GEMMA, Gemini (regular and pro) Vision, DALL-E and other models.</p>
                            <div className={"btn-row-mob"}>
                                <Link to={"https://play.google.com/store/apps/details?id=org.teslasoft.assistant"} target={"_blank"}><MaterialButton24>Download app</MaterialButton24></Link>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <a href={"/chat"}><MaterialButtonOutlined24>Launch SpeakGPT</MaterialButtonOutlined24></a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"body"}>
                    <h2 className={"app-subtitle"}>Features</h2>
                    <div className={"feature-cards-mob"}>
                        {
                            features.map((feature) => <div style={{
                                backgroundColor: feature.tintBackground,
                            }} className={"feature-card-mob"} key={sha256(feature.title)}>
                                <div><span style={{
                                    color: feature.tintForeground,
                                    fontSize: "48px",
                                    width: "48px",
                                    height: "48px"
                                }} className={"feature-card-icon material-symbols-outlined"}>{feature.icon}</span></div>
                                <div className={"feature-info"}>
                                    <h3 className={"feature-card-title"} style={{
                                        color: feature.tintForeground,
                                    }}>{feature.title}</h3>
                                    <p className={"feature-card-text"}>{feature.description}</p>
                                    <div className={"feature-button-area"}>
                                        {
                                            feature.buttonType === "link" ? <Link to={feature.buttonLink}
                                                                                  target={feature.target}><MaterialButton24
                                                    sx={{
                                                        backgroundColor: feature.tintForeground,
                                                        border: "none",
                                                        borderRadius: "12px",
                                                        transition: "border-radius 0.2s",
                                                        "&:hover": {
                                                            backgroundColor: "#fff",
                                                            border: "none",
                                                            borderRadius: "24px",
                                                            transition: "border-radius 0.2s",
                                                        }
                                                    }}>{feature.buttonLabel}</MaterialButton24></Link> :
                                                <MaterialButton24 sx={{
                                                    backgroundColor: feature.tintForeground,
                                                    border: "none",
                                                    borderRadius: "12px",
                                                    transition: "border-radius 0.2s",
                                                    "&:hover": {
                                                        backgroundColor: "#fff",
                                                        border: "none",
                                                        borderRadius: "24px",
                                                        transition: "border-radius 0.2s",
                                                    }
                                                }} onClick={() => {
                                                    setPrompt(feature.buttonLink);
                                                    setAssistantIsOpen(true);
                                                }}>{feature.buttonLabel}</MaterialButton24>
                                        }
                                    </div>
                                </div>
                            </div>)
                        }
                    </div>
                    <h2 className={"app-subtitle"}>Exclusive mobile features</h2>
                    <div className={"feature-cards-mob"}>
                        {
                            mobileFeatures.map((feature) => <div style={{
                                backgroundColor: feature.tintBackground,
                            }} className={"feature-card-mob"} key={sha256(feature.title)}>
                                <div><span style={{
                                    color: feature.tintForeground,
                                    fontSize: "48px",
                                    width: "48px",
                                    height: "48px"
                                }} className={"feature-card-icon material-symbols-outlined"}>{feature.icon}</span></div>
                                <div className={"feature-info"}>
                                    <h3 className={"feature-card-title"} style={{
                                        color: feature.tintForeground,
                                    }}>{feature.title}</h3>
                                    <p className={"feature-card-text"}>{feature.description}</p>
                                </div>
                            </div>)
                        }
                    </div>
                </div>
                <div className={"footer-mob"}>
                    <p className={"api-disclaimer-mob"}>
                        This app requires an OpenAI key to work. You can get it by visiting <a
                        href={"https://platform.openai.com/api-keys"} target={"_blank"} className={"link-special"}>OpenAI</a>. Learn more about API <Link className={"link-special"} to={"/api/safety"}>safety principles</Link>.
                    </p>
                    <hr className={"footer-divider-mob"}/>
                    <div className={"footer-content-mob"}>
                        <div className={"footer-column"}>
                            <Link className={"footer-link"} to={"/terms"}>Terms of Service</Link>
                            <Link className={"footer-link"} to={"/privacy"}>Privacy Policy</Link>
                            <Link className={"footer-link"} to={"/api/safety"}>API safety</Link>
                            {/*<Link className={"footer-link"} to={"/docs"}>Developer documentation</Link>*/}
                            <Link className={"footer-link"} to={"/faq"}>FAQ</Link>
                            <Link className={"footer-link"} to={"/contact"}>Contact</Link>
                            <Link className={"footer-link"} to={"/changelog"}>Changelog</Link>
                            <Link className={"footer-link"} to={"/debug"}>Debug</Link>
                            <a className={"footer-link"} href={"/sitemap.xml"}>Site map</a>
                        </div>
                        <div className={"vertical-divider-mob"}></div>
                        <div className={"footer-column"}>
                            <Link className={"footer-link"} to={"https://github.com/AndraxDev/speak-gpt-web"}
                                  target={"_blank"}>GitHub</Link>
                            <Link className={"footer-link"} to={"https://github.com/AndraxDev/speak-gpt"}
                                  target={"_blank"}>GitHub
                                (Android)</Link>
                            <Link className={"footer-link"} to={"https://play.google.com/store/apps/details?id=org.teslasoft.assistant"}>Get it on Google Play</Link>
                            <Link className={"footer-link"} to={"https://buymeacoffee.com/andrax_dev"}
                                  target={"_blank"}>Buy me a
                                coffee</Link>
                            <Link className={"footer-link"} to={"https://ko-fi.com/andrax_dev"}
                                  target={"_blank"}>Ko-fi</Link>
                            <Link className={"footer-link"} to={"https://andrax.dev"} target={"_blank"}>AndraxDev</Link>
                            <Link className={"footer-link"} to={"https://teslasoft.org"}
                                  target={"_blank"}>Teslasoft</Link>
                        </div>
                    </div>
                    <hr className={"footer-divider-mob"}/>
                    <p className={"copyright"}>© 2023-2025 <a href={"https://andrax.dev/"} target={"_blank"} className={"link-special"} rel="noreferrer">AndraxDev</a>. All rights reserved.</p>
                </div>
            </MobileView>
            {
                assistantIsOpen ? <div style={isMobile ? {
                    height: "calc(var(--vh, 1vh) * 100)",
                    overflow: "hidden"
                } : {}} className={isMobile ? "assistant-container-mob" : "assistant-container"}>
                    <Assistant runtimePrompt={prompt} type={prompt.toLowerCase().includes("/imagine") ? "dalle" : "gpt"}
                               closeWindow={setAssistantIsOpen}/>
                </div> : null
            }
        </LazyHydrate>
    );
}

export default WelcomePage;
