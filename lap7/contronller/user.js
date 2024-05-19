const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
exports.createUser = (req, res, next) => {
 const email = req.body.email;
 const password = req.body.password;
 const confirmPassword = req.body.confirmPassword;
 const typeUser = req.body.typeUser;
 console.log(email);
 User.findOne({where: { email: email }})
 .then(user => {
 if (user) {
 console.log(user.email);
 return res.status(400).json({message:"Email da ton tai"});
 }
 return bcrypt.hash(password, 12);
 })
 .then(hashedPassword=>{
 const user = new User({ email: email, password: hashedPassword,typeUser:typeUser });
 return user.save();
 })
 .then(user => {
 res.status(201).json({
 message: 'Thêm thành công thành viên!',
 user: user
 });
 })
 .catch(err => res.status(400).json(err))
};