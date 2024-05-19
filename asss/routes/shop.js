const express = require('express');
const productsController = require('../controllers/products');
const router = express.Router();
const multer = require('multer');
const db=require('../model/database');
const path = require('path'); 
const fs = require('fs');

router.get('/', (req, res) => {
    let sqlProducts = `SELECT * FROM products`;
    let sqlCatalog = `SELECT * FROM catalog`;
    db.query(sqlProducts, function (errProducts, dataProducts) {
      if (errProducts) throw errProducts;
      // res.json(dataProducts);
      db.query(sqlCatalog, function (errCatalog, dataCatalog) {
        if (errCatalog) throw errCatalog;
        res.render('shop', { catalogs: dataCatalog, products: dataProducts,loggedIn: res.locals.loggedIn  });
      });
    });
});

router.get('/search', (req, res) => {
  try {
    const searchTerm = req.query.term; 
    const query = `
      SELECT products.*, catalog.nameCategory
      FROM products
      INNER JOIN catalog ON products.idCategory = catalog.idCategory
      WHERE products.nameProduct LIKE '%${searchTerm}%'
    `;
    db.query(query, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
      } else {
        res.json({ success: true, products: results });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});
router.get("/shop/:cateId",(req,res)=>{
    let cateId = req.params.cateId; 
    let sqlProducts = `SELECT * FROM products where idCategory=${cateId}`;
    let sqlCatalog = `SELECT * FROM catalog `;
  
    db.query(sqlProducts, function (errProducts, dataProducts) {
      if (errProducts) throw errProducts;
      // res.json(dataProducts);
      db.query(sqlCatalog, function (errCatalog, dataCatalog) {
        if (errCatalog) throw errCatalog;
        res.render('shop', { catalogs: dataCatalog, products: dataProducts ,loggedIn: res.locals.loggedIn });
      });
    });
  });
 
  router.get('/detail/idProduct=:productId', (req, res) => {
    const productId = req.params.productId;
    let sqlProduct = `SELECT * FROM products WHERE idProduct = ?`;
    let sqlCatalog = `SELECT * FROM catalog`;
    let sqlReview = `SELECT * FROM review WHERE idProduct = ?`;
    db.query(sqlProduct, productId, function (errProduct, dataProduct) {
      if (errProduct) {
        console.error(errProduct);
        throw errProduct;
      }
      db.query(sqlCatalog, function (errCatalog, dataCatalog) {
        if (errCatalog) {
          console.error(errCatalog);
          throw errCatalog;
        }
        db.query(sqlReview, productId, function (errReview, dataReview) {
          if (errReview) {
            console.error(errReview);
            throw errReview;
          }
          const products = dataProduct;
          const reviews = dataReview;
          res.render('detail', { products: products, catalogs: dataCatalog, reviews: reviews,  });
        });
      });
    });
  });
  



//thêm bình luận
router.post('/addreview', (req, res) => {
  let reviewText = req.body.reviewText;
  let idProduct = req.query.idProduct;
 
  let review = {
      idProduct: idProduct, 
      reviewText: reviewText,
  };
  db.query('INSERT INTO review SET ?', review, function(err, data) {
      let sqlProducts = `SELECT * FROM products WHERE idProduct = ?`;
      let sqlCatalog = `SELECT * FROM catalog`;
      let sqlReviews = `SELECT * FROM review WHERE idProduct = ?`;

      db.query(sqlProducts, idProduct, function (errProducts, dataProducts) {
          if (errProducts) throw errProducts;

          db.query(sqlCatalog, function (errCatalog, dataCatalog) {
              if (errCatalog) throw errCatalog;

              db.query(sqlReviews, idProduct, function (errReviews, dataReviews) {
                  if (errReviews) throw errReviews;
                  res.render('detail', { products: dataProducts, catalogs: dataCatalog, reviews: dataReviews  });
              });
          });
      });
  });
});
module.exports = router;
