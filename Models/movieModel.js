const mongoose = require("mongoose");


const movieSchema = new mongoose.Schema({
    movie_id : {
        type : Number
    },
    title : {
        type : String,
    },
    overview : {
        type : String
    },
    genres : [{
        type : String
    }],
    keywords : [{
        type : String
    }],
    cast : [{
        type : String,
        required : true
    }],
    crew : [{
        type : String
    }],
    poster_url : {
        type : String,
    },
    trailer_url : {
        type : String,
    },
    rating : {
        type : Number
    },
    reviews : [{
        type : String
    }],
    like : {
        type : Number,
        default : 0,
    }

})

module.exports = mongoose.model("Movie" , movieSchema);