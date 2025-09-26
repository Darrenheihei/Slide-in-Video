import { app, BrowserWindow } from 'electron';
import { isDev, ipcMainOn } from './util.js';
import { pollProgress } from "./resourceManager.js";
import { getPreloadPath, getUIPath } from "./pathResolver.js";
// import { extractSlidesFromVideo } from './slideExtractor.js';

app.on('ready', () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: getPreloadPath(),
            nodeIntegration: true,
            contextIsolation: true
        },
    });

    if (isDev()) {
        mainWindow.loadURL('http://localhost:5123');
    } else {
        mainWindow.loadFile(getUIPath());
    }

    // send progress
    pollProgress(mainWindow);

    // Handle the startProcess signal
    ipcMainOn("startProcess", (filePath) => {
        console.log("Received startProcess signal with filePath:", filePath);
        // extractSlidesFromVideo(filePath);
    });
});