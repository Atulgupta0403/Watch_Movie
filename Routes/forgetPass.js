const express = require("express");
const { forgetPasswordHandler, resetPasswordHandler } = require("../Controllers/forgetPass");
const router = express.Router();

router.post("/password/reset",forgetPasswordHandler)

router.post("/password/reset/:resetToken", resetPasswordHandler)

module.exports = router;
