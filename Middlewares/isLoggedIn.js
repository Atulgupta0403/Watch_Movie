const jwt = require("jsonwebtoken")

const isLoggedIn = (req,res,next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];

    // console.log( authHeader);
    // console.log( "token " + token);
    
    if(!token){
        res.json("Access denied. No token provided.");
    }

    const user = jwt.verify(token , process.env.SECRET);
    req.user = user;
    next()
}


module.exports = isLoggedIn