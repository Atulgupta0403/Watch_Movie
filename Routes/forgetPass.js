const express = require("express");
const { forgetPasswordHandler, resetPasswordHandler } = require("../Controllers/forgetPass");
const router = express.Router();

router.get("/password/reset",forgetPasswordHandler)

router.get("/password/reset/:resetToken", resetPasswordHandler)

module.exports = router;
