exports.getPosts = (req,res,nesxt)=>{
    res.status(200).json({
        posts: [
            {title:'First post', title:'this is thes first post'}
        ]
    });
}


exports.createPost = (req , res, next)=>{
    const _title= req.body.title;
    const _content=req.body.content;
    res.status(200).json({
        status : true,
        message:'post created successfull',
        post:{
            id:new Date().toDateString(),
            title : _title,
            content : _content
        }
    });
}