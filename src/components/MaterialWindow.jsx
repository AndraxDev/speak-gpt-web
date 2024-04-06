import React from 'react';
import ApiKeyDialog from "./ApiKeyDialog";
import NavigationBar from "../widgets/NavigationBar";

function MaterialWindow({children, page, ...props}) {
    return (
        <div>
            <NavigationBar page={page}/>
            <div className={"content"}>
                {children}
            </div>
            <ApiKeyDialog/>
        </div>
    );
}

export default MaterialWindow;