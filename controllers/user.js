const User = require('../model/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = (req,res,next)=>{
    bcrypt.hash(req.body.password,10).then((hash)=>{
        const user = new User({
            email:req.body.email,
            password:hash
        })
        user.save().then((result)=>{
            res.status(201).json({
                message:"User has been created!",
                result
            })
        }).catch(err=>{
            res.status(500).json({message:err})
        })
    })
}

exports.login = (req,res,next)=>{
    User.findOne({email:req.body.email}).then((user)=>{
        if(!user){
            return res.status(500).json({message:"Auth failed, credentials didn't match"})
        }
        return bcrypt.compare(req.body.password,user.password)
    }).then((result)=>{
        if(!result){
            return res.status(500).json({message:"Auth failed, credentials didn't match"})
        }
        // console.log(user.email);
        const token = jwt.sign({email:req.body.email},process.env.JWT_KEY,
        {expiresIn:'1h'});
        res.status(200).json({
            token:token,
            id:req.body.email,
            expiresIn:3600
        })
    }).catch((err)=>{
        return res.status(500).json({message:err})
    })
}