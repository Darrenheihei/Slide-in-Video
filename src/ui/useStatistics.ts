import { useState, useEffect } from "react";

export function useStatistics(dataPointCount: number): Statistics[] {
    const [value, setValue] = useState<Statistics[]>([]);
    useEffect(() => {
        const unsub = window.electron.subscribeStatistics((stats) => {
            setValue(prev => {
                const newData = [...prev, stats];

                if (newData.length > dataPointCount) {
                    newData.shift(); // remove the first element in the array
                }

                return newData;
            });
        });
        return unsub;
    });

    return value;
}