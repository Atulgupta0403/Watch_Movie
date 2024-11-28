const express = require("express");
const { forgetPasswordHandler, resetPasswordHandler } = require("../Controllers/forgetPass");
const router = express.Router();

router.post("/password/reset",forgetPasswordHandler)

router.post("/password/reset/:resetToken", resetPasswordHandler)

router.get("/password/reset/:resetToken" , (req,res) => {
    const {resetToken} = req.params
    res.render('new_password' , {token : resetToken})
})

module.exports = router;
