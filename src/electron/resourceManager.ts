import { BrowserWindow } from 'electron';
import { ipcWebContentsSend } from './util.js';
import { getProgress } from './slideExtractor.js';

const POLLING_INTERVAL = 500; // in milliseconds

let intervalId: NodeJS.Timeout | null = null;

// get dynamic data
export function startPollingProgress(mainWindow: BrowserWindow) {
    // Clear any existing interval first
    if (intervalId) {
        clearInterval(intervalId);
    }

    intervalId = setInterval(async () => {
        const progress = await getProgress();
        ipcWebContentsSend("progress", mainWindow.webContents, progress);
    }, POLLING_INTERVAL);
}

export function stopPollingProgress() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
}