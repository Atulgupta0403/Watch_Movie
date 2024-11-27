const express = require("express");
const { isLoggedIn } = require("../Middlewares/isLoggedIn");
const { likeVideo, review } = require("../Controllers/movieUpdate");
const router = express.Router();

router.post("/like" , isLoggedIn , likeVideo)

router.post("/review" , isLoggedIn , review)

module.exports = router;