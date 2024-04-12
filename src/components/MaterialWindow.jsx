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