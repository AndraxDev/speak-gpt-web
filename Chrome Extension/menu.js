// chrome.contextMenus.create(
//     {
//         title: "SpeakGPT (With params)",
//         contexts: ["selection"],
//         id: "SpeakGPT",
//     }
// );
//
// chrome.contextMenus.create(
//     {
//         title: "SpeakGPT (No params)",
//         contexts: ["selection"],
//         id: "SpeakGPTNoParams",
//     }
// );
//
// chrome.contextMenus.onClicked.addListener((info, tab) => {
//     if (info.menuItemId === "SpeakGPT") {
//         let selectedText = info.selectionText;
//
//         run(selectedText, "1")
//     } else if (info.menuItemId === "SpeakGPTNoParams") {
//         let selectedText = info.selectionText;
//
//         run(selectedText, "0")
//     }
// });
//
// function run(selectedText, paramsEnabled) {
//     let port = chrome.runtime.connectNative('org.teslasoft.assistant');
//
//     port.postMessage({ text: 'run_batch', arg1: selectedText, arg2: paramsEnabled });
//
//     port.onMessage.addListener((response) => {
//         console.log("Received from Native Messaging Host: " + JSON.stringify(response));
//     });
//
//     port.onDisconnect.addListener(() => {
//         console.log("Disconnected from Native Messaging Host");
//     });
// }