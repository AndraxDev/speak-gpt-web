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

/* Default settings templates. Do not import it directly */
const defaultSettings = {
    model: "gpt-3.5-turbo",
    dalleVersion: "2",
    resolution: "256x256",
    systemMessage: "",
    apiHost: "https://api.openai.com/v1/"
}

const defaultSettingsMax = {
    model: "gpt-4-turbo-2024-04-09",
    dalleVersion: "3",
    resolution: "1024x1024",
    systemMessage: "",
    apiHost: "https://api.openai.com/v1/"
}

const getDefaultSettings = () => {
    return localStorage.getItem("globalSettings") === null ? defaultSettings : JSON.parse(localStorage.getItem("globalSettings"));
}

const getSettingsString = (chatId) => {
    if (chatId === "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855") return JSON.stringify(getDefaultSettings());
    return chatId === "" ? window.localStorage.getItem("globalSettings") : window.localStorage.getItem(chatId + ".settings");
}

const setSettingsString = (chatId, settings) => {
    if (chatId === "") {
        window.localStorage.setItem("globalSettings", settings);
    } else {
        window.localStorage.setItem(chatId + ".settings", settings);
    }
}

export const getSettingsJSON = (chatId) => {
    return getSettingsString(chatId) !== undefined && getSettingsString(chatId) !== null ? JSON.parse(getSettingsString(chatId)) : getDefaultSettings();
}

export const setSettingsJSON = (chatId, settings) => {
    setSettingsString(chatId, JSON.stringify(settings));
}

/* Set max global settings */
export const setMaxSettings = () => {
    window.localStorage.setItem("globalSettings", JSON.stringify(defaultSettingsMax));
}

/* Set min global settings */
export const setMinSettings = () => {
    window.localStorage.setItem("globalSettings", JSON.stringify(defaultSettings));
}

export const copySettings = (chatId, newChatId) => {
    setSettingsString(newChatId, getSettingsString(chatId));
}

export const getModel = (chatId) => {
    return getSettingsJSON(chatId).model ? getSettingsJSON(chatId).model : getDefaultSettings().model;
}

export const setModel = (chatId, model) => {
    let settings = getSettingsJSON(chatId);
    settings.model = model;
    setSettingsJSON(chatId, settings);
}

export const getGlobalModel = () => {
    return getDefaultSettings().model;
}

export const setGlobalModel = (model) => {
    let settings = getDefaultSettings();
    settings.model = model;
    window.localStorage.setItem("globalSettings", JSON.stringify(settings));
}

export const getDalleVersion = (chatId) => {
    return getSettingsJSON(chatId).dalleVersion ? getSettingsJSON(chatId).dalleVersion : getDefaultSettings().dalleVersion;
}

export const setDalleVersion = (chatId, dalleVersion) => {
    let settings = getSettingsJSON(chatId);
    settings.dalleVersion = dalleVersion;
    setSettingsJSON(chatId, settings);
}

export const getGlobalDalleVersion = () => {
    return getDefaultSettings().dalleVersion;
}

export const setGlobalDalleVersion = (dalleVersion) => {
    let settings = getDefaultSettings();
    settings.dalleVersion = dalleVersion;
    window.localStorage.setItem("globalSettings", JSON.stringify(settings));
}

export const getResolution = (chatId) => {
    return getSettingsJSON(chatId).resolution ? getSettingsJSON(chatId).resolution : getDefaultSettings().resolution;
}

export const setResolution = (chatId, resolution) => {
    let settings = getSettingsJSON(chatId);
    settings.resolution = resolution;
    setSettingsJSON(chatId, settings);
}

export const getGlobalResolution = () => {
    return getDefaultSettings().resolution;
}

export const setGlobalResolution = (resolution) => {
    let settings = getDefaultSettings();
    settings.resolution = resolution;
    window.localStorage.setItem("globalSettings", JSON.stringify(settings));
}

export const getSystemMessage = (chatId) => {
    return getSettingsJSON(chatId).systemMessage ? getSettingsJSON(chatId).systemMessage : getDefaultSettings().systemMessage;
}

export const setSystemMessage = (chatId, systemMessage) => {
    let settings = getSettingsJSON(chatId);
    settings.systemMessage = systemMessage;
    setSettingsJSON(chatId, settings);
}

export const getGlobalSystemMessage = () => {
    return getDefaultSettings().systemMessage;
}

export const setGlobalSystemMessage = (systemMessage) => {
    let settings = getDefaultSettings();
    settings.systemMessage = systemMessage;
    window.localStorage.setItem("globalSettings", JSON.stringify(settings));
}

export const getApiHost = (chatId) => {
    let s = getSettingsJSON(chatId).apiHost !== null && getSettingsJSON(chatId).apiHost !== undefined && getSettingsJSON(chatId).apiHost.toString().trim() !== "" ? getSettingsJSON(chatId).apiHost : getDefaultSettings().apiHost;
    if (s === undefined) s = "https://api.openai.com/v1/";
    console.log(s)
    return s
}

export const setApiHost = (chatId, apiHost) => {
    let settings = getSettingsJSON(chatId);
    settings.apiHost = apiHost;
    setSettingsJSON(chatId, settings);
}
