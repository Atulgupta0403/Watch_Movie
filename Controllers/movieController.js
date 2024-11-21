const movieModel = require("../Models/movieModel");
const userModels = require("../Models/userModels");


const addMovie = async (req,res) => {
    if(req.user){
        const user = await userModels.findOne({username : req.user.username})
        if(user.accountType === "admin"){

            const {movieName , link , type , duration } = req.body;
            if(!movieName || !link || !type || !duration){
                res.json("All fields are required")
            }
            
            const movie = await movieModel.create({
                movieName,
                link,
                type,
                duration,
            })
            res.json(movie)
        }
        else{
            res.json("you are not authorized");
        }
    }
}


module.exports = addMovie