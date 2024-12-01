const userModel = require("../Models/userModels")
const bcrypt = require("bcrypt")

const changePass =  async (req,res) => {
    if(req.user){
        const {new_password , old_password} = req.body;
        const user = await userModel.findOne({ email : req.user.email });
        const hashPassword = user.password;
        
        if(new_password.length < 6){
            return res.json("Password must be greater than 6 digit")
        }

        bcrypt.compare(old_password ,hashPassword  ,(err,result) => {
            if(result){
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(new_password, salt, async function(err, hash) {
                        user.password = hash;
                        await user.save();
                        res.json("password chnaged")
                    });
                });
            }
            else{
                res.json("Incorrect old password")
            }
        })
    }
}


module.exports = changePass