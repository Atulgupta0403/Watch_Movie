const express = require("express");
const { isLoggedIn } = require("../Middlewares/isLoggedIn");
const { logout } = require("../Controllers/userController");
const router = express.Router();

router.get("/", isLoggedIn, logout)

module.exports = router