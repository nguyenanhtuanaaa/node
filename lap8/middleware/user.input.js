const lad=require('lodash');
const validator=require('validator');
const createUser=require('../contronller/user');
const{User}=require('../model/user');
exports.checkInput = async (req,res,next)={
    let errors ={};
    const email=lad.get(req.body."email","");
    const  password= lad.get(req.body."password","");
    const  password2= lad.get(req.body."confirmPassword","");
    const typeUser=lad.get(req.body."typeUser","");
    if(validator.isEmpty(email)){
        errors.email="phai nhap email";
    if(lad.isEmpty(errors)) return next();
    return res.status(400).json(errors)
    }
}