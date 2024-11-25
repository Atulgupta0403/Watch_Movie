const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router()
const movieModels = require("../Models/movieModel")


router.get("/video/:movieName", async (req, res) => {
    const { movieName } = req.params
    const video = await movieModels.findOne({ movieName: movieName })
    if (!video) {
        return res.json({ "message": "Video not found " });
    }
    console.log(video)
    const videoPath = path.resolve(__dirname, video.link);
    console.log(videoPath);
    
    const baseDir = path.resolve(__dirname, 'Routes'); // Adjust base directory as needed
    const relativeVideoPath = path.relative(baseDir, videoPath);
    console.log(relativeVideoPath)
    
    res.send(video)

    const stat = fs.statSync(relativeVideoPath);
    console.log(stat)
    // const fileSize = stat.size;
    // console.log(fileSize)

    // const range = req.headers.range;

    // console.log(range)

    // if (range) {
    //     const parts = range.replace(/bytes=/, "").split("-");
    //     const start = parseInt(parts[0], 10);
    //     const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    //     if (start >= fileSize) {
    //         res.status(416).send("Requested range not satisfiable");
    //         return;
    //     }

    //     const chunkSize = end - start + 1;
    //     const file = fs.createReadStream(videoPath, { start, end });
    //     const headers = {
    //         "Content-Range": `bytes ${start}-${end}/${fileSize}`,
    //         "Accept-Ranges": "bytes",
    //         "Content-Length": chunkSize,
    //         "Content-Type": "video/mp4",
    //     };

    //     res.writeHead(206, headers);
    //     file.pipe(res);
    // } else {
    //     const headers = {
    //         "Content-Length": fileSize,
    //         "Content-Type": "video/mp4",
    //     };
    //     res.writeHead(200, headers);
    //     fs.createReadStream(videoPath).pipe(res);
    // }
});
module.exports = router