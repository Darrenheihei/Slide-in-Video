import React, { useState } from 'react';
import {
    FilePlay,
    LoaderCircle
} from 'lucide-react';

interface FileUploaderProps {
    videoPath: string;
    setVideoPath: (url: string) => void;
};

const FileUploader: React.FC<FileUploaderProps> = ({ videoPath, setVideoPath }) => {
    const [loading, setLoading] = useState(false);
    const [videoUrl, setvideoUrl] = useState<string>("");

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setLoading(true);
            try {
                const file = e.target.files[0];
                // get the path of the file in local computer
                const filePath = await window.electron.getPathForFile(file);
                setVideoPath(filePath);
                setvideoUrl(URL.createObjectURL(file));
            } catch (error) {
                console.error('Error uploading file:', error);
                // Optionally handle error UI
                alert('Failed to upload video.');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            {
                (videoPath && videoUrl)
                    ? (
                        <div className="flex flex-col items-center justify-center">
                            <p
                                className="line-clamp-1"
                                title={window.path.basename(videoPath)}
                            >
                                Uploaded Video: {window.path.basename(videoPath)}
                            </p>
                            <video src={videoUrl} controls className="mt-4 max-h-[50%] max-w-[80%] border border-gray-300 rounded relative" />
                        </div>
                    ) : (
                        <div className="flex flex-col h-[50%] w-[80%] items-center justify-center border-2 border-dashed border-gray-400 rounded-lg p-8 mx-20 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                            <input
                                type="file"
                                accept=".mov"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                onChange={handleFileUpload}
                                disabled={loading}
                            />
                            {
                                loading ? (
                                    <div className="flex flex-row items-center justify-center z-0 pointer-events-none animate-pulse" >
                                        <LoaderCircle color={"#4299e1"} className="mx-4 animate-spin" />
                                        <span className="text-blue-500 text-lg font-medium">Uploading...</span>
                                    </div >
                                ) : (
                                    <div className="flex flex-col items-center justify-center z-0 pointer-events-none">
                                        <FilePlay className="h-12 w-12 text-gray-400 mb-4" />
                                        <span className="text-gray-500 text-lg font-medium">Upload your video here</span>
                                        <span className="text-gray-400 text-sm mt-2">Supported format: .mov</span>
                                    </div>
                                )}
                        </div >
                    )}
        </div>
    );
}

export default FileUploader
