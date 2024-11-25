const userModels = require("../Models/userModels")

const genre = async (req, res) => {
    if (req.user) {
        const user = await userModels.findOne({ email: req.user.email });
        if (user.genre.length < 1) {

            res.json({ "message": "first login" })
        }
        else {
            res.json({ "message": "more than one login" })
        }
    }
}

const choice = async (req, res) => {
    const { genre, email } = req.body;
    const user = await userModels.findOne({ email: email });
    if (!user) {
        res.json({ "message": "User not found" })
    }
    else {
        user.genre = genre;
        await user.save();
        res.json({ "message": "genre updated successfully" })

    }
}


module.exports = { genre, choice }