import osUtils from 'os-utils';
import fs from 'fs';
import os from 'os';
import { BrowserWindow } from 'electron';
import { ipcWebContentsSend } from './util.js';

const POLLING_INTERVAL = 100; // in milliseconds

// get dynamic data
export function pollResources(mainWindow: BrowserWindow) {
    setInterval(async () => {
        const cpuUsage = await getCpuUsage();
        const ramUsage = getRamUsage();
        const storageData = getStorageData();
        ipcWebContentsSend("statistics", mainWindow.webContents, {
            cpuUsage,
            ramUsage,
            storageUsage: storageData.usage
        });
    }, POLLING_INTERVAL);
}

// get static data
export function getStaticData() {
    const totalStorage = getStorageData().total; // in GB
    const cpuModel = os.cpus()[0].model;
    const totalMemoryGB = Math.floor(osUtils.totalmem() / 1024); // in GB

    return {
        totalStorage,
        cpuModel,
        totalMemoryGB
    };
}

function getCpuUsage(): Promise<number> {
    return new Promise(resolve => {
        osUtils.cpuUsage(resolve);
    })
}

function getRamUsage() {
    return 1 - osUtils.freememPercentage();
}

function getStorageData() {
    // requires node 18
    const stats = fs.statfsSync(process.platform === 'win32' ? 'C://' : '/');
    const total = stats.bsize * stats.blocks; // total bytes in the disk
    const free = stats.bsize * stats.bfree; // free bytes in the disk

    return {
        total: Math.floor(total / 1_000_000_000), // in GB
        usage: 1 - free / total, // percentage of used space
    };
}