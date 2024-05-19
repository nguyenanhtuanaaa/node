const express = require('express');
// const bookController = require('../controllers/book');
const router = express.Router();
const multer = require('multer');
const db=require('../controllers/database');
const path = require('path'); 
const fs = require('fs');

router.get('/', (req, res) => {
    let sqlbook = `SELECT * FROM book`;
    let sqlcategory = `SELECT * FROM category`;
  
    db.query(sqlbook, function (errbook, databook) {
      if (errbook) throw errbook;
  
      db.query(sqlcategory, function (errcategory, datacategory) {
        if (errcategory) throw errcategory;
  
        res.render('shop', { category: datacategory, book: databook });
      });
    });
});

router.get("/shop/:cateId",(req,res)=>{
    let cateId = req.params.cateId; 
    let sqlbook = `SELECT * FROM book where idCategory=${cateId}`;
    let sqlcategory = `SELECT * FROM category `;
  
    db.query(sqlbook, function (errbook, databook) {
      if (errbook) throw errbook;
  
      db.query(sqlcategory, function (errcategory, datacategory) {
        if (errcategory) throw errcategory;
        
        res.render('shop', { categorys: datacategory, book: databook });
      });
    });
  });
  router.get('/addnew', (req, res) => {
        let sqlcategory = `SELECT * FROM category`;
        db.query(sqlcategory, function (errcategory, datacategory) {
          if (errcategory) throw errcategory;
        res.render('add-product', { categorys:datacategory });
        })
      
});
 
router.get('/detail/idProduct=:productId', (req, res) => {
    const productId = req.params.productId;
    let sqlProduct = `SELECT * FROM book WHERE idProduct= ?`;
    let sqlcategory = `SELECT * FROM category`;
    db.query(sqlProduct, productId, function (errProduct, dataProduct) {
        if (errProduct) {
            console.error(errProduct);
            throw errProduct;
        }
        console.log(dataProduct);
        db.query(sqlcategory, function (errcategory, datacategory) {
            if (errcategory) {
                console.error(errcategory);
                throw errcategory;
            }
            const book = dataProduct;
            res.render('detail', { book: book, categorys: datacategory });
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
    db.query('insert into book SET ?',product, function(err, data) {
      let sqlbook = `SELECT * FROM book`;
    let sqlcategory = `SELECT * FROM category`;
  
    db.query(sqlbook, function (errbook, databook) {
      if (errbook) throw errbook;
  
      db.query(sqlcategory, function (errcategory, datacategory) {
        if (errcategory) throw errcategory;
  
        res.render('shop', { categorys: datacategory, book: databook });
      });
    });
   
    })  
});
module.exports = router;
