const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Ensure upload directories exist
const CHUNKS_DIR = path.join(__dirname, '../uploads/chunks');
const VIDEOS_DIR = path.join(__dirname, '../uploads/videos');
fs.mkdirSync(CHUNKS_DIR, { recursive: true });
fs.mkdirSync(VIDEOS_DIR, { recursive: true });

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, CHUNKS_DIR);
    },
    filename: (req, file, cb) => {
        const { sessionId, currentChunk } = req.body;
        cb(null, `${sessionId}_chunk_${currentChunk}${path.extname(file.originalname)}`);
        // console.log("sessionId " + sessionId)
        // console.log(req.body)
        // console.log("currentChunk " + currentChunk)
    }
});

const upload = multer({ storage: storage });

// Track ongoing uploads
const uploadSessions = new Map();

// Render upload page
router.get('/upload-chunk', (req, res) => {
    res.render('index');
});

// Handle chunk upload
router.post('/upload-chunk', express.urlencoded({ extended: true }) , upload.single('chunk'), (req, res) => {
    const {
        filename,
        totalChunks,
        currentChunk,
        sessionId,
    } = req.body;

        
    // Validate request
    if (!filename || !totalChunks || !currentChunk || !sessionId) {
        return res.status(400).json({
            error: 'Missing upload parameters'
        });
    }

    // Create upload session if not exists
    if (!uploadSessions.has(sessionId)) {
        uploadSessions.set(sessionId, {
            filename,
            totalChunks: parseInt(totalChunks),
            receivedChunks: new Set(),
            finalPath: path.join(VIDEOS_DIR, filename)
        });
    }

    const session = uploadSessions.get(sessionId);


    // Mark chunk as received
    session.receivedChunks.add(parseInt(currentChunk));

    // Check if all chunks received
    if (session.receivedChunks.size === session.totalChunks) {
        console.log("sessionId   " + sessionId)
        mergeChunks(sessionId);
        uploadSessions.delete(sessionId);

        return res.json({
            status: 'complete',
            path: session.finalPath
        });
    }

    res.json({
        status: 'chunk_received',
        chunk: currentChunk
    });
});

// Merge chunks using FFmpeg
function mergeChunks(sessionId) {
    const session = uploadSessions.get(sessionId);
    const chunks = [];

    // Sort and collect chunk paths
    for (let i = 1; i <= session.totalChunks; i++) {
        chunks.push(path.join(
            CHUNKS_DIR,
            `${sessionId}_chunk_${i}${path.extname(session.filename)}`
        ));
    }

    // Create a temporary file list for FFmpeg
    const fileListPath = path.join(CHUNKS_DIR, `${sessionId}_filelist.txt`);
    fs.writeFileSync(
        fileListPath,
        chunks.map(chunk => `file '${chunk}'`).join('\n')
    );

    // Use FFmpeg to merge chunks
    const ffmpegMerge = spawn('ffmpeg', [
        '-f', 'concat',
        '-safe', '0',
        '-i', fileListPath,
        '-c', 'copy',
        session.finalPath
        // console.log(session.finalPath)
    ]);

    ffmpegMerge.stderr.on('data', (data) => {
        console.error(`FFmpeg error: ${data.toString()}`);
    });

    ffmpegMerge.on('close', (code) => {
        if (code === 0) {
            // Clean up chunks and file list
            chunks.forEach(chunkPath => {
                fs.unlinkSync(chunkPath);
            });
            fs.unlinkSync(fileListPath);
            console.log('Video merged successfully');
        } else {
            console.error('FFmpeg merge failed ' + code);
        }
    });
}


// router.post('/upload-chunk', upload.single('chunk'), (req, res) => {
//     const { filename, totalChunks, currentChunk, sessionId } = req.body;

//     if (!filename || !totalChunks || !currentChunk || !sessionId) {
//         return res.status(400).json({ error: 'Missing upload parameters' });
//     }

//     if (!uploadSessions.has(sessionId)) {
//         uploadSessions.set(sessionId, {
//             filename,
//             totalChunks: parseInt(totalChunks),
//             receivedChunks: new Set(),
//             finalPath: path.join(VIDEOS_DIR, filename)
//         });
//     }

//     const session = uploadSessions.get(sessionId);
//     session.receivedChunks.add(parseInt(currentChunk));

//     const uploadedChunkPath = path.join(CHUNKS_DIR, `${sessionId}_chunk_${currentChunk}${path.extname(filename)}`);
//     console.log(`Uploaded chunk path: ${uploadedChunkPath}`);

//     if (session.receivedChunks.size === session.totalChunks) {
//         mergeChunks(session);
//         uploadSessions.delete(sessionId);
//         return res.json({ status: 'complete', path: session.finalPath });
//     }

//     res.json({ status: 'chunk_received', chunk: currentChunk });
// });







// function mergeChunks(session) {
//     const sessionId = session.filename.split('.')[0]; // Extract sessionId from filename
//     const chunks = [];
//     for (let i = 1; i <= session.totalChunks; i++) {
//         const chunkPath = path.join(CHUNKS_DIR, `${sessionId}_chunk_${i}${path.extname(session.filename)}`);
//         if (!fs.existsSync(chunkPath)) {
//             console.error(`Missing chunk file: ${chunkPath}`);
//             return; // Exit if any chunk is missing
//         }
//         chunks.push(chunkPath);
//     }

//     const fileListPath = path.join(CHUNKS_DIR, `${session.filename}_filelist.txt`);
//     fs.writeFileSync(
//         fileListPath,
//         chunks.map(chunk => `file '${chunk.replace(/\\/g, '/')}'`).join('\n')
//     );
//     console.log('Generated file list:\n', fs.readFileSync(fileListPath, 'utf8'));

//     const ffmpegMerge = spawn('ffmpeg', [
//         '-f', 'concat',
//         '-safe', '0',
//         '-i', fileListPath,
//         '-c', 'copy',
//         session.finalPath
//     ]);

//     ffmpegMerge.stderr.on('data', (data) => {
//         console.error(`FFmpeg error: ${data.toString()}`);
//     });

//     ffmpegMerge.on('close', (code) => {
//         if (code === 0) {
//             chunks.forEach(chunkPath => fs.unlinkSync(chunkPath));
//             fs.unlinkSync(fileListPath);
//             console.log('Video merged successfully');
//         } else {
//             console.error(`FFmpeg merge failed with exit code ${code}`);
//         }
//     });
// }



module.exports = router