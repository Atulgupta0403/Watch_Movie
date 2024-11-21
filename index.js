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
  // if()
    res.send("slash page")
})

const isLoggedIn = require("./Middlewares/isLoggedIn");

app.get("/profile" , isLoggedIn , (req,res) => {
  res.send("profile")
})


const signup = require("./Routes/signup")
const login = require("./Routes/login")
const forget = require("./Routes/forgetPass");
const addMovie = require("./Routes/addMovie")

app.use("/signup", signup)
app.use("/login", login)
app.use("/", forget)
app.use("/movie" , addMovie)



PORT = process.env.PORT;
app.listen(PORT || 3000, () => {
    console.log(`app is listening on port ${PORT}`)
})