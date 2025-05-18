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
import Placeholder from "./Placeholder";
import {MaterialButton24} from "../widgets/MaterialButton";
import {Link} from "react-router-dom";

function NotFound() {
    return (
        <Placeholder icon={"cancel"}>
            <p className={"placeholder-text"}>The page you are looking for does not exist.</p>
            <Link to={"/"}><MaterialButton24>Go to home</MaterialButton24></Link>
        </Placeholder>
    );
}

export default NotFound;