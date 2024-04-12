import React, {useEffect} from 'react';
import {MaterialButton16} from "../widgets/MaterialButton";
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
                    <input className={"search-input"} type={"text"} placeholder={"Search prompts..."}/>
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
                <br/>
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