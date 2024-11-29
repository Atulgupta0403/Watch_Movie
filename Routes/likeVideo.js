const express = require("express");
const { isLoggedIn } = require("../Middlewares/isLoggedIn");
const { likeVideo, review, rating, likedVideo } = require("../Controllers/movieUpdate");
const router = express.Router();

router.post("/like" , isLoggedIn , likeVideo)

router.get("/like" , isLoggedIn , likedVideo)

router.post("/review" , isLoggedIn , review)

router.post("/rating" , isLoggedIn , rating)

module.exports = router;