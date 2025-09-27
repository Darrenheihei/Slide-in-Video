// define global types for both frontend and backend

/// <reference types="vite/client" />

// key: event name, value: payload type
type EventPayloadMapping = {
    statistics: Statistics;
    getStaticData: StaticData;
    progress: number;
    startProcess: string;
    stopProcess: void;
    pythonServerReady: boolean;

    consoleLog: string;
};

type UnsubscribeFunction = () => void;

// add new properties to the window object (old properties will not be affected)
interface Window {
    electron: {
        getPathForFile: (file: File) => Promise<string>;
        subscribeProgress: (callback: (progress: number) => void) => UnsubscribeFunction;
        subscribePythonServerReady: (callback: (isReady: boolean) => void) => UnsubscribeFunction;
        startProcess: (filePath: string) => void;
        stopProcess: () => void;

        subscribeConsoleLog: (callback: (message: string) => void) => UnsubscribeFunction;
    };

    path: {
        basename: (path: string) => string;
    };
}