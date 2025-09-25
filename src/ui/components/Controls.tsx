interface ControlsProps {
    videoPath: string;
    setVideoPath: (url: string) => void;
    isProcessing: boolean;
    setIsProcessing: (isProcessing: boolean) => void;
}

const Controls: React.FC<ControlsProps> = ({ videoPath, setVideoPath, isProcessing, setIsProcessing }) => {
    return (
        <div className="flex flex-row items-center justify-center w-full h-full gap-4 mt-4">
            {!isProcessing && (
                <button
                    className={`px-4 py-2 text-white rounded bg-teal-500 hover:bg-teal-600 cursor-pointer`}
                    onClick={() => {
                        setIsProcessing(true)
                        window.electron.sendProcessSignal(videoPath);
                    }}
                    disabled={isProcessing}>
                    Extract Slides
                </button>
            )}
            <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
                onClick={() => {
                    setVideoPath("")
                    setIsProcessing(false)
                }}>
                Cancel
            </button>
        </div>
    )
}

export default Controls
