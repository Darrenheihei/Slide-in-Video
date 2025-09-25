// define global types for both frontend and backend

type Statistics = {
    cpuUsage: number; // in percentage
    ramUsage: number; // in percentage
    storageUsage: number; // in percentage
};

type StaticData = {
    totalStorage: number; // in GB
    cpuModel: string;
    totalMemoryGB: number; // in GB
};

// key: event name, value: payload type
type EventPayloadMapping = {
    statistics: Statistics;
    getStaticData: StaticData;
};

type UnsubscribeFunction = () => void;

// add new properties to the window object (old properties will not be affected)
interface Window {
    electron: {
        subscribeStatistics: (callback: (statistics: Statistics) => void) => UnsubscribeFunction;
        getStaticData: () => Promise<StaticData>;
    };
}