import React, {useEffect} from 'react';
import {MaterialButton16} from "../widgets/MaterialButton";

function PromptStore(props) {

    const [prompts, setPrompts] = React.useState([]);

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
                    <input className={"search-input"} type={"text"} placeholder={"Search prompts..."} />
                    <span className={"search-icon material-symbols-outlined"}>search</span>
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