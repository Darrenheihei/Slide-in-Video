import { useState, useEffect } from 'react';

export function usePythonServerReady() {
    const [isPythonServerReady, setIsPythonServerReady] = useState<boolean>(false);

    useEffect(() => {
        const unsubscribe = window.electron.subscribePythonServerReady((isReady: boolean) => {
            setIsPythonServerReady(isReady);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return isPythonServerReady;
}