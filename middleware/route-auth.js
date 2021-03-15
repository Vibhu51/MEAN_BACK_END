const jwt = require('jsonwebtoken');


module.exports = (req,res,next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        // console.log("working 1");
        // const user = req.headers.authorization.split(" ")[2];
        const decodedToken = jwt.decode(token, "this_should_kept_secret");
        // console.log("working 2");
        req.email = req.headers.authorization.split(" ")[2];
        // console.log("working 3");
        // console.log(decodedToken, user);
        next();
    } catch(err){
        res.status(401).json({message:"Auth failed!"})
    }
} 