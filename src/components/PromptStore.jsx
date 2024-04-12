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
import {MaterialButton16, MaterialButton24, MaterialButtonTonal24} from "../widgets/MaterialButton";
import {sha256} from "js-sha256";

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

function PromptStore(props) {

    const [prompts, setPrompts] = React.useState([]);
    const [selectedCategory, setSelectedCategory] = React.useState("all");
    const [selectedType, setSelectedType] = React.useState("all");
    const [searchQuery, setSearchQuery] = React.useState("");

    useEffect(() => {
        fetch("https://gpt.teslasoft.org/api/v1//search.php?api_key=16790f7ac03237764a8a0ad36eede490&query=", {
            method: "POST",
        }).then(r => r.json())
        .then(r => {
            console.log("Prompts fetched", r);
            setPrompts(r);
        }).catch((error) => {
            console.error("Error fetching prompts", error);
        })
    }, []);

    return (
        <div className={"prompt-window"}>
            <div className={"prompt-list"}>
                <h2 className={"page-title"}>Prompts Store</h2>
                <div className={"search-box"}>
                    <input className={"search-input"} type={"text"} placeholder={"Search prompts..."} onChange={(e) => {
                        setSearchQuery(e.target.value)
                    }}/>
                    <span className={"search-icon material-symbols-outlined"}>search</span>
                </div>
                <br/>
                <div className={"categories"}>
                    {
                        categories.map((e) => (
                            <div onClick={() => {
                                setSelectedCategory(e.cat);
                            }} className={e.cat === selectedCategory ? "category-tile cat-active-" + e.cat : "category-tile cat-" + e.cat} key={sha256(e.icon)}>
                                <span className={"material-symbols-outlined"}>{e.icon}</span>
                            </div>
                        ))
                    }
                </div>
                <div style={{
                    "display": "flex",
                    "flexDirection": "row",
                    "justifyContent": "center",
                    "alignItems": "center",
                    marginLeft: "20px",
                    width: "344px",
                    userSelect: "none"
                }}>
                    {
                        selectedType === "all" ? <MaterialButton24 style={{
                            width: "140px",
                        }}>All</MaterialButton24> : <MaterialButtonTonal24 style={{
                            width: "140px"
                        }} onClick={() => {
                            setSelectedType("all");
                        }}>All</MaterialButtonTonal24>
                    }
                    {
                        selectedType === "gpt" ? <MaterialButton24 style={{
                            width: "140px",
                            marginLeft: "11px",
                            marginRight: "11px",
                        }}>GPT</MaterialButton24> : <MaterialButtonTonal24 style={{
                            width: "140px",
                            marginLeft: "11px",
                            marginRight: "11px"
                        }} onClick={() => {
                            setSelectedType("gpt");
                        }}>GPT</MaterialButtonTonal24>
                    }
                    {
                        selectedType === "dalle" ? <MaterialButton24 style={{
                            width: "140px",
                        }}>DALL-e</MaterialButton24> : <MaterialButtonTonal24 style={{
                            width: "140px"
                        }} onClick={() => {
                            setSelectedType("dalle");

                        }}>DALL-e</MaterialButtonTonal24>
                    }
                </div>
                <div className={"fw"}>
                    <MaterialButton16 className={"fab"} style={{
                        marginLeft: "16px",
                        marginRight: "16px"
                    }} onClick={() => {

                    }}>&nbsp;<span className={"material-symbols-outlined"}>add</span>&nbsp;
                        <span>Add a prompt</span>&nbsp;&nbsp;</MaterialButton16>
                </div>

            </div>
            <div className={"prompt-content"}>

            </div>
        </div>
    );
}

export default PromptStore;