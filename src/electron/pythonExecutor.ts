import { execFile } from "child_process";
import type { ChildProcess } from "child_process";
import kill from "tree-kill";
import http from "http";
import { getPythonPath } from "./pathResolver.js";
import { ipcWebContentsSend } from "./util.js";


let python: ChildProcess;

async function checkPythonServerHealth(): Promise<boolean> {
    return new Promise((resolve) => {
        const req = http.get('http://localhost:5001/healthz', (res) => {
            resolve(res.statusCode === 200);
            res.destroy();
        });

        req.on('error', () => {
            resolve(false);
        });

        req.setTimeout(1000, () => {
            req.destroy();
            resolve(false);
        });
    });
}

async function waitForPythonServer(): Promise<void> {
    const pollInterval = 500;

    while (true) {
        if (await checkPythonServerHealth()) {
            console.log("Python server is ready!");
            return;
        }

        await new Promise(resolve => setTimeout(resolve, pollInterval));
    }
}

export function runPython(window: Electron.BrowserWindow): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const pythonExecutablePath = getPythonPath();

        ipcWebContentsSend("consoleLog", window.webContents, `Starting Python server using executable at: ${pythonExecutablePath}`);

        python = execFile(
            pythonExecutablePath,
            [],
            {
                windowsHide: true,
                shell: true,
            },
            (error) => {
                if (error) {
                    console.error("Failed to start Python server:", error);
                    ipcWebContentsSend("consoleLog", window.webContents, `Failed to start Python server: ${error.message}`);
                    reject(error);
                }
            }
        );

        // Wait for the Python server to actually be ready
        waitForPythonServer()
            .then(() => resolve())
            .catch((error) => reject(error));
    });
}

export function killPython() {
    if (python && python.pid !== undefined) {
        kill(python.pid);
    }
}