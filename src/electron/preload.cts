const electron = require('electron');
const path = require('path');

electron.contextBridge.exposeInMainWorld('electron', {
    getPathForFile: (file) => electron.webUtils.getPathForFile(file),
    startProcess: (filePath) => {
        ipcSend("startProcess", filePath);
    },
    stopProcess: () => {
        ipcSend("stopProcess");
    },
    subscribeProgress: (callback) =>
        ipcOn("progress", (progress) => {
            callback(progress);
        }),
    subscribePythonServerReady: (callback) =>
        ipcOn("pythonServerReady", (isReady) => {
            callback(isReady);
        }),
    subscribeConsoleLog: (callback) =>
        ipcOn("consoleLog", (message) => {
            callback(message);
        }),
} satisfies Window['electron']);

electron.contextBridge.exposeInMainWorld('path', {
    basename: (filePath: string) => path.basename(filePath),
} satisfies Window['path']);

// function ipcInvoke<Key extends keyof EventPayloadMapping>(
//     key: Key
// ): Promise<EventPayloadMapping[Key]> {
//     return electron.ipcRenderer.invoke(key);
// }



function ipcOn<Key extends keyof EventPayloadMapping>(
    key: Key,
    callback: (payload: EventPayloadMapping[Key]) => void
) {
    const cb = (_: any, payload: any) => callback(payload); // callback function
    electron.ipcRenderer.on(key, cb);
    return () => electron.ipcRenderer.off(key, cb);
}

function ipcSend<Key extends keyof EventPayloadMapping>(
    key: Key,
    payload?: EventPayloadMapping[Key]
) {
    electron.ipcRenderer.send(key, payload);
}