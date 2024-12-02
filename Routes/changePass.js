const express = require("express")
const router = express.Router()
const {isLoggedIn} = require("../Middlewares/isLoggedIn")
const changePass = require("../Controllers/changePassController")

router.post("/" , isLoggedIn , changePass)


module.exports = router