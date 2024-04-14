import React from 'react';

function PromptCard({prompt, onPromptClick}) {
    return (
        <div onClick={() => {
            onPromptClick();
        }}>

        </div>
    );
}

export default PromptCard;