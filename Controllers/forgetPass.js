const nodemailer = require("nodemailer");
const userModels = require("../Models/userModels");
const { v4: uuidv4 } = require('uuid');
const bcrypt = require("bcrypt")



const transporter = nodemailer.createTransport({
    service : "gmail",
    secure : true,
    port : 465,
    auth: {
        user: process.env.USER,
        pass: process.env.PASS,
    }
})

const forgetPasswordHandler = async (req,res) => {
    const { email } = req.body;
    const user = await userModels.findOne({email})
    if(!user){
        res.json("User not found with this email")
    }
    else{
        const resetToken = uuidv4();
        user.resetToken = resetToken;
        user.resetTokenExpires = Date.now() + 3600000;
        await user.save()

        console.log("from " + user);

        const resetUrl = `http://localhost:3000/password/reset/${resetToken}`;

        const mailOptions = {
            from: "atulgupta0403@gmail.com",
            to: email,
            subject: 'Password Reset Request',
            text: `You requested a password reset. Click the link to reset your password: ${resetUrl}`,
            html: `<p>You requested a password reset. http://localhost:3000/password/reset/${resetToken}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).send(`Error sending email ${error}`);
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).send('Password reset email sent');
            }
        });
    }
}

const resetPasswordHandler = async (req,res) => {

    const { resetToken } = req.params;
    const { new_password } = req.body;

    const user = await userModels.findOne({
        resetToken : resetToken ,
        resetTokenExpires : {$gt : Date.now()}
    })
    
    
    if(!user){
        res.json("Password reset token is invalid or has expired.")
    }
    else{
        bcrypt.genSalt(10 , function(err,salt){
            bcrypt.hash(new_password , salt , async function(err,hash){
                user.password = hash;
                user.resetToken = null,
                user.resetTokenExpires = null,
                await user.save();

            })
        })
        res.json("password reset done")
    }
}


module.exports = {resetPasswordHandler , forgetPasswordHandler}