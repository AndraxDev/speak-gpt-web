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
import DocPage from "../components/DocPage";

const pageContent = `
> Name: Dmytro Ostapenko (AndraxDev)
>
> Email: dostapenko82@gmail.com
>
> Phone: +421951829517
>
> Legal address: Južná trieda 4B, 04001 Košice, Slovakia 04001
>
> Legal entity ID: 55545386
>
> Site: [andrax.dev](https://andrax.dev)
>
> GitHub: [github.com/AndraxDev](https://github.com/AndraxDev)
`;

function Contact() {
    return (
        <DocPage title={"Contact us"}>
            {pageContent}
        </DocPage>
    );
}

export default Contact;