const express = require('express');
const multer = require('multer');
const checkAuth = require(".././middleware/route-auth");
const PostController = require(".././controllers/post")
const router = express.Router();

const MIME_TYPE_MAP ={
    'image/png':'png',
    'image/jpeg':'jpg',
    'image/jpg':'jpg'
}

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");
        if(isValid) {error = null;}
        cb(error, 'images');
    },
    filename: (req, file, cb)=>{
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + Date.now() + '.' + ext);
    }
})

router.post("",checkAuth,multer({storage:storage}).single('image'),PostController.create)

router.get("/:id",PostController.fetchOne)

router.get("",PostController.fetch)

router.put("/:id",checkAuth,multer({storage:storage}).single("image") ,PostController.update)

router.delete("/:id",checkAuth, PostController.delete)

module.exports = router