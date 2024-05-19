var express = require('express');
var blogCtrt = require('../controller/blogs');
var router= express.Router();



router.get('/posts',blogCtrt.getPosts);
router.post('/posts',blogCtrt.createPost);

module.exports = router;