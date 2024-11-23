const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router()


router.get("/video", (req, res) => {
    const videoPath = path.resolve(__dirname, "../public/videos/video-1732394148768-471753166.mp4");
    console.log(videoPath);
    const stat = fs.statSync(videoPath);
    console.log(stat)
    const fileSize = stat.size;
    console.log(fileSize)

    const range = req.headers.range;

    console.log(range)

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        if (start >= fileSize) {
            res.status(416).send("Requested range not satisfiable");
            return;
        }

        const chunkSize = end - start + 1;
        const file = fs.createReadStream(videoPath, { start, end });
        const headers = {
            "Content-Range": `bytes ${start}-${end}/${fileSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": chunkSize,
            "Content-Type": "video/mp4",
        };

        res.writeHead(206, headers);
        file.pipe(res);
    } else {
        const headers = {
            "Content-Length": fileSize,
            "Content-Type": "video/mp4",
        };
        res.writeHead(200, headers);
        fs.createReadStream(videoPath).pipe(res);
    }
    // res.send(videoPath)
});
module.exports = router