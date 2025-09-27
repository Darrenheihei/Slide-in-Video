import { app, BrowserWindow } from 'electron';
import { isDev, ipcMainOn, ipcWebContentsSend } from './util.js';
import { startPollingProgress, stopPollingProgress } from "./resourceManager.js";
import { getPreloadPath, getUIPath } from "./pathResolver.js";
import { extractSlides, stopProcessing } from './slideExtractor.js';
import { runPython, killPython } from "./pythonExecutor.js";

// const isMac = process.platform === 'darwin'; // check if the platform is macOS

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

    // Notify renderer that Python server is not ready initially
    ipcWebContentsSend('pythonServerReady', mainWindow.webContents, false);

    // Wait for the renderer to be ready before starting Python server
    mainWindow.webContents.once('did-finish-load', () => {
        // Add a small delay to ensure React app is fully initialized
        setTimeout(() => {
            // Start Python server and notify when ready
            runPython(mainWindow)
                .then(() => {
                    console.log("Python server is ready!");
                    ipcWebContentsSend('pythonServerReady', mainWindow.webContents, true);
                })
                .catch((error) => {
                    console.error("Failed to start Python process:", error);
                });
        }, 100); // Small delay to ensure React app is fully ready
    });

    // Handle the startProcess signal
    ipcMainOn("startProcess", async (filePath) => {
        try {
            // Start polling progress when process starts
            startPollingProgress(mainWindow);
            await extractSlides(filePath);
        } catch (error) {
            console.error("Error during slide extraction:", error);
        }
    });

    ipcMainOn("stopProcess", async () => {
        // Stop polling progress when process stops
        stopPollingProgress();
        await stopProcessing();
    });
});

app.on('window-all-closed', () => {
    killPython();

    // if (!isMac) {
    app.quit();
    // }
});