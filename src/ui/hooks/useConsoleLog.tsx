import { useEffect } from 'react';
// for debugging
export function useConsoleLog() {

    useEffect(() => {
        const unsubscribe = window.electron.subscribeConsoleLog((message: string) => {
            console.log(message);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return useConsoleLog;
}