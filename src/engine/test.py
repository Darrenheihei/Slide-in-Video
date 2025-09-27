import cv2
import numpy as np
import os
import shutil
from tqdm import tqdm

totalDuration = 0
currentDuration = 0
processing_status = "idle"  # Can be "idle", "running", "stopped", "completed", "error"

def process_video_async(video_path, fps, totalDuration):
    """Background processing function that runs in a separate thread"""
    global currentDuration, processing_status
    currentDuration = 0  # Reset progress
    processing_status = "running"
    

    cap = cv2.VideoCapture(video_path)

    with open('../../temp/log.txt', 'w') as f:
        prevFrame = None
        for second in tqdm(range(int(totalDuration))):
            for frameCount in range(0, int(fps), 5):
                cap.set(cv2.CAP_PROP_POS_FRAMES, second * fps + frameCount)
                ret, frame = cap.read()
                # save each frame as an image
                if ret:
                    height = frame.shape[0]
                bottom_crop = np.array(frame[int(height * 0.87):int(height * 0.95), :])
                ###### Test ######
                # cv2.imwrite(f"../../temp/screenshots/slide_{second}.png", bottom_crop)
                ###### Test ######
                
                count = np.sum(np.all(np.abs(bottom_crop - np.array([98, 202, 239])) < 20, axis=2))
                loadingCount = np.sum(np.all(np.abs(bottom_crop - np.array([53, 116, 137])) < 20, axis=2))
                # print(count)
                # f.write(f"{second} | {frameCount} | {count}\n")

                ###### Actual ######
                if count < 5000 and loadingCount < 5000 and prevFrame is not None:
                    # get the frame from previous second
                    cv2.imwrite(f"../../temp/screenshots/slide_{second - 1}.png", prevFrame)
                    prevFrame = None
                    # print(second, count)
                    break
                ###### Actual ######

            else:
                prevFrame = frame

            currentDuration += 1
        else:
            currentDuration = totalDuration  # Ensure progress is complete
            processing_status = "completed"

def extract_slides(video_path):
    global totalDuration, currentDuration, processing_thread, processing_status

    # Check if processing is already running
    if processing_status == "running":
        return {"status": "error", "message": "Video processing is already in progress."}, 409
        
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS) 
    totalFrameCount = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    totalDuration = totalFrameCount / fps if fps > 0 else 0
    cap.release()  # Release the video capture object
    
    if totalDuration == 0:
        return {"status": "error", "message": "Could not determine video duration."}, 400
    
    process_video_async(video_path, fps, totalDuration)
    
def setup():
    shutil.rmtree("../../temp/screenshots")
    os.mkdir("../../temp/screenshots")

if __name__ == "__main__":
    setup()

    video_path = "/Users/darrenfung/Downloads/videos/new/2025-06-26 21-00-29 (s24 mfm5).mov"
    extract_slides(video_path)