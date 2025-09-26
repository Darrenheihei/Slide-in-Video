import { ipcMain } from 'electron';
import type { WebFrameMain } from 'electron';
import { getUIPath } from "./pathResolver.js";
import { pathToFileURL } from 'url';


export function isDev(): boolean {
    return process.env.NODE_ENV === 'development';
}

export function ipcMainHandle<Key extends keyof EventPayloadMapping>(
    key: Key,
    handler: () => EventPayloadMapping[Key]
) {
    ipcMain.handle(key, (event) => {
        validateEventFrame(event.senderFrame);
        return handler()
    })
}

export function ipcMainOn<Key extends keyof EventPayloadMapping>(
    key: Key,
    handler: (payload: EventPayloadMapping[Key]) => void
) {
    ipcMain.on(key, (event, payload) => {
        validateEventFrame(event.senderFrame);
        handler(payload);
    });
}

export function ipcWebContentsSend<Key extends keyof EventPayloadMapping>(
    key: Key,
    webContents: Electron.WebContents,
    payload: EventPayloadMapping[Key]
) {
    webContents.send(key, payload);
}

export function validateEventFrame(frame: WebFrameMain | null) {
    if (!frame) {
        throw new Error('Malicious event');
    }

    console.log(frame.url);

    // if in dev mode, allow localhost:5123 (Vite dev server)
    if (isDev() && new URL(frame.url).host === 'localhost:5123') {
        return;
    }

    // if in production mode, only allow loading from the app's UI path
    if (frame.url !== pathToFileURL(getUIPath()).toString()) {
        throw new Error('Malicious event');
    }
}