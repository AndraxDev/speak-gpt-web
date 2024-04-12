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

function SelectResolutionDialog({setIsOpen, setResolution, resolution}) {
    const availableResolutions = [
        "256x256",
        "512x512",
        "1024x1024",
    ]

    const [selectedResolution, setSelectedResolution] = React.useState(resolution);
    return (
        <div className={"dialog-backdrop"} onMouseDown={() => {
            setIsOpen(false);
        }}>
            <div className={"dialog-paper"} onMouseDown={(e) => {
                e.stopPropagation()
            }}>
                <h3 className={"dialog-title"}>Select images resolution</h3>
                <div className={"dialog-content"}>
                    {
                        availableResolutions.map((res, index) => {
                            return (
                                <div key={index} className={res === selectedResolution ? "selector-item-active" : "selector-item"} onClick={() => {
                                    setSelectedResolution(res);
                                }}>{res}</div>
                            )
                        })
                    }
                    <p className={"warning"} style={{
                        width: "calc(100% - 32px)",
                        marginBottom: "0"
                    }}>DALL-e 3 supports 1024x1024 only.</p>
                </div>
                <div className={"dialog-actions"}>
                    <MaterialButtonOutlined24 onClick={() => {
                        setIsOpen(false);
                    }}>Cancel</MaterialButtonOutlined24>
                    &nbsp;&nbsp;&nbsp;
                    <MaterialButton24 onClick={() => {
                        setResolution(selectedResolution)
                        setIsOpen(false);
                    }}>Save</MaterialButton24>
                </div>
            </div>
        </div>
    );
}

export default SelectResolutionDialog;