const movieModel = require("../Models/movieModel")
const fs = require("fs")
const https = require("https")


const video = async (req, res) => {
    // if (req.user) {
        // const id = req.headers['id'];
        // const movie = await movieModel.findOne({ _id: id })
        console.log("/video called")
        const range = req.headers.range
        console.log(range);
        const videos = "video.mp4"
        const videoPath = "./public/videos/video.mp4";
        const videoSize = fs.statSync(videoPath).size
        const chunkSize = 1 * 1e6;
        const start = Number(range.replace(/\D/g, ""))
        const end = Math.min(start + chunkSize, videoSize - 1)
        const contentLength = end - start + 1;
        const headers = {
            "Content-Range": `bytes ${start}-${end}/${videoSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": contentLength,
            "Content-Type": "video/mp4"
        }
        
        console.log("Accept-Ranges   " + headers["Accept-Ranges"])
        console.log("Content-Length   " + headers["Content-Length"])
        console.log("Content-Range   " + headers["Content-Range"])
        console.log("Content-Type   " + headers["Content-Type"])

        res.writeHead(206, headers)
        const stream = fs.createReadStream(videoPath, {
            start,
            end
        })
        console.log(stream)
        stream.pipe(res)
    // }
}


// const video = async (req, res) => {
//     // if (req.user) {
//         const range = req.headers.range;
//         if (!range) {
//             return res.status(416).send("Range header is required");
//         }

//         // S3 Video Details
//         const s3Url = "https://ottplatformapp.s3.ap-south-1.amazonaws.com/1732736186440"; // Replace with your S3 video URL

//         try {
//             // Parse the range header
//             const chunkSize = 1 * 1e6; // 1MB
//             const start = Number(range.replace(/\D/g, ""));
//             let end = start + chunkSize - 1;

//             // Fetch video size to calculate the correct `end` position
//             const headRequestOptions = {
//                 method: "HEAD"
//             };

//             https.get(s3Url, headRequestOptions, (headResponse) => {
//                 const videoSize = parseInt(headResponse.headers["content-length"], 10);
//                 end = Math.min(end, videoSize - 1);

//                 // Set response headers
//                 const contentLength = end - start + 1;
//                 const headers = {
//                     "Content-Range": `bytes ${start}-${end}/${videoSize}`,
//                     "Accept-Ranges": "bytes",
//                     "Content-Length": contentLength,
//                     "Content-Type": headResponse.headers["content-type"] || "video/mp4"
//                 };
//                 res.writeHead(206, headers);

//                 // Fetch the video chunk from S3
//                 const getRequestOptions = {
//                     headers: { Range: `bytes=${start}-${end}` }
//                 };

//                 https.get(s3Url, getRequestOptions, (getResponse) => {
//                     getResponse.pipe(res);
//                     // console.log(getResponse)
//                 }).on("error", (err) => {
//                     console.error("Error fetching video chunk:", err);
//                     res.status(500).send("Error streaming video");
//                 });
//             }).on("error", (err) => {
//                 console.error("Error fetching video metadata:", err);
//                 res.status(500).send("Error fetching video metadata");
//             });
//         }
//          catch (error) {
//             console.error("Error streaming video:", error);
//             res.status(500).send("Error streaming video");
//         }
//     // } 
// };

module.exports = video