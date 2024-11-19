require("dotenv").config();
const express = require("express");
const session = require('express-session');
const app = express()
const passport = require("passport")



app.use(session({
  secret: 'your-secret-key', // Replace with a strong, unique key
  resave: false,             // Avoid resaving unchanged sessions
  saveUninitialized: true,   // Save new sessions even if they're empty
  cookie: {                  // Optional: Configure cookies
    secure: false,           // Set `true` if using HTTPS
    maxAge: 60000            // Session duration in milliseconds
  }
}));


app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.get("/", (req, res) => {
    res.send("slash page")
})


app.use(passport.initialize());
app.use(passport.session());

const signup = require("./Routes/signup")
const login = require("./Routes/login")
const forget = require("./Routes/forgetPass");

app.use("/signup", signup)
app.use("/login", login)
app.use("/", forget)



PORT = process.env.PORT;
app.listen(PORT || 3000, () => {
    console.log(`app is listening on port ${PORT}`)
})