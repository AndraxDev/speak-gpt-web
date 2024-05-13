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
import {sha256} from "js-sha256";

const defaultApiEndpoint = {
    label: "Default",
    url: "https://api.openai.com/v1/",
    key: localStorage.getItem("apiKey") === null ? "" : localStorage.getItem("apiKey")
}

const globalSettings = window.localStorage.getItem("globalSettings") == null ? {
    model: "gpt-3.5-turbo",
    dalleVersion: "2",
    resolution: "256x256",
    systemMessage: "",
    apiHost: "https://api.openai.com/v1/", /* @deprecated */
    apiEndpointId: localStorage.getItem("api__label") === null ? sha256("Default") : sha256(defaultApiEndpoint.label)
} : JSON.parse(window.localStorage.getItem("globalSettings"));

const defaultSettings = {
    model: "gpt-3.5-turbo",
    dalleVersion: "2",
    resolution: "256x256",
    systemMessage: "",
    apiHost: "https://api.openai.com/v1/", /* @deprecated */
    apiEndpointId: globalSettings.apiEndpointId === null ? sha256("Default") : globalSettings.apiEndpointId
}

const defaultSettingsMax = {
    model: "gpt-4o",
    dalleVersion: "3",
    resolution: "1024x1024",
    systemMessage: "",
    apiHost: "https://api.openai.com/v1/", /* @deprecated */
    apiEndpointId: globalSettings.apiEndpointId === null ? sha256("Default") : globalSettings.apiEndpointId
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

export const migrateFromLegacyAPIs = () => {
    if (getAllApiEndpoints() === null || getAllApiEndpoints() === undefined || getAllApiEndpoints().length === 0) {
        console.log("No API endpoints found, migrating from legacy APIs...");
        setApiEndpointById("Default", "https://api.openai.com/v1/", localStorage.getItem("apiKey"));
        setApiEndpointId("", sha256("Default"));
        setGlobalEndpointId(sha256("Default"));
    }
}

/*
* @deprecated getApiHost() is deprecated. Use getApiEndpoint() to obtain API host.
* */
export const getApiHost = (chatId) => {
    console.warn("getApiHost() is deprecated. Use getApiEndpoint() to obtain API host.");
    let s = getSettingsJSON(chatId).apiHost !== null && getSettingsJSON(chatId).apiHost !== undefined && getSettingsJSON(chatId).apiHost.toString().trim() !== "" ? getSettingsJSON(chatId).apiHost : getDefaultSettings().apiHost;
    if (s === undefined) s = "https://api.openai.com/v1/";
    return s
}

/*
* @deprecated setApiHost() is deprecated. Use setApiEndpoint() to set API host.
* */
export const setApiHost = (chatId, apiHost) => {
    console.warn("setApiHost() is deprecated. Use setApiEndpoint() to set API host.");
    let settings = getSettingsJSON(chatId);
    settings.apiHost = apiHost;
    setSettingsJSON(chatId, settings);
}

export const getApiEndpointId = (chatId) => {
    return getSettingsJSON(chatId).apiEndpointId ? getSettingsJSON(chatId).apiEndpointId : getDefaultSettings().apiEndpointId;
}

export const setApiEndpointId = (chatId, apiEndpointId) => {
    let settings = getSettingsJSON(chatId);
    settings.apiEndpointId = apiEndpointId;
    setSettingsJSON(chatId, settings);
}

export const getGlobalEndpointId = () => {
    return getDefaultSettings().apiEndpointId;
}

export const setGlobalEndpointId = (apiEndpointId) => {
    let settings = getDefaultSettings();
    settings.apiEndpointId = apiEndpointId;
    window.localStorage.setItem("globalSettings", JSON.stringify(settings));
}

export const getApiEndpointById = (endpointId) => {
    return {
        label: localStorage.getItem("api_" + endpointId + "_label") == null ? defaultApiEndpoint.label : localStorage.getItem("api_" + endpointId + "_label"),
        url: localStorage.getItem("api_" + endpointId + "_url") == null ? defaultApiEndpoint.url : localStorage.getItem("api_" + endpointId + "_url"),
        key: localStorage.getItem("api_" + endpointId + "_key") == null ? defaultApiEndpoint.key : localStorage.getItem("api_" + endpointId + "_key"),
    }
}

export const setApiEndpointById = (label, url, key) => {
    localStorage.setItem("api_" + sha256(label) + "_label", label);
    localStorage.setItem("api_" + sha256(label) + "_url", url);

    if (key !== "") {
        localStorage.setItem("api_" + sha256(label) + "_key", key);
    }
}

export const getFavoriteModels = () => {
    return JSON.parse(localStorage.getItem("favoriteModels"));
}

export const setFavoriteModels = (models) => {
    localStorage.setItem("favoriteModels", JSON.stringify(models));
}

export const getAllApiEndpoints = () => {
    let endpoints = [];
    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i).startsWith("api_") && localStorage.key(i).endsWith("_label")) {
            let id = localStorage.key(i).replace("api_", "").replace("_label", "");
            endpoints.push({
                label: localStorage.getItem("api_" + id + "_label"),
                url: localStorage.getItem("api_" + id + "_url"),
                key: localStorage.getItem("api_" + id + "_key")
            });
        }
    }
    return endpoints;
}

export const findOpenAIEndpointIdOrNull = () => {
    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i).startsWith("api_") && localStorage.key(i).endsWith("_label")) {
            let id = localStorage.key(i).replace("api_", "").replace("_label", "");
            let endpoint = getApiEndpointById(id);
            if (endpoint.url === "https://api.openai.com/v1/") {
                return id;
            }
        }
    }

    return null;
}

export const renameEndpoint = (endpointId, label) => {
    let endpoint = getApiEndpointById(endpointId);
    endpoint.label = label;
    setApiEndpointById(endpoint.label, endpoint.url, endpoint.key);
    localStorage.removeItem("api_" + endpointId + "_label");
    localStorage.removeItem("api_" + endpointId + "_url");
    localStorage.removeItem("api_" + endpointId + "_key");
}

export const deleteEndpoint = (endpointId) => {
    localStorage.removeItem("api_" + endpointId + "_label");
    localStorage.removeItem("api_" + endpointId + "_url");
    localStorage.removeItem("api_" + endpointId + "_key");
}

export const addFavoriteModel = (model) => {
    let models = getFavoriteModels();
    if (models === null) models = [];
    models.push(model);
    setFavoriteModels(models);
}

export const removeFavoriteModel = (model) => {
    let models = getFavoriteModels();
    if (models === null) models = [];
    models = models.filter((e) => e !== model);
    setFavoriteModels(models);
}