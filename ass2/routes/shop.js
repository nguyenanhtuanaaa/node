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
  
        res.render('shop', { catalogs: dataCatalog, products: dataProducts });
     
        
      });
    });
});
router.post('/', (req, res) => {
  
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
router.get("/shop/:cateId",(req,res)=>{
    let cateId = req.params.cateId; 
    let sqlProducts = `SELECT * FROM products where idCategory=${cateId}`;
    let sqlCatalog = `SELECT * FROM catalog `;
  
    db.query(sqlProducts, function (errProducts, dataProducts) {
      if (errProducts) throw errProducts;
      // res.json(dataProducts);
      db.query(sqlCatalog, function (errCatalog, dataCatalog) {
        if (errCatalog) throw errCatalog;
        
        res.render('shop', { catalogs: dataCatalog, products: dataProducts });
      });
    });
  });
//   router.get('/addnew', (req, res) => {
//         let sqlCatalog = `SELECT * FROM catalog`;
//         db.query(sqlCatalog, function (errCatalog, dataCatalog) {
//           if (errCatalog) throw errCatalog;
//         res.render('add-product', { catalogs:dataCatalog });
//         })
      
// });
 
router.get('/detail/idProduct=:productId', (req, res) => {
    const productId = req.params.productId;
    let sqlProduct = `SELECT * FROM products WHERE idProduct= ?`;
    let sqlCatalog = `SELECT * FROM catalog`;
    db.query(sqlProduct, productId, function (errProduct, dataProduct) {
        if (errProduct) {
            console.error(errProduct);
            throw errProduct;
        }
        // res.json(dataProduct);
        db.query(sqlCatalog, function (errCatalog, dataCatalog) {
            if (errCatalog) {
                console.error(errCatalog);
                throw errCatalog;
            }
            const products = dataProduct;
            res.render('detail', { products: products, catalogs: dataCatalog });
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
    let author=req.body.authorProduct;
    let description=req.body.description;
    let nameImage=file.filename;
    product={
      idCategory:idCategory,
      nameProduct:title,
      authorProduct:author,
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
  router.get('/resgiter', (req, res) => {
  let sqlCatalog = `SELECT * FROM catalog`;
  db.query(sqlCatalog, function (errCatalog, dataCatalog) {
    if (errCatalog) throw errCatalog;
  res.render('resgiter', { catalogs:dataCatalog });
  })

});
  router.get('/login', (req, res) => {
  let sqlCatalog = `SELECT * FROM catalog`;
  db.query(sqlCatalog, function (errCatalog, dataCatalog) {
    if (errCatalog) throw errCatalog;
  res.render('login', { catalogs:dataCatalog });
  })

});
module.exports = router;
