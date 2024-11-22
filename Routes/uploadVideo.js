const express = require("express");
const multer = require("multer")
const router = express.Router();
const path = require("path")
const movieModel = require("../Models/movieModel")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const videoTypes = ['video/mp4', 'video/mkv', 'video/avi'];
        const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

        if (videoTypes.includes(file.mimetype)) {
            cb(null, 'public/videos'); // Save videos in 'public/videos'
        } else if (imageTypes.includes(file.mimetype)) {
            cb(null, 'public/thumbnail'); // Save images in 'public/thumbnail'
        } else {
            cb(new Error('Invalid file type. Only videos and images are allowed!'), null);
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'video/mp4', 'video/mkv', 'video/avi', // Video types
        'image/jpeg', 'image/png', 'image/gif', 'image/webp' // Image types
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only videos and images are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB file size limit
    fileFilter: fileFilter
}).fields([
    { name: 'video', maxCount: 1 }, // Accept 1 video file
    { name: 'thumbnail', maxCount: 1 } // Accept 1 image file
]);

router.post('/upload', upload , async (req, res) => {
    // link = req.files.video[0].path
    // type, duration = req.body
    // thumbnail = req.files.thumbnail[0].path
    
    const {type , duration , movieName} = req.body;
    try {
        if(!type || !duration || !movieName){
            res.json({"message" : "All fields are required"})
        }
        else{
            const movie = await movieModel.create({
                movieName,
                type,
                duration,
                link : req.files.video[0].path,
                thumbnail : req.files.thumbnail[0].path,
            })
            console.log(req.files.video[0])
            res.status(200).send({
                message: 'Video uploaded successfully!',
                file: req.files
            });
        }
    } catch (error) {
        console.log("error " + error)
        res.status(400).send({
            error: error.message
        });
    }
});


module.exports = router;