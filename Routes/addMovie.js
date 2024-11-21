const express = require("express");
const addMovie = require("../Controllers/movieController");
const isLoggedIn = require("../Middlewares/isLoggedIn");
const router = express.Router();


router.post("/" ,isLoggedIn, addMovie);


module.exports = router;