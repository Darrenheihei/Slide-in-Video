import { BrowserWindow } from 'electron';
import { ipcWebContentsSend } from './util.js';

const POLLING_INTERVAL = 500; // in milliseconds

// get dynamic data
export function pollProgress(mainWindow: BrowserWindow) {
    setInterval(async () => {
        const progress = getProgress();
        ipcWebContentsSend("progress", mainWindow.webContents, progress);
    }, POLLING_INTERVAL);
}

// TODO: replace with real logic
function getProgress(): number {
    // simulate progress for demo purposes
    return Math.floor(Math.random() * 101);
}