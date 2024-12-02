const movieModel = require("../Models/movieModel")
const fs = require("fs")


const video = async (req, res) => {
    // if (req.user) {
        const id = req.headers['id'];
        const movie = await movieModel.findOne({ _id: id })
        const range = req.headers.range
        if (!range){
            res.send({msg:"privide range"})
        }
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
            "Conten't-Length": contentLength,
            "Content-Type": "video/mp4"
        }

        res.writeHead(206, headers)
        const stream = fs.createReadStream(videoPath, {
            start,
            end
        })
        console.log(stream)
        stream.pipe(res)
    // }
}

module.exports = video