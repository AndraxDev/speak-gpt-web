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

import React from 'react';
import {BrowserView, MobileView} from "react-device-detect";
import Placeholder from "./Placeholder";
import {MaterialButton24, MaterialButtonOutlined24} from "../widgets/MaterialButton";
import {Link} from "react-router-dom";

function AssistantDeepLink() {
    return (
        <>
            <BrowserView className={"full-height"}>
                <Placeholder icon={"cancel"}>
                    <p className={"placeholder-text"}>This feature is only available on mobile devices.</p>
                    <Link to={"/"}><MaterialButton24>Go to home</MaterialButton24></Link>
                </Placeholder>
            </BrowserView>
            <MobileView className={"full-height"}>
                <Placeholder icon={"cancel"}>
                    <p className={"placeholder-text"}>You need to install SpeakGPT version 3.23 or above and allow it open external links to use this feature.</p>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        flexWrap: "wrap"
                    }}>
                        <a href={"/assistant"}><MaterialButton24>Launch SpeakGPT for Android</MaterialButton24></a>
                        &nbsp;&nbsp;&nbsp;
                        <Link to={"/"}><MaterialButtonOutlined24>Go to home</MaterialButtonOutlined24></Link>
                    </div>
                </Placeholder>
            </MobileView>
        </>
    );
}

export default AssistantDeepLink;