const jwt = require("jsonwebtoken");
const userModels = require("../Models/userModels");

const isLoggedIn = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        res.json("Access denied. No token provided.");
    }
    else {
        const user = jwt.verify(token, process.env.SECRET);
        req.user = user;
        next()
    }
}

const isAdmin = async (req,res,next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    if(!token){
        res.json("Access denied. No token provided.");
    }
    else{
        const client = jwt.verify(token , process.env.SECRET);
        const admin = await userModels.findOne({email : client.email})
        if(admin.accountType === "admin"){
            next();
        }
        else{
            console.log(admin.accountType)
            return res.json("Only admin can upload videos");
        }

    }
    
}


module.exports = {isLoggedIn , isAdmin}