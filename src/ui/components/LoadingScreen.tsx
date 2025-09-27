import React, { useState, useEffect } from 'react';

const loadingMessages = [
    "Finding slaves for taking screenshots...",
    "Say thanks to your bro during the wait...",
    "Don't expect too much from this app...\nIt is made by a bro after all...",
    "At least it works 🙂 (should be)",
    "Your bro is working hard...\nAppreciate it...",
];

const LoadingScreen: React.FC = () => {
    const [currentMessage, setCurrentMessage] = useState(loadingMessages[0]);

    useEffect(() => {
        let curIndex = 0;
        const interval = setInterval(() => {
            setCurrentMessage(loadingMessages[curIndex % loadingMessages.length]);
            curIndex++;
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-full w-full">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Starting Application</h2>
            <p className="text-gray-500 text-center whitespace-pre-line">
                {currentMessage}
            </p>
        </div>
    );
};

export default LoadingScreen;