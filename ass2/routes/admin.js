const express = require('express');
const productsController = require('../controllers/products');
const router = express.Router();
const multer = require('multer');
const db=require('../model/database');
const path = require('path'); 
const fs = require('fs');

router.get('/admin', (req, res) => {
    let sqlProducts = `SELECT * FROM products`;
    let sqlCatalog = `SELECT * FROM catalog`;
  
    db.query(sqlProducts, function (errProducts, dataProducts) {
      if (errProducts) throw errProducts;
  
      db.query(sqlCatalog, function (errCatalog, dataCatalog) {
        if (errCatalog) throw errCatalog;
  
        res.render('add-product', { catalogs: dataCatalog, products: dataProducts });
      });
    });
});


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const destinationPath = path.join(__dirname, '..','public', 'image');
      cb(null, destinationPath);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileExtension = file.mimetype.split('/')[1]; 
      const fileName = file.fieldname + '-' + uniqueSuffix + '.' + fileExtension;
      cb(null, fileName);
    }
  });
  const upload = multer({ storage: storage })
  router.post('/addnew', upload.single('productImage'),(req, res) => {
    const file = req.file
    let idCategory=req.body.idCategory;
    let title=req.body.productName;
    let price=req.body.price;
    let description=req.body.description;
    let nameImage=file.filename;
    product={
      idCategory:idCategory,
      nameProduct:title,
      priceProduct:price,
      sortDescription:description,
      images:nameImage,
    }
    db.query('insert into products SET ?',product, function(err, data) {
      let sqlProducts = `SELECT * FROM products`;
    let sqlCatalog = `SELECT * FROM catalog`;
  
    db.query(sqlProducts, function (errProducts, dataProducts) {
      if (errProducts) throw errProducts;
  
      db.query(sqlCatalog, function (errCatalog, dataCatalog) {
        if (errCatalog) throw errCatalog;
  
        res.render('shop', { catalogs: dataCatalog, products: dataProducts });
      });
    });
   
    })  
});


module.exports = router;