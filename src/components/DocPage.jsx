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
import {isMobile} from "react-device-detect";
import {Link} from "react-router-dom";
import Prism from "../prism.js";
import {highlightCode, linesNumbers} from "../util/MarkDownCode";
import remarkGfm from "remark-gfm";
import Markdown from "react-markdown";
import ArrowBack from "@mui/icons-material/ArrowBack";

function setFullHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Set the height initially
setFullHeight();

// Re-calculate on resize or orientation change
window.addEventListener('resize', setFullHeight);
window.addEventListener('orientationchange', setFullHeight);

function DocPage({children, title}) {
    return (
        <div className={isMobile ? "doc-bg-mob" : "doc-bg"} style={isMobile ? {
            padding: "24px",
            overflowY: "auto",
            height: "calc(calc(var(--vh, 1vh) * 100) - 140px)"
        } : {
            padding: "24px",
            overflowY: "auto",
            height: "calc(100vh - 48px)"
        }}>
            <div className={isMobile ? "doc-header-mob" : "doc-header"}>
                <Link to={"/"}><span className={"doc-title material-symbols-outlined"}><ArrowBack/></span></Link>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <h2 className={"doc-title"}>{title}</h2>
            </div>
            <br/>
            <div className={isMobile ? "doc-content-mob" : "doc-content"}>
                <Markdown
                    components={{
                        code(props) {
                            const {children, className, node, ...rest} = props
                            const match = /language-(\w+)/.exec(className || '')

                            let language = match ? match[1] : undefined

                            if (language === "python") language = Prism.languages.py;
                            if (language === "javascript") language = Prism.languages.js;
                            if (language === "java") language = Prism.languages.java;
                            if (language === "c") language = Prism.languages.c;
                            if (language === "cpp") language = Prism.languages.cpp;
                            if (language === "csharp") language = Prism.languages.csharp;
                            if (language === "html") language = Prism.languages.html;
                            if (language === "css") language = Prism.languages.css;
                            if (language === "json") language = Prism.languages.json;
                            if (language === "yaml") language = Prism.languages.yaml;
                            if (language === "xml") language = Prism.languages.xml;
                            if (language === "markdown") language = Prism.languages.markdown;
                            if (language === "bash") language = Prism.languages.bash;

                            return match ? (
                                <div className={"code-block"}>
                                    {
                                        highlightCode(children, language, className) !== null ?
                                            <>
                                                <div className={"lines"}
                                                     dangerouslySetInnerHTML={{__html: linesNumbers(highlightCode(children, language, className))}}/>
                                                <div className={"lines-delim"}/>
                                            </>
                                            : null
                                    }

                                    <div dangerouslySetInnerHTML={{__html: highlightCode(children, language, className) == null ? children : highlightCode(children, language, className)}}/>
                                </div>
                            ) : (
                                <code {...rest} className={"unknown-code-block " + className}>
                                    {children}
                                </code>
                            )
                        }
                    }}
                    remarkPlugins={[remarkGfm]}
                    className={"message-content"}>{children}</Markdown>
            </div>
        </div>
    );
}

export default DocPage;