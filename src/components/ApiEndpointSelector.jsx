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
import {getAllApiEndpoints} from "../util/Settings";
import CircularProgress from "@mui/material/CircularProgress";
import {sha256} from "js-sha256";
import {MaterialButton24, MaterialButtonOutlined24, MaterialButtonTonal24} from "../widgets/MaterialButton";
import ApiEndpointEditDialog from "./ApiEndpointEditDialog";
import {MaterialDialog} from "./MaterialDialog";
import Edit from "@mui/icons-material/Edit";

function ApiEndpointSelector({selectedApiEndpointId, setSelectedApiEndpointId, isOpened, setIsOpened, isAssistant, ...props}) {
    const [selectedApiEndpoint, setSelectedApiEndpoint] = React.useState(selectedApiEndpointId);
    const [apiEndpoints, setApiEndpoints] = React.useState(getAllApiEndpoints());
    const [editDialogOpened, setEditDialogOpened] = React.useState(false);
    const [apiEndpointForEdit, setApiEndpointForEdit] = React.useState("");
    const [addDialogOpened, setAddDialogOpened] = React.useState(false);

    useEffect(() => {
        setApiEndpoints(getAllApiEndpoints());
    }, [editDialogOpened, addDialogOpened]);

    return (
        <div className={isAssistant ? "priority-high dialog-backdrop-assistant" : "priority-high dialog-backdrop"}
             onMouseDown={(e) => {
                 e.stopPropagation();
                 setIsOpened(false);
             }}>
            {editDialogOpened ? <ApiEndpointEditDialog endpointId={apiEndpointForEdit} isOpened={editDialogOpened} setIsOpened={setEditDialogOpened} /> : null }
            {addDialogOpened ? <ApiEndpointEditDialog endpointId={""} isOpened={addDialogOpened} setIsOpened={setAddDialogOpened} /> : null }
            <MaterialDialog open={true}>
            <div className={"dialog-paper"} onMouseDown={(e) => {
                e.stopPropagation()
            }}>
                <h3 className={"dialog-title"}>Select API Endpoint</h3>
                <div className={isAssistant ? "dialog-content-assistant" : "dialog-content"}>
                    {
                        apiEndpoints.length > 0 ?
                            apiEndpoints.map((e, index) => {
                                return (
                                    <div key={index}
                                         className={sha256(e.label) === selectedApiEndpoint ? "selector-item-active" : "selector-item"}
                                         onClick={() => {
                                             setSelectedApiEndpoint(sha256(e.label));
                                         }}>

                                        <div style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            width: "100%",
                                        }}>
                                            <div>
                                                {e.label}
                                                <br/>
                                                {e.url}
                                            </div>
                                            <span onClick={() => {
                                                setApiEndpointForEdit(sha256(e.label));
                                                setEditDialogOpened(true);
                                            }} className={"material-symbols-outlined"}><Edit/></span>
                                        </div>
                                    </div>
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
                        setIsOpened(false);
                    }}>Cancel</MaterialButtonOutlined24>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <MaterialButtonTonal24 onClick={() => {
                        setAddDialogOpened(true);
                    }}>Add endpoint</MaterialButtonTonal24>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <MaterialButton24 onClick={() => {
                        if (selectedApiEndpoint !== "") {
                            setSelectedApiEndpointId(selectedApiEndpoint)
                            setIsOpened(false);
                        }
                    }}>Save</MaterialButton24>
                </div>
            </div>
            </MaterialDialog>
        </div>
    );
}

export default ApiEndpointSelector;
