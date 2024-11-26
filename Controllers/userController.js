const userModels = require("../Models/userModels");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
    const { username, email, password, accountType } = req.body
    const earlyUser = await userModels.findOne({ $or: [{ username }, { email }] })
    console.log("earlyUser + " + earlyUser)

    if (!username || !email || !password) {
        return res.json("All fields are required")
    }
    if (password.length < 6) {
        return res.json("password must of length 6 letter")
    }

    if (earlyUser) {
        return res.json("Username or Email already exist");
    }
    else {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, async function (err, hash) {
                const user = await userModels.create({
                    username,
                    email,
                    password: hash,
                    accountType
                })
                return res.json(user);
            });
        });
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await userModels.findOne({ email });
    if (user) {
        bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
                const token = jwt.sign({ email }, process.env.SECRET);
                console.log(token)
                res.json(token)
            }
            else {
                res.json("Incorrect Password");
            }
        })
    }
    else {
        return res.json(`There is no user with email = ${email}`);
    }
}


const logout = async (req, res) => {
    if (req.user) {
        const user = await userModels.findOneAndDelete({ email: req.user.email })
        res.json("Account deleted")
    }
}

module.exports = { signup, login, logout }