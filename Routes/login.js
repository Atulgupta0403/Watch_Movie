const express = require("express")
const { login } = require("../Controllers/userController")
const router = express.Router()

router.post("/", login)

// router.get("/", (req, res) => {
//     res.send("<a href='/auth/google'>login with google</a>")
// })

module.exports = router