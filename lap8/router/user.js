const express = require('express');
const userController = require('../controllers/auth');
const router = express.Router();
// POST /blog/post
router.post('/register', userController.createUser);
router.post('/login/', userController.login);
router.post('/register',checkInput, userController.createUser);
router.post('/login/', userController.login);
router.get('/private/',authenticate, userController.testAuth);

module.exports = router;
