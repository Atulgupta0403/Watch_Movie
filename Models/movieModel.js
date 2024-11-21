const mongoose = require("mongoose");


const movieSchema = new mongoose.Schema({
    id : {
        type : Number
    },
    movieName : {
        type : String,
    },
    link : {
        type : String,
    },
    type : {
        type : String
    },
    duration : {
        type : String,
    },
    thumbnail : {
        type : String,
    }
})

module.exports = mongoose.model("Movie" , movieSchema);