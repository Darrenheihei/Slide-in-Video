from flask import Flask, request
from flask_cors import CORS
import cv2
import threading
from waitress import serve
import numpy as np

app = Flask(__name__)
CORS(app)

totalDuration = 0
currentDuration = 0
processing_status = "idle"  # Can be "idle", "running", "stopped", "completed", "error"
stop_event = threading.Event()
processing_thread = None

def process_video_async(video_path, fps, totalDuration):
    """Background processing function that runs in a separate thread"""
    global currentDuration, processing_status
    currentDuration = 0  # Reset progress
    processing_status = "running"
    

    cap = cv2.VideoCapture(video_path)

    try:
        for second in range(10, int(totalDuration)):
            # Check if stop was requested
            if stop_event.is_set():
                processing_status = "stopped"
                cap.release()
                return
                
            cap.set(cv2.CAP_PROP_POS_FRAMES, second * fps)
            ret, frame = cap.read()
            # save each frame as an image
            if ret:
                height = frame.shape[0]
                bottom_crop = np.array(frame[int(height * 0.9):, :])
                # yellow_channel = ((bottom_crop[:, :, 0] + (255 - 98)) % 256
                #                   + (bottom_crop[:, :, 1] + (255 - 202)) % 256
                #                   + (bottom_crop[:, :, 2] + (255 - 239)) % 256
                #                   ) // 3 # the target color is (239, 202, 98)
                
                # only look at the hue channel (true color)
                hue_channel = (bottom_crop[:, :, 0] + bottom_crop[:, :, 1] + bottom_crop[:, :, 2]) % 256
                cv2.imwrite(f"./temp/screenshots/slide_{second+1:04d}.png", hue_channel)

            currentDuration += 1
        else:
            currentDuration = totalDuration  # Ensure progress is complete
            processing_status = "completed"
    except Exception as e:
        processing_status = "error"
        stop_event.set()  # Set stop event to ensure thread can be properly cleaned up
        print(f"Error during video processing: {e}")
    finally:
        cap.release()

@app.route("/healthz", methods=["GET"])
def health_check():
    return {"status": "healthy"}, 200

@app.route("/extract_slides", methods=["POST"])
def extract_slides():
    global totalDuration, currentDuration, processing_thread, stop_event, processing_status
    
    # Check if processing is already running
    if processing_status == "running":
        return {"status": "error", "message": "Video processing is already in progress."}, 409
    
    data = request.json
    video_path = data.get("video_path")
    
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS) 
    totalFrameCount = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    totalDuration = totalFrameCount / fps if fps > 0 else 0
    cap.release()  # Release the video capture object
    
    if totalDuration == 0:
        return {"status": "error", "message": "Could not determine video duration."}, 400
    
    # Reset the stop event for new processing
    stop_event.clear()
    
    # Start background processing in a separate thread
    processing_thread = threading.Thread(
        target=process_video_async, 
        args=(video_path, fps, totalDuration)
    )
    processing_thread.daemon = True  # Thread will die when main program exits
    processing_thread.start()
    
    # Return immediately with the duration
    return "", 204

@app.route("/progress", methods=["GET"])
def progress():
    progress = int((currentDuration / totalDuration) * 100) if totalDuration > 0 else 0
    return {"progress": progress, "status": processing_status}

@app.route("/stop_processing", methods=["POST"])
def stop_processing():
    global stop_event, processing_status, currentDuration
    
    if processing_status not in ["running", "error"]:
        return {"status": "error", "message": "No video processing is currently running."}, 400
    
    # Signal the processing thread to stop
    stop_event.set()
    processing_status = "stopped"
    currentDuration = 0  # Reset progress
    
    return {"status": "success", "message": "Stop signal sent to video processing."}, 200


if __name__ == "__main__":
    print("Starting Flask server...")
    serve(app, host="0.0.0.0", port=5001)
    print("Flask server has stopped.")