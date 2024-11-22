require("dotenv").config();
const express = require("express");
const session = require('express-session');
const app = express()
const passport = require("passport")



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


app.get("/", (req, res) => {
    res.send("slash page")
})


const signup = require("./Routes/signup")
const login = require("./Routes/login")
const forget = require("./Routes/forgetPass")
const addMovie = require("./Routes/addMovie")
const uploadVideo = require("./Routes/uploadVideo")
const genre = require("./Routes/genre")

app.use("/signup", signup)
app.use("/login", login)
app.use("/", forget)
app.use("/movie" , addMovie)
app.use("/" , uploadVideo)
app.use("/genre" , genre)



PORT = process.env.PORT;
app.listen(PORT || 3000, () => {
    console.log(`app is listening on port ${PORT}`)
})