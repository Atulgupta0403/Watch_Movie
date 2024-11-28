const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL)

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique : true,
        required : true
    },
    accountType : {
        type : String,
        default : "user",
        enum : ["user" , "admin"],
    },
    email: {
        type: String,
        required: true,
        unique : true,
        // match : ["/@\^" , "Provide valid email"]
    },
    password: {
        type: String,
        required : true
    },
    genre : [{
        type : String
    }],
    watchedMovie : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Movie"
    }],
    resetToken : {
        type : String,
    },
    resetTokenExpires : {
        type : Date  
    },
    like : [{
        type : String
    }],
    userLike : [{
        type : String
    }],
    watchList : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Movie"
    }]
})


module.exports = mongoose.model("User", userSchema);