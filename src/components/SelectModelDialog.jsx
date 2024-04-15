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

import React, {useEffect} from 'react';
import {MaterialButton24, MaterialButtonOutlined24} from "../widgets/MaterialButton";
import {MaterialEditText} from "../widgets/MaterialEditText";
import {CircularProgress} from "@mui/material";

function SelectModelDialog({setIsOpen, setModel, model, isAssistant}) {

    const availableModels = [
        {
            model: "gpt-3.5-turbo",
            label: "GPT 3.5"
        },
        {
            model: "gpt-3.5-0125",
            label: "GPT 3.5 (Cost effective, version 0125)"
        },
        {
            model: "gpt-4",
            label: "GPT 4"
        },
        {
            model: "gpt-4-turbo-preview",
            label: "GPT 4 Turbo (Most capable model)"
        },
        {
            model: "gpt-4-32k",
            label: "GPT 4 (32k tokens context)"
        },
        {
            model: "custom",
            label: "Custom fine-tuned model"
        },
    ]

    const [selectedModel, setSelectedModel] = React.useState(model);

    const [allModels, setAllModels] = React.useState([]);

    useEffect(() => {
        fetch('https://api.openai.com/v1/models', {
            method: 'GET', // The HTTP method
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("apiKey")}`, // Authorization header
                'Content-Type': 'application/json' // Set the content type
            }
        })
        .then(response => response.json()) // Parse the JSON response
        .then(data => {
            let mm = [];
            data.data.forEach((m) => {
                if (m.id.includes("gpt-") || m.id.includes(":ft") || m.id.includes("ft:")) {
                    mm.push({
                        model: m.id,
                        label: m.id
                    })
                }
            })

            setAllModels(mm);
        }) // Log the data
        .catch(error => console.error('Error:', error)); // Log errors, if any
    }, []);

    return (
        <div className={isAssistant ? "dialog-backdrop-assistant" : "dialog-backdrop"} onMouseDown={() => {
            setIsOpen(false);
        }}>
            <div className={"dialog-paper"} onMouseDown={(e) => {
                e.stopPropagation()
            }}>
                <h3 className={"dialog-title"}>Select AI model</h3>
                <div className={isAssistant ? "dialog-content-assistant" : "dialog-content"}>
                    {
                        availableModels.map((m, index) => {
                            return (
                                <div key={index}
                                     className={m.model === selectedModel ? "selector-item-active" : "selector-item"}
                                     onClick={() => {
                                         setSelectedModel(m.model);
                                     }}>{m.label}</div>
                            )
                        })
                    }
                    {
                        selectedModel === "custom" ?
                            <div style={{
                                marginTop: "24px",
                                width: "100%"
                            }}>
                                <MaterialEditText label="AI model" value={model}
                                                  onChange={(e) => setSelectedModel(e.target.value)}/>
                            </div>
                            : null

                    }
                    <hr style={{
                        width: "100%",
                        margin: "16px 0",
                        borderBottom: "1px solid var(--color-accent-200)",
                        borderTop: "none",
                        borderLeft: "none",
                        borderRight: "none",
                    }}/>
                    <h4 style={{
                        width: "100%",
                        fontSize: "18px",
                        padding: "0",
                        margin: "0",
                    }} className={"dialog-title"}>All models</h4>
                    <hr style={{
                        width: "100%",
                        margin: "16px 0",
                        borderBottom: "1px solid var(--color-accent-200)",
                        borderTop: "none",
                        borderLeft: "none",
                        borderRight: "none",
                    }}/>
                    {
                        allModels.length > 0 ?
                            allModels.map((m, index) => {
                                return (
                                    <div key={index}
                                         className={m.model === selectedModel ? "selector-item-active" : "selector-item"}
                                         onClick={() => {
                                             setSelectedModel(m.model);
                                         }}>{m.label}</div>
                                )
                            })
                            : <div style={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}><CircularProgress style={{
                                color: "var(--color-accent-900)",
                                width: "48px",
                                height: "48px"
                            }}/></div>
                    }
                </div>
                <div className={"dialog-actions"}>
                    <MaterialButtonOutlined24 onClick={() => {
                        setIsOpen(false);
                    }}>Cancel</MaterialButtonOutlined24>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <MaterialButton24 onClick={() => {
                        if (selectedModel !== "") {
                            setModel(selectedModel)
                            setIsOpen(false);
                        }
                    }}>Save</MaterialButton24>
                </div>
            </div>
        </div>
    );
}

export default SelectModelDialog;