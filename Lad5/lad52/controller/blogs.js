 const Post = require('../models/post');
 exports.getPosts = (req,res,next) =>{
    Post.findAll()
    .them(posts =>{
        res
        .status(200)
        .json({message: 'fetched post succc', posts: posts});
    })
    .catch(err =>{
        if (!err.statusCode){
            err.statusCode= 500;
        }
        next(err);
    });
 };


 exports.getPostById = (req, res, next)=>{
    const postId = req.params.postId;
    Post.findAll(postId)
    .then(post=>{
        if(!post){
            const error = new Error('khong tim thay bai viet - post.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({message:'Post ddc tim thay'});
    })
    .catch(err =>{
        if (!err.statusCode){
            err.statusCode= 500;
        }
        next(err);
    });
 };