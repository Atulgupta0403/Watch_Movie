const express = require("express");
const {isLoggedIn} = require("../Middlewares/isLoggedIn");
const {genre, choice} = require("../Controllers/genre");
const router = express.Router();

router.get("/" , isLoggedIn , genre);

router.post("/" , choice);

module.exports = router;