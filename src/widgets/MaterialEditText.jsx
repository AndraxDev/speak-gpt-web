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

import { styled } from '@mui/material/styles';
import './../theme/colors.css'
import {TextField} from "@mui/material";

export const MaterialEditText = styled(TextField)(({ theme }) => ({
    '&': {
        width: "100%"
    },
    '& label': {
        color: 'var(--color-accent-900)',
    },
    '& label.Mui-focused': {
        color: 'var(--color-accent-900)',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: 'var(--color-accent-900)',
    },
    '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
            borderColor: 'var(--color-accent-900)',
            color: 'var(--color-accent-900)',
        },
    },
}));