const mongoose = require("mongoose");


const movieSchema = new mongoose.Schema({
    movieName : {
        type : String,
    },
    link : {
        type : String,
    },
    type : {
        type : String
    },
    cast : [{
        type : String,
        required : true
    }],
    thumbnail : {
        type : String,
    }
})

module.exports = mongoose.model("Movie" , movieSchema);