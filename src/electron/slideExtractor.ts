import axios from "axios";

const BASE_URL = "http://localhost:5001";

export async function extractSlides(videoPath: string) {
    const res = await axios.post(`${BASE_URL}/extract_slides`, { video_path: videoPath });
    console.log(res.data)

    if (res.status !== 204) {
        throw new Error(`Failed to extract slides: ${res.statusText}`);
    }
}

export async function stopProcessing() {
    const res = await axios.post(`${BASE_URL}/stop_processing`);
    return res.data;
}

export async function getProgress() {
    const res = await axios.get(`${BASE_URL}/progress`);
    return res.data.progress;
}