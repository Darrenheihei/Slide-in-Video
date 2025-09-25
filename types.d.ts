// define global types for both frontend and backend


// key: event name, value: payload type
type EventPayloadMapping = {
    statistics: Statistics;
    getStaticData: StaticData;
    progress: number;
    processSignal: string;
};

type UnsubscribeFunction = () => void;

// add new properties to the window object (old properties will not be affected)
interface Window {
    electron: {
        getPathForFile: (file: File) => Promise<string>;
        subscribeProgress: (callback: (progress: number) => void) => UnsubscribeFunction;
        sendProcessSignal: (filePath: string) => void;
    };

    path: {
        basename: (path: string) => string;
    };
}