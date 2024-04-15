import React from 'react';

function PromptCard({prompt, onPromptClick}) {
    return (
        <div className={"card cat-" + prompt.category} onClick={() => {
            onPromptClick();
        }}>
            <p className={"card-first-line"}>{prompt.name}</p>
            <p className={"card-second-line"}>{prompt.desc}</p>
            <div className={"card-third-line"}><p className={"card-author"}>{prompt.author}</p><div className={"like"}><span className={"material-symbols-outlined"}>thumb_up</span>&nbsp;<span>{prompt.likes}</span></div></div>
        </div>
    );
}

export default PromptCard;