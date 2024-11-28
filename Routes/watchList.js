const express = require("express");
const { isLoggedIn } = require("../Middlewares/isLoggedIn");
const { watchList, getWatchList } = require("../Controllers/movieUpdate");
const router = express.Router();

router.post("/watchList" , isLoggedIn , watchList);

router.get("/watchList" , isLoggedIn , getWatchList)

module.exports = router