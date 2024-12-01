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

const likedVideo = async (req,res) => {
    if(req.user){
        const user = await userModels.findOne({email : req.user.email})
        const moviesId = user.userLike;
        // const movies = [];
        const movies = await Promise.all(
            moviesId.map(async (id) => {
                const movie = await movieModel.findOne({ _id: id }).select("-trailer_url");
                return movie;
            })
        );
        res.json(movies)
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

const rating = async (req,res) => {
    if(req.user){
        const id = req.headers['id'];
        const { rate } = req.body;
        const movie = await movieModel.findOne({ _id : id });
        movie.rating = rate;
        await movie.save();
        res.json(movie.rating)
        
    }
}


const watchList = async (req,res) => {
    if(req.user){
        const id = req.headers['id'];
        const user = await userModels.findOne({ email : req.user.email })
        if(user.watchList.includes(id)){
            res.json("Already added")
        }
        else{
            user.watchList.push(id);
            await user.save();
            res.json("Added")
        }
    }
}

const getWatchList = async (req,res) => {
    if (req.user) {
        const user = await userModels.findOne({ email: req.user.email });
        const ids = user.watchList;
        const movies = await Promise.all(
            ids.map(async (id) => {
                const movie = await movieModel.findOne({ _id: id }).select("-trailer_url");
                return movie;
            })
        );
        res.json(movies); 
    }
}

module.exports = { likeVideo , review , rating , watchList , getWatchList , likedVideo};