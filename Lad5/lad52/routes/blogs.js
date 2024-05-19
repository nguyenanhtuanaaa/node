var express = require('express');
var blogCtrt = require('../controller/blogs');
var router= express.Router();



router.get('/posts',blogController.getPosts);
router.get('/posts/:postId',blogController.getPostById);

router.post('/posts',blogController.createPost);

module.exports = router;