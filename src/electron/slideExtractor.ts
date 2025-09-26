// import { FFmpeg } from "@ffmpeg/ffmpeg";
// import { fetchFile } from "@ffmpeg/util";


// let ffmpeg: FFmpeg | null = null;
// export async function extractSlidesFromVideo(videoPath: string) {
//     // Placeholder implementation
//     console.log(`Extracting slides from video at path: ${videoPath}`);

//     // read the duration of the video using ffmpeg
//     if (!ffmpeg) {
//         ffmpeg = new FFmpeg();
//         await ffmpeg.load();
//     }

//     await ffmpeg.writeFile('input.mov', await fetchFile(videoPath));
//     const res = await ffmpeg.exec(['-i', 'input.mov']);
//     console.log(res);

//     // terminate the ffmpeg instance to free up resources
//     ffmpeg.terminate();
//     ffmpeg = null;
// }