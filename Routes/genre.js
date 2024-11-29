const express = require("express");
const {isLoggedIn} = require("../Middlewares/isLoggedIn");
const {genre, choice, getgenre} = require("../Controllers/genre");
const router = express.Router();

router.get("/" , isLoggedIn , genre);

router.post("/" , choice);

router.get("/get" , isLoggedIn , getgenre);

module.exports = router;