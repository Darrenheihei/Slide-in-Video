interface ProgressBarProps {
    progress?: number; // value between 0 and 100
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {

    return (
        <div className="h-full w-full flex flex-row items-center justify-center mt-4 gap-2">
            <div className="h-[15px] w-full border rounded-lg bg-gray-100 border-transparent">
                <div className="h-full bg-blue-400 animate-pulse rounded-lg" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-center">{progress}%</p>
        </div>
    )
}

export default ProgressBar
