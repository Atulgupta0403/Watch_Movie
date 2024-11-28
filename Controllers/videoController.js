const movieModel = require("../Models/movieModel")


const video = async (req,res) => {
    if(req.user){
        const id = req.headers['id'];
        const movie = await movieModel.findOne({ _id : id})
        
    }
}

module.exports = video