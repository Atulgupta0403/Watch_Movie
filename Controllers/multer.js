const express = require("express");
const multer = require("multer")
const router = express.Router();
const path = require("path")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/videos'); // Directory where videos will be saved
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['video/mp4', 'video/mkv', 'video/avi'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only videos are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB file size limit
    fileFilter: fileFilter
});

router.post('/upload', upload.single('video'), (req, res) => {
    try {
        console.log(req.file)
        res.status(200).send({
            message: 'Video uploaded successfully!',
            file: req.file
        });
    } catch (error) {
        console.log("error " + error)
        res.status(400).send({
            error: error.message
        });
    }
});


module.exports = router;