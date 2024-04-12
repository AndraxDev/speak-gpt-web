import React from 'react';

function ProTip({text}) {
    return (
        <div>
            <p style={{
                width: "300px",
                minHeight: "50px",
                margin: "8px"
            }} className={"hint"}>{text}</p>
        </div>
    );
}

export default ProTip;