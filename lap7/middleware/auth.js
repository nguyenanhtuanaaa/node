 const jwt =require ("jsonwebtoken");
 exports.authenticate=(req,res,next)=>{
    const token=req.header('token');
    if(!token) return res.status(401).json({ message:"chua duoc truy cap"});
    jwt.verify (token,"fptpoly")
    .then(decoded=>{
        req.user=decoded;
        next();
    })
 }