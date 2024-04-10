const defaultSettings = {
    model: "gpt-3.5-turbo",
    dalleVersion: "2",
    resolution: "256x256",
    systemMessage: ""
}

const getSettingsString = (chatId) => {
    if (chatId === "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855") return JSON.stringify(defaultSettings);
    return chatId === "" ? window.localStorage.getItem("globalSettings") : window.localStorage.getItem(chatId + ".settings");
}

const setSettingsString = (chatId, settings) => {
    if (chatId === "") {
        window.localStorage.setItem("globalSettings", settings);
    } else {
        window.localStorage.setItem(chatId + ".settings", settings);
    }
}

export const copySettings = (chatId, newChatId) => {
    setSettingsString(newChatId, getSettingsString(chatId));
}

export const getSettingsJSON = (chatId) => {
    return getSettingsString(chatId) !== undefined && getSettingsString(chatId) !== null ? JSON.parse(getSettingsString(chatId)) : defaultSettings;
}

export const setSettingsJSON = (chatId, settings) => {
    setSettingsString(chatId, JSON.stringify(settings));
}

export const getModel = (chatId) => {
    return getSettingsJSON(chatId).model ? getSettingsJSON(chatId).model : defaultSettings.model;
}

export const setModel = (chatId, model) => {
    let settings = getSettingsJSON(chatId);
    settings.model = model;
    setSettingsJSON(chatId, settings);
}

export const getDalleVersion = (chatId) => {
    return getSettingsJSON(chatId).dalleVersion ? getSettingsJSON(chatId).dalleVersion : defaultSettings.dalleVersion;
}

export const setDalleVersion = (chatId, dalleVersion) => {
    let settings = getSettingsJSON(chatId);
    settings.dalleVersion = dalleVersion;
    setSettingsJSON(chatId, settings);
}

export const getResolution = (chatId) => {
    return getSettingsJSON(chatId).resolution ? getSettingsJSON(chatId).resolution : defaultSettings.resolution;
}

export const setResolution = (chatId, resolution) => {
    let settings = getSettingsJSON(chatId);
    settings.resolution = resolution;
    setSettingsJSON(chatId, settings);
}

export const getSystemMessage = (chatId) => {
    return getSettingsJSON(chatId).systemMessage ? getSettingsJSON(chatId).systemMessage : defaultSettings.systemMessage;
}

export const setSystemMessage = (chatId, systemMessage) => {
    let settings = getSettingsJSON(chatId);
    settings.systemMessage = systemMessage;
    setSettingsJSON(chatId, settings);
}