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

export const BaseTheme = {
    palette: {
        mode: 'dark',
        primary: {
            main: '#3786ff',
        },
        secondary: {
            main: '#00ffff',
        },
        error: {
            main: '#db4437',
        },
        warning: {
            main: '#ff3d00',
        },
        success: {
            main: '#2e8b57',
        },
    },

    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '50pc',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    minWidth: 320,
                },

            },
        },
        MuiDialogContentText: {
            styleOverrides: {
                root: {
                    overflowWrap: "anywhere",
                    userSelect: "text",
                },
            },
        }
    },
}
