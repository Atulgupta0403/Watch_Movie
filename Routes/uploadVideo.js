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
        cb(null, "./public/videos"); // Save chunks to temp folder
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

// const fileFilter = (req, file, cb) => {
//     const allowedTypes = [
//         'video/mp4', 'video/mkv', 'video/avi',
//         'image/jpeg', 'image/png', 'image/gif', 'image/webp'
//     ];
//     if (allowedTypes.includes(file.mimetype)) {
//         cb(null, true);
//     } else {
//         cb(new Error('Invalid file type. Only videos and images are allowed!'), false);
//     }
// };

// const upload = multer({
//     storage: tempStorage,
//     limits: { fileSize: 500 * 1024 * 1024 }, // 50 MB file size limit
//     fileFilter: fileFilter
// })
// .fields([
//     { name: 'video', maxCount: 1 }, // Accept 1 video file
//     { name: 'thumbnail', maxCount: 1 } // Accept 1 image file
// ]);


// router.post('/upload-chunk', upload.single('video'), async (req, res) => {
//     try {
//         const totalChunks = 10;
//         const fileId = 1;
//         // const { 'x-file-id': fileId, 'x-total-chunks': totalChunks } = req.headers;

//         // Check if all chunks are uploaded
//         const chunkFiles = Array.from({ length: parseInt(totalChunks) }).map((_, idx) =>
//             path.join("./public/videos", `${fileId}_${idx}`)
//         );

//         const allChunksUploaded = chunkFiles.every((chunk) => fs.existsSync(chunk));

//         if (allChunksUploaded) {
//             // Combine all chunks into a single file
//             const finalFilePath = path.join("./public/videos", `${fileId}_final`);
//             const writeStream = fs.createWriteStream(finalFilePath);

//             for (const chunk of chunkFiles) {
//                 const data = fs.readFileSync(chunk);
//                 writeStream.write(data);
//                 fs.unlinkSync(chunk); // Delete chunk after appending
//             }

//             writeStream.end();

//             // Upload to S3
//             const fileStream = fs.createReadStream(finalFilePath);
//             const s3Response = await s3.send(new PutObjectCommand({
//                 Bucket: process.env.S3_BUCKET_NAME,
//                 Key: `${fileId}`,
//                 Body: fileStream,
//                 ContentType: 'video/mp4', // Adjust as needed
//             }));

//             fs.unlinkSync(finalFilePath); // Cleanup final file

//             res.status(200).send({
//                 message: 'File uploaded successfully',
//                 s3Response,
//             });
//         } else {
//             res.status(200).send({
//                 message: `Chunk uploaded successfully`,
//             });
//         }
//     } catch (error) {
//         res.status(500).send({
//             error: error.message,
//         });
//     }
// });


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
        const {movieName , cast} = req.body;
        if (!req.files || req.files?.video === undefined || req.files?.thumbnail === undefined) {
            res.json({ "message": "All fields are required" });
        }
        else {
            const movie = await movieModel.create({
                thumbnail: req.files.thumbnail[0].location,
                link: req.files.video[0].location,
                movieName,
                cast,
                type : req.files.video[0].mimetype
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

router.get("/videos", isLoggedIn, async (req, res) => {
    if (req.user) {
        const movies = await movieModel.find();
        res.json(movies)
    }

})



module.exports = router;