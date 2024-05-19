const express = require('express');
const productsController = require('../controllers/products');
const router = express.Router();
const multer = require('multer');
const db=require('../controllers/database');
const path = require('path'); 
const fs = require('fs');

router.get('/', (req, res) => {
        res.render('home');
      });
      
module.exports = router;
 