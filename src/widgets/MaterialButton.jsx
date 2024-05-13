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

import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import './../theme/colors.css'

export const MaterialButton = styled(Button)(({ theme }) => ({
    color: "var(--color-accent-50)",
    backgroundColor: "var(--color-accent-800)",
    textTransform: "none",
    borderRadius: "12px",
    verticalAlign: "middle",
    '&:hover': {
        backgroundColor: "var(--color-accent-900)",
    },
}));

export const MaterialButton24 = styled(Button)(({ theme }) => ({
    color: "var(--color-accent-50)",
    backgroundColor: "var(--color-accent-800)",
    textTransform: "none",
    borderRadius: "24px",
    paddingLeft: "12px",
    paddingRight: "12px",
    fontSize: "14px",
    height: "40px",
    boxSizing: "border-box",
    border: "1px solid var(--color-accent-800)",
    verticalAlign: "middle",
    '&:hover': {
        backgroundColor: "var(--color-accent-900)",
        border: "1px solid var(--color-accent-900)",
    },
}));

export const MaterialButton16 = styled(Button)(({ theme }) => ({
    color: "var(--color-accent-50)",
    backgroundColor: "var(--color-accent-800)",
    textTransform: "none",
    borderRadius: "16px",
    paddingLeft: "12px",
    paddingRight: "12px",
    verticalAlign: "middle",
    '&:hover': {
        backgroundColor: "var(--color-accent-900)",
    },
}));

export const MaterialButtonTonal = styled(Button)(({ theme }) => ({
    color: "var(--color-accent-800)",
    backgroundColor: "var(--color-accent-300)",
    textTransform: "none",
    boxShadow: "none",
    borderRadius: "12px",
    paddingLeft: "12px",
    paddingRight: "12px",
    verticalAlign: "middle",
    '&:hover': {
        backgroundColor: "var(--color-accent-400)",
        boxShadow: "none",
    },
}));

export const MaterialButtonTonalIcon = styled(Button)(({ theme }) => ({
    color: "var(--color-accent-800)",
    backgroundColor: "var(--color-accent-200)",
    textTransform: "none",
    boxShadow: "none",
    borderRadius: "24px",
    paddingLeft: "0",
    paddingRight: "0",
    width: "48px",
    height: "48px",
    verticalAlign: "middle",
    '&:hover': {
        backgroundColor: "var(--color-accent-300)",
        boxShadow: "none",
    },
}));

export const MaterialButtonTonalIconV2 = styled(Button)(({ theme }) => ({
    color: "var(--color-accent-800)",
    backgroundColor: "transparent",
    textTransform: "none",
    boxShadow: "none",
    borderRadius: "64px",
    paddingLeft: "0",
    paddingRight: "0",
    width: "64px",
    height: "64px",
    verticalAlign: "middle",
    '&:hover': {
        backgroundColor: "var(--color-accent-100)",
        boxShadow: "none",
    },
}));

export const MaterialButtonTonalIconV3 = styled(Button)(({ theme }) => ({
    color: "var(--color-accent-800)",
    backgroundColor: "#212121",
    textTransform: "none",
    boxShadow: "none",
    borderRadius: "24px",
    paddingLeft: "0",
    paddingRight: "0",
    width: "48px",
    height: "48px",
    verticalAlign: "middle",
    '&:hover': {
        backgroundColor: "#323232",
        boxShadow: "none",
    },
}));

export const MaterialButtonTonal16 = styled(Button)(({ theme }) => ({
    color: "var(--color-accent-800)",
    backgroundColor: "var(--color-accent-300)",
    textTransform: "none",
    boxShadow: "none",
    borderRadius: "16px",
    paddingLeft: "12px",
    paddingRight: "12px",
    fontSize: "12px",
    height: "40px",
    boxSizing: "border-box",
    verticalAlign: "middle",
    '&:hover': {
        backgroundColor: "var(--color-accent-400)",
        boxShadow: "none"
    },
}));

export const MaterialButtonTonal16V2 = styled(Button)(({ theme }) => ({
    color: "var(--color-accent-800)",
    backgroundColor: "var(--color-accent-200)",
    textTransform: "none",
    boxShadow: "none",
    borderRadius: "16px",
    paddingLeft: "12px",
    paddingRight: "12px",
    fontSize: "12px",
    height: "40px",
    boxSizing: "border-box",
    verticalAlign: "middle",
    '&:hover': {
        backgroundColor: "var(--color-accent-300)",
        boxShadow: "none"
    },
}));

export const MaterialButtonTonal24 = styled(Button)(({ theme }) => ({
    color: "var(--color-accent-800)",
    backgroundColor: "var(--color-accent-300)",
    textTransform: "none",
    boxShadow: "none",
    borderRadius: "24px",
    border: "1px solid var(--color-accent-300)",
    paddingLeft: "12px",
    paddingRight: "12px",
    fontSize: "14px",
    height: "40px",
    boxSizing: "border-box",
    verticalAlign: "middle",
    '&:hover': {
        backgroundColor: "var(--color-accent-400)",
        boxShadow: "none",
        border: "1px solid var(--color-accent-400)",
    },
}));

export const MaterialButtonTonal24Icon = styled(Button)(({ theme }) => ({
    color: "var(--color-accent-800)",
    backgroundColor: "var(--color-accent-300)",
    textTransform: "none",
    boxShadow: "none",
    borderRadius: "50pc",
    border: "1px solid var(--color-accent-300)",
    paddingLeft: "12px",
    paddingRight: "12px",
    fontSize: "12px",
    boxSizing: "border-box",
    verticalAlign: "middle",
    '&:hover': {
        backgroundColor: "var(--color-accent-400)",
        boxShadow: "none",
        border: "1px solid var(--color-accent-400)",
    },
}));

export const MaterialButtonCard = styled(Button)(({ theme }) => ({
    color: "var(--color-accent-800)",
    backgroundColor: "var(--color-accent-200)",
    borderRadius: "24px",
    textTransform: "none",
    width: "260px",
    height: "260px",
    verticalAlign: "middle",
    '&:hover': {
        backgroundColor: "var(--color-accent-300)",
    },
}));

export const MaterialButtonError = styled(Button)(({ theme }) => ({
    color: "var(--color-warn)",
    backgroundColor: "rgba(255,103,103,0.2)",
    textTransform: "none",
    borderRadius: "50pc",
    paddingLeft: "12px",
    paddingRight: "12px",
    paddingTop: "10px",
    paddingBottom: "10px",
    verticalAlign: "middle",
    boxSizing: "border-box",
    fontSize: "12px",
    outline: "1px solid rgba(255,103,103,0.2)",
    '&:hover': {
        backgroundColor: "var(--color-warn-transparent-hover)",
        outline: "1px solid var(--color-warn-transparent-hover)",
    },
}));

export const MaterialButtonErrorCard = styled(Button)(({ theme }) => ({
    color: "var(--color-warn)",
    backgroundColor: "var(--color-warn-transparent)",
    borderRadius: "24px",
    width: "260px",
    height: "260px",
    textTransform: "none",
    border: "1px solid var(--color-warn-transparent)",
    verticalAlign: "middle",
    '&:hover': {
        backgroundColor: "var(--color-warn-transparent)",
        border: "1px solid var(--color-warn-transparent)",
    },
}));

export const MaterialButtonOutlined = styled(Button)(({ theme }) => ({
    color: "var(--color-accent-800)",
    borderColor: "var(--color-accent-800)",
    textTransform: "none",
    border: "1px solid var(--color-accent-800)",
    paddingLeft: "12px",
    paddingRight: "12px",
    verticalAlign: "middle",
    '&:hover': {
        backgroundColor: "var(--color-primary-accent-transparent)",
        borderColor: "var(--color-accent-900)",
        border: "1px solid var(--color-accent-900)",
    },
}));

export const MaterialButtonOutlined24 = styled(Button)(({ theme }) => ({
    color: "var(--color-accent-800)",
    borderColor: "var(--color-accent-800)",
    textTransform: "none",
    borderRadius: "24px",
    border: "1px solid var(--color-accent-800)",
    paddingLeft: "12px",
    paddingRight: "12px",
    fontSize: "12px",
    height: "40px",
    boxSizing: "border-box",
    verticalAlign: "middle",
    '&:hover': {
        backgroundColor: "var(--color-primary-accent-transparent)",
        borderColor: "var(--color-accent-900)",
        border: "1px solid var(--color-accent-900)",
    },
}));