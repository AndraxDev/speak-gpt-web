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

import React from 'react';

function Placeholder({children, icon, message}) {
    return (
        <div className={"placeholder-bg"}>
            <span style={{
                fontSize: "120px"
            }} className={"placeholder-icon material-symbols-outlined"}>{icon}</span>
            { message === undefined || message === null ? children : <p className={"placeholder-text"}>{message}</p> }
        </div>
    );
}

export default Placeholder;