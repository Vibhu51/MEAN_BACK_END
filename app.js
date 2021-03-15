const express = require('express');
const bodyParser = require('body-parser');
const path = require('path')
// const Post = require('./model/model')
const mongoose = require('mongoose');
const PostRoutes = require('./routes/postRoutes');
const UserRoutes = require("./routes/userRoutes")
const { json } = require('body-parser');

//mongo DB fB5kFnQWvVhJ9Xi5  vibhu11

const app = express();

mongoose.connect('mongodb+srv://vibhu11:' + process.env.MONGO_ATLAS_PWD + '@cluster0.3hfy0.mongodb.net/posts?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log('connected to database');
}).catch((err)=>{
    console.log(err);
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))
app.use("/images", express.static(path.join('images')))

app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods",
    "GET, PUT, PATCH, DELETE, OPTIONS");
    next();
})

app.use("/api/posts", PostRoutes);

app.use("/api/user", UserRoutes);

module.exports = app;