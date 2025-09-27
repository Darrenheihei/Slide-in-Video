import path from 'path';
import { app } from 'electron';
import { isDev } from './util.js';

// TODO: escape spaces in path
export function getPreloadPath() {
    return path.join(
        app.getAppPath(),
        isDev() ? '.' : '..',
        'dist-electron/preload.cjs'
    )
}

// TODO: escape spaces in path
export function getUIPath() {
    return path.join(app.getAppPath(), '/dist-react/index.html')
}

// TODO: escape spaces in path
export function getPythonPath() {
    return path.join(
        app.getAppPath(),
        isDev() ? '.' : '..',
        'dist-python/main'
    )
}