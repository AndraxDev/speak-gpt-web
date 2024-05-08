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

import React, {useState} from 'react';
import {MaterialEditText} from "../widgets/MaterialEditText";
import {MaterialButton24, MaterialButtonError} from "../widgets/MaterialButton";
import {CircularProgress} from "@mui/material";
import {getApiHost, getModel} from "../util/Settings";
import SelectModelDialog from "./SelectModelDialog";
import ApiHostChangeDialog from "./ApiHostChangeDialog";
import OpenAI from "openai";

function Playground() {
    const [apiEndpoint, setApiEndpoint] = useState(getApiHost(""));
    const [model, setModel] = useState(getModel(""));
    const [apiEndpointDialogOpen, setApiEndpointDialogOpen] = useState(false);
    const [modelDialogOpen, setModelDialogOpen] = useState(false);
    const [temperature, setTemperature] = useState(0.7);
    const [topP, setTopP] = useState(1.0);
    const [presencePenalty, setPresencePenalty] = useState(0.0);
    const [frequencyPenalty, setFrequencyPenalty] = useState(0.0);
    const [maxTokens, setMaxTokens] = useState(0);
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [systemMessage, setSystemMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const runAICompletion = () => {
        runAI().then((out) => {
            setOutput(out);
            setLoading(false);
        });
    }

    const runAI = async () => {
        const openai = new OpenAI({
            apiKey: localStorage.getItem("apiKey"),
            dangerouslyAllowBrowser: true,
            baseURL: getApiHost("")
        });

        const messages = systemMessage === "" ? [{
            content: input,
            role: "user"
        }] : [{
            content: systemMessage,
            role: "system"
        }, {
            content: input,
            role: "user"
        }]

        let xTemperature;
        let xTopP;
        let xPresencePenalty;
        let xFrequencyPenalty;
        let xMaxTokens;

        try {
            xTemperature = parseFloat(temperature.toString());
        } catch (e) {
            xTemperature = 0.7;
        }

        try {
            xTopP = parseFloat(topP.toString());
        } catch (e) {
            xTopP = 1.0;
        }

        try {
            xPresencePenalty = parseFloat(presencePenalty.toString());
        } catch (e) {
            xPresencePenalty = 0.0;
        }

        try {
            xFrequencyPenalty = parseFloat(frequencyPenalty.toString());
        } catch (e) {
            xFrequencyPenalty = 0.0;
        }

        try {
            xMaxTokens = parseInt(maxTokens.toString());
        } catch (e) {
            xMaxTokens = 0;
        }

        const chatCompletion = await openai.chat.completions.create({
            messages: messages,
            model: getModel(""),
            stream: true,
            temperature: xTemperature === 0.7 ? undefined : xTemperature,
            top_p: xTopP === 1.0 ? undefined : xTopP,
            presence_penalty: xPresencePenalty === 0.0 ? undefined : xPresencePenalty,
            frequency_penalty: xFrequencyPenalty === 0.0 ? undefined : xFrequencyPenalty,
            max_tokens: xMaxTokens <= 0 ? undefined : xMaxTokens,
        });

        let out = "";

        for await (const chunk of chatCompletion) {
            const r = chunk.choices[0].delta;

            if (chunk.choices[0] !== undefined && chunk.choices[0].delta !== undefined && r !== undefined && chunk.choices[0].delta.content !== undefined) {
                out += r.content;

                setOutput(out)
            }
        }

        return out;
    }

    return (
        <div>
            {
                modelDialogOpen ? <SelectModelDialog setModel={setModel} model={model} setIsOpen={setModelDialogOpen} isAssistant={false} chatId={""} /> : null
            }
            {
                apiEndpointDialogOpen ? <ApiHostChangeDialog chatId={""} setOpen={setApiEndpointDialogOpen} setApiHostD={setApiEndpoint}/> : null
            }
            <div className={"app-bar"}>
                &nbsp;&nbsp;
                <h1>Playground</h1>
                &nbsp;&nbsp;
                <button className={"dropdown-btn"} onClick={() => {
                    setApiEndpointDialogOpen(true);
                }}>API Endpoint:&nbsp;<span>{apiEndpoint}</span>&nbsp;<span className={"material-symbols-outlined"}>expand_more</span></button>
                <button className={"dropdown-btn"} onClick={() => {
                    setModelDialogOpen(true);
                }}>AI model:&nbsp;<span>{model}</span>&nbsp;<span className={"material-symbols-outlined"}>expand_more</span></button>
                &nbsp;&nbsp;
                <MaterialButton24 onClick={() => {
                    if (!loading) {
                        setLoading(true);
                        setOutput("");
                        runAICompletion();
                    }
                }}><div style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                }}><span className={"material-symbols-outlined"}>play_arrow</span>&nbsp;&nbsp;Run&nbsp;</div>{loading ? <>
                    &nbsp;
                    <CircularProgress style={{
                        color: "var(--color-accent-100)",
                        width: "16px",
                        height: "16px",
                    }}/>
                </> : null}</MaterialButton24>
                &nbsp;&nbsp;&nbsp;
                <MaterialButtonError style={{
                    fontSize: "16px",
                }} onClick={() => {setInput("")}}>Clear input</MaterialButtonError>
                &nbsp;&nbsp;&nbsp;
                <MaterialButtonError style={{
                    fontSize: "16px",
                }} onClick={() => {setOutput("")}}>Clear output</MaterialButtonError>
            </div>
            <div className={"app-bar"}>
                &nbsp;&nbsp;
                <MaterialEditText InputLabelProps={{ shrink: true }} id={"iTemperature"} type="number" sx={{
                    '& .MuiFilledInput-root:after': {
                        borderBottomColor: 'var(--color-accent-800)',
                    },
                }} size="small" variant="filled" style={{
                    width: "200px",
                }} label={"temperature"} value={temperature} onChange={(e) => {
                    setTemperature(e.target.value)
                }}/>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <MaterialEditText InputLabelProps={{ shrink: true }} id={"iTopP"} type="number" sx={{
                    '& .MuiFilledInput-root:after': {
                        borderBottomColor: 'var(--color-accent-800)',
                    },
                }} size="small" variant="filled" style={{
                    width: "200px"
                }} label={"top_p"} value={topP} onChange={(e) => {
                    setTopP(e.target.value)
                }}/>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <MaterialEditText InputLabelProps={{ shrink: true }} id={"iPresencePenalty"} type="number" sx={{
                    '& .MuiFilledInput-root:after': {
                        borderBottomColor: 'var(--color-accent-800)',
                    },
                }} size="small" variant="filled" style={{
                    width: "200px"
                }} label={"presencePenalty"} value={presencePenalty} onChange={(e) => {
                    setPresencePenalty(e.target.value)
                }}/>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <MaterialEditText InputLabelProps={{ shrink: true }} id={"iFrequencyPenalty"} type="number" sx={{
                    '& .MuiFilledInput-root:after': {
                        borderBottomColor: 'var(--color-accent-800)',
                    },
                }} size="small" variant="filled" style={{
                    width: "200px"
                }} label={"frequencyPenalty"} value={frequencyPenalty} onChange={(e) => {
                    setFrequencyPenalty(e.target.value)
                }}/>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <MaterialEditText InputLabelProps={{ shrink: true }} id={"iMaxTokens"} type="number" sx={{
                    '& .MuiFilledInput-root:after': {
                        borderBottomColor: 'var(--color-accent-800)',
                    },
                }} size="small" variant="filled" style={{
                    width: "200px"
                }} label={"max_tokens"} value={maxTokens} onChange={(e) => {
                    setMaxTokens(e.target.value)
                }}/>
            </div>
            <div className={"playground"}>
                <MaterialEditText variant="outlined" sx={{
                    '& .MuiFilledInput-root:after': {
                        borderBottomColor: 'var(--color-accent-800)',
                    }
                }} InputLabelProps={{ shrink: true }} rows={4} id={"iSystem"} value={systemMessage} label={"System"} multiline onChange={(e) => setSystemMessage(e.target.value)}></MaterialEditText>
                &nbsp;
                <div className={"playground-body"}>
                    <MaterialEditText variant="filled" sx={{
                        '& .MuiFilledInput-root:after': {
                            borderBottomColor: 'var(--color-accent-800)',
                        },
                    }} InputLabelProps={{ shrink: true }} rows={16} id={"iInput"} value={input} label={"Input"} multiline onChange={(e) => setInput(e.target.value)}></MaterialEditText>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <MaterialEditText variant="filled" sx={{
                        '& .MuiFilledInput-root:after': {
                            borderBottomColor: 'var(--color-accent-800)',
                        },
                    }} InputLabelProps={{ shrink: true }} rows={16} id={"iOutput"} value={output} label={"Output"} multiline onChange={(e) => setOutput(e.target.value)}></MaterialEditText>
                </div>
            </div>
        </div>
    );
}

export default Playground;