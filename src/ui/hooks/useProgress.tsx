import { useState, useEffect } from "react";

export function useProgress(): number {
    const [value, setValue] = useState<number>(0);
    useEffect(() => {
        const unsub = window.electron.subscribeProgress((progress) => {
            setValue(progress);
        });
        return unsub;
    }, []);

    return value;
}