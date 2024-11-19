const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL)

const userSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
    },
    resetToken : {
        type : String,
    },
    resetTokenExpires : {
        type : Date
        
    }
})


module.exports = mongoose.model("User", userSchema);