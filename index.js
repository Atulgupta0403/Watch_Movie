require("dotenv").config();
const express = require("express");
const session = require('express-session');
const app = express()
const passport = require("passport")
const status = require("express-status-monitor")


app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 60000
  }
}));


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(passport.initialize());
app.use(passport.session());
app.use(status())
app.set("view engine" , "ejs")


app.get("/", (req, res) => {
  res.send("slash page")
})


const signup = require("./Routes/signup")
const login = require("./Routes/login")
const forget = require("./Routes/forgetPass")
const uploadVideo = require("./Routes/uploadVideo")
const genre = require("./Routes/genre")
const video = require("./Routes/videos")
const Delete = require("./Routes/delete")
const like = require("./Routes/likeVideo")
const watchList = require("./Routes/watchList")
const uploadChunk = require("./Controllers/multer")

app.use("/signup", signup)
app.use("/login", login)
app.use("/", forget)
app.use("/", uploadVideo)
app.use("/genre", genre)
app.use("/", video)
app.use("/delete", Delete)
app.use("/",like)
app.use("/",watchList)
app.use("/",uploadChunk)



PORT = process.env.PORT;
app.listen(PORT || 3000, () => {
  console.log(`app is listening on port ${PORT}`)
})