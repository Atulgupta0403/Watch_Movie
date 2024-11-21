const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL)

const userSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    accountType : {
        type : String,
        default : "user",
        enum : ["user" , "admin"],
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
    },
    watchedMovie : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Movie"
    }]
})


module.exports = mongoose.model("User", userSchema);