import { app, BrowserWindow } from 'electron';
import { isDev } from './util.js';
import { pollProgress } from "./resourceManager.js";
import { getPreloadPath, getUIPath } from "./pathResolver.js";

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

    pollProgress(mainWindow);
});