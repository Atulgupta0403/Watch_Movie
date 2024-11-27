const movieModel = require("../Models/movieModel");
const userModels = require("../Models/userModels");



const likeVideo = async (req, res) => {
    if (req.user) {
        const id = req.headers['id']
        const user = await userModels.findOne({ email: req.user.email })
        const movie = await movieModel.findOne({ _id: id })

        if (user.userLike.includes(id)) {
            user.userLike.splice(user.userLike.indexOf(id), 1)
            await user.save()
            movie.like -= 1;
            await movie.save()
            res.json(movie.like)
        }
        else {
            user.userLike.push(id)
            await user.save()
            movie.like += 1;
            await movie.save();
            res.json(movie.like)
        }
    }
}

const review = async (req,res) => {
    if(req.user){
        const {review} = req.body;
        const id = req.headers['id'];
        const movie = await movieModel.findOne({ _id : id})
        movie.reviews.push(review)
        movie.save();
        res.send(movie.reviews)
    }
}


module.exports = { likeVideo , review };