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

import React, {useEffect} from 'react';
import {MaterialButton24, MaterialButtonOutlined24} from "../widgets/MaterialButton";
import {MaterialEditText} from "../widgets/MaterialEditText";
import {CircularProgress} from "@mui/material";
import {getApiEndpointById, getApiEndpointId} from "../util/Settings";
import {MaterialDialog} from "./MaterialDialog";

function SelectModelDialog({setIsOpen, setModel, model, isAssistant, chatId}) {

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
            label: "GPT 4 Turbo"
        },
        {
            model: "gpt-4o",
            label: "GPT 4o (Most capable model)"
        },
        {
            model: "custom",
            label: "Custom fine-tuned model"
        },
    ]

    const [selectedModel, setSelectedModel] = React.useState(model);
    const [allModels, setAllModels] = React.useState([]);
    const [chatModelsProjection, setChatModelsProjection] = React.useState([]);

    const syncProjection = (query) => {
        if (query === "") {
            setChatModelsProjection(allModels);
        } else {
            let projection = [];
            allModels.forEach((m) => {
                if (m.label.toLowerCase().includes(query.toLowerCase()) || query.toLowerCase().includes(m.model.toLowerCase())) {
                    projection.push(m);
                }
            })
            setChatModelsProjection(projection);
        }
    }

    useEffect(() => {
        let endpoint = getApiEndpointById(getApiEndpointId(chatId))
        fetch(endpoint.url + 'models', {
            method: 'GET', // The HTTP method
            headers: {
                'Authorization': `Bearer ${endpoint.key}`, // Authorization header
                'Content-Type': 'application/json' // Set the content type
            }
        })
        .then(response => response.json()) // Parse the JSON response
        .then(data => {
            let mm = [];
            data.data.forEach((m) => {
                mm.push({
                    model: m.id,
                    label: m.id
                })
            })

            setAllModels(mm);
            setChatModelsProjection(mm);
        }) // Log the data
        .catch(error => console.error('Error:', error)); // Log errors, if any
    }, []);

    return (
        <div className={isAssistant ? "dialog-backdrop-assistant" : "dialog-backdrop"} onMouseDown={() => {
            setIsOpen(false);
        }}>
            <MaterialDialog open={true}>
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
                    <MaterialEditText onChange={(e) => syncProjection(e.target.value)} label={"Search models"}/>
                    <hr style={{
                        width: "100%",
                        margin: "16px 0",
                        borderBottom: "1px solid var(--color-accent-200)",
                        borderTop: "none",
                        borderLeft: "none",
                        borderRight: "none",
                    }}/>
                    {
                        chatModelsProjection.length > 0 ?
                            chatModelsProjection.map((m, index) => {
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
            </MaterialDialog>
        </div>
    );
}

export default SelectModelDialog;