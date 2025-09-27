import cv2
import numpy as np
import os
import shutil

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
        for second in range(10, int(totalDuration)):
            for frameCount in range(0, int(fps), 5):
                cap.set(cv2.CAP_PROP_POS_FRAMES, second * fps + frameCount)
                ret, frame = cap.read()
                # save each frame as an image
                if ret:
                    height = frame.shape[0]
                bottom_crop = np.array(frame[int(height * 0.9):, :], dtype=np.uint16)
                # target_color_channel = ((bottom_crop[:, :, 0] + (255 - 98)) % 256
                #                 + (bottom_crop[:, :, 1] + (255 - 202)) % 256
                #                 + (bottom_crop[:, :, 2] + (255 - 239)) % 256
                #                 ) % 256 // 3 # the target color is (239, 202, 98)
                # target_color_channel = target_color_channel.astype(np.uint8)
                # print(np.max(target_color_channel), np.min(target_color_channel), np.mean(target_color_channel))

                # count the number of pixels with color (239, 202, 98) in bottom_crop directly using bottom_crop
                # print(np.sum(bottom_crop.astype(np.uint8) - np.array([98, 202, 239]), axis=2).shape)
                # print(np.sum(bottom_crop.astype(np.uint8) - np.array([98, 202, 239]), axis=2))
                count = np.sum(np.all(np.abs(bottom_crop.astype(np.uint8) - np.array([98, 202, 239])) < 20, axis=2))
                # print(count)
                # f.write(f"{second} | {frameCount} | {count}\n")

                if count < 5000 and prevFrame is not None:
                    # get the frame from previous second
                    cv2.imwrite(f"../../temp/screenshots/slide_{second - 1}.png", prevFrame)
                    prevFrame = None
                    print(second, count)
                    break

                # only look at the hue channel (true color)
                # hue_channel = (bottom_crop[:, :, 0] + bottom_crop[:, :, 1] + bottom_crop[:, :, 2]) % 256
                # cv2.imwrite(f"../../temp/screenshots/slide_{second+1:04d}.png", hue_channel)
                # if second in [92, 93, 94, 95, 96, 97]:
                    # cv2.imwrite(f"../../temp/screenshots/slide_{second}_{frameCount}.png", bottom_crop.astype(np.uint8))
                # mask = np.all(np.abs(bottom_crop.astype(np.uint8) - np.array([98, 202, 239])) < 20, axis=2)
                # cv2.imwrite(f"../../temp/screenshots/slide_{second}_{frameCount}.png", bottom_crop.astype(np.uint8))
                # cv2.imwrite(f"../../temp/screenshots/slide_{second}_{frameCount}_mask.png", (mask * 255))

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

    video_path = "/Users/darrenfung/Downloads/2025-06-23 20-41-44(s16 ANC 1).mov"
    extract_slides(video_path)