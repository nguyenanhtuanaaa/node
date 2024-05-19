const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const User = sequelize.define('tblUsers', {
 id: {
 type: Sequelize.INTEGER,
 autoIncrement: true,
 allowNull: false,
 primaryKey: true
 },
 email: {
 type: Sequelize.STRING,
 required: true
 },
 password: {
 type: Sequelize.STRING,
 required: true
 },
 typeUser: {
 type: Sequelize.INTEGER,
 required: true
 }
},
{ timestamps: false }
);
exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
   
    User.findOne({where: { email: email }})
    .then(user => {
    if (!user) {
    return res.status(400).json({message:"Email khong ton tai"});
    }
    return Promise.all([bcrypt.compare(password, user.password),user]);
    })
    .then(result=>{
    const isMatch=result[0];
    const user=result[1];
   
    if(!isMatch) return res.status(400).json({message:"Password khong khop"})
    const payload={
    email:user.email,
    typeUser:user.typeUser
    }
    console.log(payload);
    return jwt.sign(payload,"FptPolyTechnic",{expiresIn:3600})
    })
    .then(token=>{
    console.log(token);
    res.status(200).json({message:"Login thanh cong",token})
    })
    .catch(err => res.status(400).json(err))
   };
   exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
   
    User.findOne({where: { email: email }})
    .then(user => {
    if (!user) {
    return res.status(400).json({message:"Email khong ton tai"});
    }
    return Promise.all([bcrypt.compare(password, user.password),user]);
    })
    .then(result=>{
    const isMatch=result[0];
    const user=result[1];
   
    if(!isMatch) return res.status(400).json({message:"Password khong khop"})
    const payload={
    email:user.email,
    typeUser:user.typeUser
    }
    console.log(payload);
    return jwt.sign(payload,"FptPolyTechnic",{expiresIn:3600})
    })
    .then(token=>{
    console.log(token);
    res.status(200).json({message:"Login thanh cong",token})
    })
    .catch(err => res.status(400).json(err))
   };
      
module.exports = User;
