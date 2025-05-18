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
import {MaterialButton16, MaterialButton24, MaterialButtonTonal24} from "../widgets/MaterialButton";
import {sha256} from "js-sha256";
import PromptCard from "./PromptCard";
import {CircularProgress} from "@mui/material";
import PromptView from "./PromptView";
import Placeholder from "./Placeholder";
import {useNavigate, useParams} from "react-router-dom";
import PlaceholderLoading from "./PlaceholderLoading";
import {BrowserView, isMobile, MobileView} from 'react-device-detect';

const categories = [
    {
        "cat": "all",
        "icon": "done_all"
    },
    {
        "cat": "development",
        "icon": "data_object"
    },
    {
        "cat": "music",
        "icon": "music_note"
    },
    {
        "cat": "art",
        "icon": "palette"
    },
    {
        "cat": "culture",
        "icon": "museum"
    },
    {
        "cat": "business",
        "icon": "monitoring"
    },
    {
        "cat": "gaming",
        "icon": "sports_esports"
    },
    {
        "cat": "education",
        "icon": "school"
    },
    {
        "cat": "history",
        "icon": "history_edu"
    },
    {
        "cat": "food",
        "icon": "restaurant"
    },
    {
        "cat": "tourism",
        "icon": "hiking"
    },
    {
        "cat": "productivity",
        "icon": "group"
    },
    {
        "cat": "tools",
        "icon": "handyman"
    },
    {
        "cat": "entertainment",
        "icon": "attractions"
    },
    {
        "cat": "sport",
        "icon": "fitness_center"
    },
    {
        "cat": "health",
        "icon": "local_hospital"
    }
];

function setFullHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Set the height initially
setFullHeight();

// Re-calculate on resize or orientation change
window.addEventListener('resize', setFullHeight);
window.addEventListener('orientationchange', setFullHeight);

function PromptStore() {
    const [prompts, setPrompts] = React.useState([]);
    const [selectedCategory, setSelectedCategory] = React.useState("all");
    const [selectedType, setSelectedType] = React.useState("all");
    const [searchQuery, setSearchQuery] = React.useState("");
    const [selectedPrompt, setSelectedPrompt] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [uid, setUid] = React.useState(null);

    let { id } = useParams();

    useEffect(() => {
        setUid(id);
        setLoading(false);
    }, [id]);

    const fetchData = (query) => {
        fetch("https://assistant.teslasoft.org/api/v1/search?api_key=16790f7ac03237764a8a0ad36eede490&query="+query, {
            method: "GET",
        }).then(r => r.json())
        .then(r => {
            setPrompts(r);
        }).catch((error) => {
            console.error("Error fetching prompts", error);
        })
    }

    useEffect(() => {
        if (id !== undefined && id !== null && id !== "") {
            setLoading(true)
            fetch("https://assistant.teslasoft.org/api/v1/prompt?api_key=16790f7ac03237764a8a0ad36eede490&id="+id, {
                method: "GET",
            }).then(r => r.json())
            .then(r => {
                setLoading(false)
                setSelectedPrompt(r);
            }).catch((error) => {
                console.error("Error fetching prompts", error);
            })
        }
    }, [id]);

    useEffect(() => {
        setPrompts([]);
        fetchData(searchQuery);
    }, [searchQuery]);

    useEffect(() => {
        setPrompts([]);

        if (selectedCategory === "all") {
            fetchData("");
        } else {
            fetchData("cat:"+selectedCategory);
        }
    }, [selectedCategory]);

    const forceUpdate = () => {
        fetchData(searchQuery);

        if (selectedPrompt !== null) {
            setLoading(true)
            fetch("https://assistant.teslasoft.org/api/v1/prompt?api_key=16790f7ac03237764a8a0ad36eede490&id="+selectedPrompt.id, {
                method: "GET",
            }).then(r => r.json())
            .then(r => {
                setLoading(false)
                setSelectedPrompt(r);
            }).catch((error) => {
                console.error("Error fetching prompts", error);
            })
        }
    }

    const navigate = useNavigate()

    return (
        <div style={isMobile ? {
            height: "calc(calc(var(--vh, 1vh) * 100) - 80px)",
        } : {}} className={"prompt-window"}>
            <div className={isMobile ? "prompt-list-container-mob" : "prompt-list-container"}>
                <div className={isMobile ? "prompts-filter-mob" : "prompts-filter"}>
                    <h2 className={"page-title"}>Prompts Store</h2>
                    <div className={isMobile ? "search-box-mob" : "search-box-2"}>
                        <input className={"search-input"} type={"text"} placeholder={"Search prompts..."}
                               onChange={(e) => {
                                   setSearchQuery(e.target.value)
                               }}/>
                        <span className={"search-icon material-symbols-outlined"}>search</span>
                    </div>
                    <div style={{
                        height: "12px",
                        width: "100%"
                    }}/>
                    <div className={isMobile ? "categories-mob" : "categories"}>
                        {
                            categories.map((e) => (
                                <div onClick={() => {
                                    setSelectedCategory(e.cat === "" ? "uncategorized" : e.cat);
                                }}
                                     className={e.cat === selectedCategory ? "category-tile cat-active-" + e.cat : "category-tile cat-" + e.cat}
                                     key={sha256(e.icon)}>
                                    <span className={"material-symbols-outlined"}>{e.icon}</span>
                                </div>
                            ))
                        }
                    </div>
                    <div className={isMobile ? "filter-buttons-mob" : "filter-buttons"} style={isMobile ? {
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "12px",
                        marginLeft: "16px",
                        userSelect: "none"
                    } : {
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "12px",
                        marginLeft: "8px",
                        userSelect: "none"
                    }}>
                        {
                            selectedType === "all" ? <MaterialButton24 style={{
                                width: "100%",
                                flexGrow: 1
                            }}>All</MaterialButton24> : <MaterialButtonTonal24 style={{
                                width: "100%",
                                flexGrow: 1
                            }} onClick={() => {
                                setSearchQuery("");
                                setSelectedType("all");
                            }}>All</MaterialButtonTonal24>
                        }
                        {
                            selectedType === "gpt" ? <MaterialButton24 style={{
                                width: "100%",
                                flexGrow: 1
                            }}>GPT</MaterialButton24> : <MaterialButtonTonal24 style={{
                                width: "100%",
                                flexGrow: 1
                            }} onClick={() => {
                                setSearchQuery("type:gpt");
                                setSelectedType("gpt");
                            }}>GPT</MaterialButtonTonal24>
                        }
                        {
                            selectedType === "dalle" ? <MaterialButton24 style={{
                                width: "100%",
                                flexGrow: 1
                            }}>DALL-e</MaterialButton24> : <MaterialButtonTonal24 style={{
                                width: "100%",
                                flexGrow: 1
                            }} onClick={() => {
                                setSearchQuery("type:dall-e");
                                setSelectedType("dalle");
                            }}>DALL-e</MaterialButtonTonal24>
                        }
                    </div>
                    <div style={{
                        height: "12px",
                        width: "100%"
                    }}/>
                </div>
                <div className={isMobile ? "fab-area-mob" : "fw-2"}>
                    <MaterialButton16 className={"fab"} style={{
                        marginLeft: "16px",
                        marginRight: "16px"
                    }} onClick={() => {

                    }}>&nbsp;<span className={"material-symbols-outlined"}>add</span>&nbsp;
                        <span>Post your prompt</span>&nbsp;&nbsp;</MaterialButton16>
                </div>
                {
                    prompts.length === 0 ? <div className={isMobile ? "prompt-loader-mob" : "prompt-loader"}>
                        <CircularProgress style={{
                            color: "var(--color-accent-800)",
                            width: "64px",
                            height: "64px"
                        }}/>
                    </div> : <div style={isMobile ? {
                        height: "calc(calc(var(--vh, 1vh) * 100) - 80px - 268px)",
                    } : {}} className={isMobile ? "prompt-list-mob" : "prompt-list"}>
                        {
                            prompts.map((e) =>
                                <PromptCard key={e.id} prompt={e} onPromptClick={() => {
                                    navigate("/prompts/" + e.id)
                                }} selected={selectedPrompt}/>
                            )}
                        <div style={{
                            height: '100px'
                        }}></div>
                    </div>
                }
            </div>
            <MobileView>
                {
                    loading ? <PlaceholderLoading/> : null
                }
            </MobileView>
            {
                id !== undefined && id !== null ? <div className={"prompt-content"}>
                    {
                        loading ? <PlaceholderLoading/> : <>
                            {selectedPrompt !== null && selectedPrompt !== undefined ?
                                <PromptView prompt={selectedPrompt} updatePrompts={() => {
                                    forceUpdate()
                                }}/> : <PlaceholderLoading/>}
                        </>
                    }
                </div> : <BrowserView>
                    <div className={"prompt-content"}>
                        <Placeholder message={"Select a prompt to view more info."} icon={"view_cozy"}/>
                    </div>
                </BrowserView> }
        </div>
    );
}

export default PromptStore;