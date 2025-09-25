import { app, BrowserWindow } from 'electron';
import { isDev, ipcMainHandle } from './util.js';
import { pollResources, getStaticData } from "./resourceManager.js";
import { getPreloadPath, getUIPath } from "./pathResolver.js";

app.on('ready', () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: getPreloadPath(),
        },
    });

    if (isDev()) {
        mainWindow.loadURL('http://localhost:5123');
    } else {
        mainWindow.loadFile(getUIPath());
    }

    pollResources(mainWindow);

    ipcMainHandle("getStaticData", () => {
        return getStaticData();
    })
});