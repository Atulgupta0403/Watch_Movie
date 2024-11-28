const express = require("express");
const multer = require("multer")
const router = express.Router();
const path = require("path")
const movieModel = require("../Models/movieModel")
const { isLoggedIn, isAdmin } = require("../Middlewares/isLoggedIn")
const userModels = require("../Models/userModels")
const { S3Client , PutObjectCommand } = require('@aws-sdk/client-s3')
const multerS3 = require('multer-s3')
const fs = require("fs")

router.use(express.static(path.join(__dirname , "public")))

const s3 = new S3Client({
    credentials: {
        secretAccessKey: process.env.S3_SECRET_KEY,
        accessKeyId: process.env.S3_ACCESS_KEY,
    },
    region: "ap-south-1"

})

const storage = multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
        cb(null, Date.now().toString())
    }
})

const tempStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/videos"); 
    },
    filename: (req, file, cb) => {
        const chunkIndex = 1;
        const fileId = 1;
        // const { 'x-file-id': fileId, 'x-chunk-index': chunkIndex } = req.headers;
        if (!fileId || chunkIndex === undefined) {
            return cb(new Error('Missing chunk metadata'));
        }
        cb(null, `${fileId}_${chunkIndex}`); // Name chunks with fileId and chunkIndex
    },
});


const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'video/mp4', 'video/mkv', 'video/avi',
        'image/jpeg', 'image/png', 'image/gif', 'image/webp'
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only videos and images are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 500 * 1024 * 1024 }, // 50 MB file size limit
    fileFilter: fileFilter
}).fields([
    { name: 'video', maxCount: 1 }, // Accept 1 video file
    { name: 'thumbnail', maxCount: 1 } // Accept 1 image file
]);


router.post("/upload", isAdmin, upload, async (req, res) => {
    try {
        // console.log(req.files)
        const { title , overview , genres , keywords , cast , crew} = req.body;
        if (!req.files || req.files?.video === undefined || req.files?.thumbnail === undefined) {
            res.json({ "message": "All fields are required" });
        }
        else {
            const movie = await movieModel.create({
                poster_url: req.files.thumbnail[0].location,
                trailer_url : req.files.video[0].location,
                title,
                overview,
                genres,
                keywords,
                cast,
                crew,
            })
            // console.log(movie)
            res.json({
                "message": "Video Sent successfully",
                file: req.files
            })
        }
    } catch (error) {
        // console.log("error " + error)
        res.status(400).send({
            error: error.message
        });
    }
})

router.get("/description", isLoggedIn, async (req, res) => {
    if (req.user) {
        const movies = await movieModel.find().select("-trailer_url");
        res.json(movies)
    }
})



module.exports = router;