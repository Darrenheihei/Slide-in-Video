import { useState } from 'react'
import './App.css';
import FileUploader from "./components/FileUploader";
import Controls from "./components/Controls";
import ProgressBar from './components/ProgressBar';
import LoadingScreen from './components/LoadingScreen';
import { useProgress } from "./hooks/useProgress";
import { usePythonServerReady } from "./hooks/usePythonServerReady";
import { useConsoleLog } from "./hooks/useConsoleLog";

function App() {
  const [videoPath, setVideoPath] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const progress = useProgress();
  const isPythonServerReady = usePythonServerReady();

  useConsoleLog();

  // Show loading screen while Python server is starting up
  if (!isPythonServerReady) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex flex-col items-center justify-center w-[80%] h-full">
      <FileUploader videoPath={videoPath} setVideoPath={setVideoPath} />

      {isProcessing && <ProgressBar progress={progress} />}

      {videoPath &&
        <Controls
          videoPath={videoPath}
          setVideoPath={setVideoPath}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
        />}
    </div>
  )
}

export default App
