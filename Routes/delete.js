const express = require("express");
const { isLoggedIn } = require("../Middlewares/isLoggedIn");
const { Delete } = require("../Controllers/userController");
const router = express.Router();

router.delete("/", isLoggedIn, Delete)

module.exports = router