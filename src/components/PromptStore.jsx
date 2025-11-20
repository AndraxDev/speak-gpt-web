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
import CircularProgress from "@mui/material/CircularProgress";
import PromptView from "./PromptView";
import Placeholder from "./Placeholder";
import {useNavigate, useParams} from "react-router-dom";
import PlaceholderLoading from "./PlaceholderLoading";
import {BrowserView, isMobile, MobileView} from 'react-device-detect';
import Add from "@mui/icons-material/Add";
import Attractions from "@mui/icons-material/Attractions";
import BarChart from "@mui/icons-material/BarChart";
import DataObject from "@mui/icons-material/DataObject";
import DoneAll from "@mui/icons-material/DoneAll";
import FitnessCenter from "@mui/icons-material/FitnessCenter";
import Group from "@mui/icons-material/Group";
import Handyman from "@mui/icons-material/Handyman";
import Hiking from "@mui/icons-material/Hiking";
import HistoryEdu from "@mui/icons-material/HistoryEdu";
import LocalHospital from "@mui/icons-material/LocalHospital";
import Museum from "@mui/icons-material/Museum";
import MusicNote from "@mui/icons-material/MusicNote";
import Palette from "@mui/icons-material/Palette";
import Restaurant from "@mui/icons-material/Restaurant";
import School from "@mui/icons-material/School";
import SearchRounded from "@mui/icons-material/SearchRounded";
import SportsEsports from "@mui/icons-material/SportsEsports";
import ViewCozy from "@mui/icons-material/ViewCozy";

const categories = [
    {
        "cat": "all",
        "icon": <DoneAll/>
    },
    {
        "cat": "development",
        "icon": <DataObject/>
    },
    {
        "cat": "music",
        "icon": <MusicNote/>
    },
    {
        "cat": "art",
        "icon": <Palette/>
    },
    {
        "cat": "culture",
        "icon": <Museum/>
    },
    {
        "cat": "business",
        "icon": <BarChart/>
    },
    {
        "cat": "gaming",
        "icon": <SportsEsports/>
    },
    {
        "cat": "education",
        "icon": <School/>
    },
    {
        "cat": "history",
        "icon": <HistoryEdu/>
    },
    {
        "cat": "food",
        "icon": <Restaurant/>
    },
    {
        "cat": "tourism",
        "icon": <Hiking/>
    },
    {
        "cat": "productivity",
        "icon": <Group/>
    },
    {
        "cat": "tools",
        "icon": <Handyman/>
    },
    {
        "cat": "entertainment",
        "icon": <Attractions/>
    },
    {
        "cat": "sport",
        "icon": <FitnessCenter/>
    },
    {
        "cat": "health",
        "icon": <LocalHospital/>
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
    //eslint-disable-next-line no-unused-vars
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
            height: "calc(100dvh - 80px)",
        } : {}} className={"prompt-window"}>
            <div className={isMobile ? "prompt-list-container-mob" : "prompt-list-container"}>
                <div className={isMobile ? "prompts-filter-mob" : "prompts-filter"}>
                    <h2 className={"page-title"}>Prompt Library</h2>
                    <div className={isMobile ? "search-box-mob" : "search-box-2"}>
                        <input className={"search-input"} type={"text"} placeholder={"Search prompts..."}
                               onChange={(e) => {
                                   setSearchQuery(e.target.value)
                               }}/>
                        <span className={"search-icon material-symbols-outlined"}><SearchRounded/></span>
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
                                     key={sha256(e.cat)}>
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
                    <BrowserView>
                        <MaterialButton16 className={"fab"} style={{
                            marginLeft: "10px",
                            marginRight: "10px"
                        }} onClick={() => {

                        }}>&nbsp;<span className={"material-symbols-outlined"}><Add/></span>&nbsp;
                            <span>Post your prompt</span>&nbsp;&nbsp;</MaterialButton16>
                    </BrowserView>
                    <MobileView>
                        <MaterialButton16 className={"fab"} style={{
                            marginLeft: "16px",
                            marginRight: "16px"
                        }} onClick={() => {

                        }}>&nbsp;<span className={"material-symbols-outlined"}><Add/></span>&nbsp;
                            <span>Post your prompt</span>&nbsp;&nbsp;</MaterialButton16>
                    </MobileView>
                </div>
                {
                    prompts.length === 0 ? <div className={isMobile ? "prompt-loader-mob" : "prompt-loader"}>
                        <CircularProgress style={{
                            color: "var(--color-accent-800)",
                            width: "64px",
                            height: "64px"
                        }}/>
                    </div> : <div style={isMobile ? {
                        height: "calc(100dvh - 94px - 268px)",
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
                        <Placeholder message={"Select a prompt to view more info."} icon={<ViewCozy fontSize={"inherit"} />}/>
                    </div>
                </BrowserView> }
        </div>
    );
}

export default PromptStore;