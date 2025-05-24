// function quickPrompt() {
//     let selectedText = document.getElementById("prompt").value;
//
//     document.getElementById("prompt").value = "";
//
//     let port = chrome.runtime.connectNative('org.teslasoft.assistant');
//
//     port.postMessage({ text: 'run_batch', arg1: selectedText, arg2: '0' });
//
//     port.onMessage.addListener((response) => {
//         console.log("Received from Native Messaging Host: " + JSON.stringify(response));
//     });
//
//     port.onDisconnect.addListener(() => {
//         console.log("Disconnected from Native Messaging Host");
//     });
// }
//
// function launch() {
//     let port = chrome.runtime.connectNative('org.teslasoft.assistant');
//
//     port.postMessage({ text: 'launch'});
//
//     port.onMessage.addListener((response) => {
//         console.log("Received from Native Messaging Host: " + JSON.stringify(response));
//     });
//
//     port.onDisconnect.addListener(() => {
//         console.log("Disconnected from Native Messaging Host");
//     });
// }
//
//
// document.getElementById("quickPrompt").addEventListener("click", (e) => {
//     e.preventDefault();
//     quickPrompt();
// });
