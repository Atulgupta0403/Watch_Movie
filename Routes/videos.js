const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router()
const video = require("../Controllers/videoController");
const { isLoggedIn } = require("../Middlewares/isLoggedIn");

router.get("/"  , video)

module.exports = router