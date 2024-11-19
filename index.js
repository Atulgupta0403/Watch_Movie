require("dotenv").config();
const express = require("express");
const app = express()


app.use(express.json())


app.get("/", (req, res) => {
    res.send("slash page")

})


const signup = require("./Routes/signup")
const login = require("./Routes/login")
// const google = require("./Routes/googleLogin");

app.use("/signup", signup)
app.use("/login", login)
// app.use("/auth/google" , google)
PORT = process.env.PORT;

app.listen(PORT || 3000, () => {
    console.log(`app is listening on port ${PORT}`)
})