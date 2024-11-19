const express = require("express");
const { signup } = require("../Controllers/userController");
const router = express.Router()

router.post("/",signup)

module.exports = router