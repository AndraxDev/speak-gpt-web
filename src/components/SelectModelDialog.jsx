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
import {MaterialButton24, MaterialButtonOutlined24} from "../widgets/MaterialButton";
import {MaterialEditText} from "../widgets/MaterialEditText";

function SelectModelDialog({setIsOpen, setModel, model}) {

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

    return (
        <div className={"dialog-backdrop"} onMouseDown={() => {
            setIsOpen(false);
        }}>
            <div className={"dialog-paper"} onMouseDown={(e) => {
                e.stopPropagation()
            }}>
                <h3 className={"dialog-title"}>Select images resolution</h3>
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
                            <MaterialEditText label="AI model" value={model} onChange={(e) => setSelectedModel(e.target.value)} />
                        </div>
                        : null

                }
                <p className={"hint"} style={{
                    width: "calc(100% - 32px)",
                    marginBottom: "0"
                }}>Cost effective model (gpt-3.5-turbo-0125) has reduced pricing: input prices for the new model are reduced by 50% to $0.0005 /1K tokens and output prices are reduced by 25% to $0.0015 /1K tokens. On Friday, February 16 2024, gpt-3.5-turbo will be automatically switched to this model and you will receive lower pricing even if you forgot to update to this model.</p>
                <div className={"dialog-actions"}>
                    <MaterialButtonOutlined24 onClick={() => {
                        setIsOpen(false);
                    }}>Cancel</MaterialButtonOutlined24>
                    &nbsp;&nbsp;&nbsp;
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