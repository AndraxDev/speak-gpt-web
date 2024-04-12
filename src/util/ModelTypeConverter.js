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

export const modelToType = (modelName) => {
    if (modelName === "gpt-3.5-turbo-0125") {
        return "GPT 3.5 (0125)"
    } else if (modelName.includes("gpt-3.5-turbo")) {
        return "GPT 3.5"
    } else if (modelName.includes("gpt-4-turbo")) {
        return "GPT 4 Turbo"
    } else if (modelName.includes("gpt-4")) {
        return "GPT 4"
    } else {
        return "FT"
    }
}