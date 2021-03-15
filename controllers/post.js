const Post = require('../model/model') 

exports.create =(req,res,next)=>{
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
        title:req.body.title,
        content:req.body.content,
        imagePath: url + '/images/'+ req.file.filename,
        creator: req.email
    })
    post.save().then(()=>{
        console.log(post);
        res.status(201).json({
            message:"Post added successfully!",
            post:{
                id:post._id,
                title:post.title,
                content:post.content,
                imagePath:post.imagePath,
                creator:post.creator
            }
        })
    }).catch(e=>{
        // console.log(e);
        res.status(500).json({
            message:"Creating a post failed!"
        })
    })

}

exports.update = (req, res, next)=>{
    let imagePath = req.body.imagePath
    const url = req.protocol + "://" + req.get("host");
    if(req.file){
        
        imagePath = url + "/images/" + req.file.filename 
    }
    console.log(url);
    const post = new Post({
        title:req.body.title,
        content:req.body.content,
        _id:req.params.id,
        imagePath:imagePath,
        creator:req.email
    })
    console.log(post);
    // console.log(req.body);
    Post.updateOne({_id:req.params.id, creator:req.email},post).then((result)=>{
        console.log(result);
        if(result.nModified>0){
            res.status(200).json({
                message:"Updated Successfully!",
            })
        } else{
            res.status(401).json({
                message:"UnAuthorized to perform this action",
            })
        }
    }).catch(err=>{
        res.status(500).json({
            message:"Couldn't update post"
        })
    })
}

exports.delete = (req,res,next)=>{
    console.log(req.params.id);
    Post.deleteOne({_id:req.params.id, creator:req.email}).then((result)=>{
        console.log(result);
        if(result.n>0){
            res.status(200).json({
                message:"Updated Successfully!",
            })
        } else{
            res.status(401).json({
                message:"UnAuthorized to perform this action",
            })
        }
    }).catch((err)=>{
        res.status(500).json({
            message:"Couldn't update post"
        })
    })
    // res.status(200).json({message:"Post deleted"});
}

exports.fetch = (req,res,next)=>{
    const pageSize = +req.query.pagesize;
    const page = +req.query.currentpage;
    const postQuery = Post.find();
    let fetchedPosts;
    if(pageSize && page){
        postQuery.skip(pageSize * (page - 1)).limit(pageSize);
    }
    postQuery.then((document)=>{
        fetchedPosts = document;
        return Post.countDocuments();
    }).then((data)=>{
        // console.log(data);
        res.status(200).json({
            message:"Posts fetched successfully",
            posts:fetchedPosts,
            maxPosts:data}); 
    }).catch(()=>{
        res.status(500).json({
            message:"OOPS!, some connection problem",
            posts:null});
    })
}

exports.fetchOne = (req,res,next)=>{
    Post.findById(req.params.id).then((data)=>{
       if(data){
        res.status(200).json({post:data})
       } else{
           res.status(404).json({message:"Post not found!"})
       }
    })
}

