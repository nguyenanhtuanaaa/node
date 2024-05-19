const express = require('express');
const productsController = require('../controllers/products');
const router = express.Router();
router.use(express.urlencoded({ extended: true }));
const multer = require('multer');
const db=require('../model/database');
const path = require('path'); 
const fs = require('fs');
express.urlencoded({ extended: true })

router.get('/', (req, res) => {
    let sqlProducts = `SELECT * FROM products`;
    let sqlCatalog = `SELECT * FROM catalog`;
  
    db.query(sqlProducts, function (errProducts, dataProducts) {
      if (errProducts) throw errProducts;
  
      db.query(sqlCatalog, function (errCatalog, dataCatalog) {
        if (errCatalog) throw errCatalog;
      //  res.json(dataCatalog);
        res.render('homeadmin', { catalogs: dataCatalog, products: dataProducts });
      });
    });
});
router.get('/product', (req, res) => {
    let sqlProducts = `SELECT * FROM products`;
    let sqlCatalog = `SELECT * FROM catalog`;
  
    db.query(sqlProducts, function (errProducts, dataProducts) {
      if (errProducts) throw errProducts;
      // res.json(dataProducts);
      db.query(sqlCatalog, function (errCatalog, dataCatalog) {
        if (errCatalog) throw errCatalog;
  
        res.render('product', { catalogs: dataCatalog, products: dataProducts });
      });
    });
});
router.get('/review', (req, res) => {
  const sqlProducts = `SELECT * FROM products`;
  const sqlCatalog = `SELECT * FROM catalog`;
  const sqlReview = `
      SELECT review.*, products.nameProduct AS nameProduct, products.images AS images
      FROM review
      INNER JOIN products ON review.idProduct = products.idProduct
  `;

  db.query(sqlProducts, (errProducts, dataProducts) => {
      if (errProducts) throw errProducts;

      db.query(sqlCatalog, (errCatalog, dataCatalog) => {
          if (errCatalog) throw errCatalog;

          db.query(sqlReview, (errReview, dataReview) => {
              if (errReview) throw errReview;

              res.render('review', { catalogs: dataCatalog, products: dataProducts, reviews: dataReview });
          });
      });
  });
});
router.get('/review/:idProduct', (req, res) => {
  const idProduct = req.params.idProduct;
  console.log("Received idProduct:", idProduct);

  const sqlProducts = `SELECT * FROM products`;
  const sqlCatalog = `SELECT * FROM catalog`;
  const sqlReview = `
      SELECT review.*
      FROM review
      INNER JOIN products ON review.idProduct = products.idProduct
      WHERE review.idProduct = ?
  `;

  db.query(sqlProducts, (errProducts, dataProducts) => {
    if (errProducts) {
      console.error("Error fetching products:", errProducts);
      return res.status(500).send("Internal Server Error");
    }

    db.query(sqlCatalog, (errCatalog, dataCatalog) => {
      if (errCatalog) {
        console.error("Error fetching catalog:", errCatalog);
        return res.status(500).send("Internal Server Error");
      }

      db.query(sqlReview, [idProduct], (errReview, dataReview) => {
        if (errReview) {
          console.error("Error fetching reviews:", errReview);
          return res.status(500).send("Internal Server Error");
        }

        res.render('review', { catalogs: dataCatalog, products: dataProducts, reviews: dataReview });
      });
    });
  });
});




router.get('/product/:idProduct', (req, res) => {
  const productId = req.params.idProduct;
  let sqlProducts = 'SELECT * FROM products WHERE idProduct = ?';
  let sqlCatalog = 'SELECT * FROM catalog';

  db.query(sqlProducts, [productId], function (errProducts, dataProducts) {
    if (errProducts) {
      console.error(errProducts);
      return res.status(500).send('Lỗi khi lấy chi tiết sản phẩm.');
    }

    db.query(sqlCatalog, function (errCatalog, dataCatalog) {
      if (errCatalog) {
        console.error(errCatalog);
        return res.status(500).send('Lỗi khi lấy danh mục.');
      }

      res.render('product', { catalogs: dataCatalog, products: dataProducts });
    });
  });
});

router.post('/catenew', (req, res) => {
  console.log('Handling POST request to /catenew');
  let nameCategory = req.body.categoryName;
  const newCategory = {
      nameCategory: nameCategory
  };

  db.query('INSERT INTO catalog SET ?', newCategory, (err, result) => {
      
      if (err) {
          console.error('Lỗi khi thêm vào cơ sở dữ liệu:', err);
          res.status(500).send('Lỗi khi thêm vào cơ sở dữ liệu');
      } else {
          console.log('Đã thêm mới vào cơ sở dữ liệu');
          // res.render('homeadmin', { catalogs: dataCatalog, products: dataProducts });
          
          res.status(200).json({ message: 'Đã thêm mới vào cơ sở dữ liệu' });
      }
  });
});


router.delete('/delete-category/:categoryId', (req, res) => {
  const categoryId = req.params.categoryId;

  db.query('DELETE FROM products WHERE idCategory = ?', categoryId, (productErr, productResult) => {
      if (productErr) {
          console.error(productErr);
          res.status(500).json({ message: 'Lỗi khi xóa sản phẩm của category' });
      } else {
          db.query('DELETE FROM catalog WHERE idCategory = ?', categoryId, (categoryErr, categoryResult) => {
              if (categoryErr) {
                  console.error(categoryErr);
                  res.status(500).json({ message: 'Lỗi khi xóa category' });
              } else {
                  res.status(200).json({ message: 'Xóa category và sản phẩm thành công' });
         
              }
          });
      }
  });
});

router.put('/addneww/:idCategory', (req, res) => {
  const categoryId = req.params.idCategory;
  console.log('Received PUT request:', req.params.idCategory);
  const newNameCategory = req.body.categoryName;
  if (!isNaN(categoryId) && categoryId > 0) {
    db.query('UPDATE catalog SET nameCategory = ? WHERE idCategory = ?', [newNameCategory, categoryId], (err, result) => {
      
      if (err) {
        console.error('Lỗi khi cập nhật cơ sở dữ liệu:', err);
        res.status(500).json({ message: 'Lỗi khi cập nhật cơ sở dữ liệu' });
      } else {
        console.log('Đã cập nhật dữ liệu trong cơ sở dữ liệu');
        res.json({ message: 'Cập nhật thành công' });
      }
    });
  } else {
    console.error('categoryId không hợp lệ:', req.params.idCategory);
    res.status(400).json({ message: 'categoryId không hợp lệ' });
  }
});






const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destinationPath = path.join(__dirname, '..', 'public', 'image');
    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = file.mimetype.split('/')[1];
    const fileName = file.fieldname + '-' + uniqueSuffix + '.' + fileExtension;
    cb(null, fileName);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type.'));
    }
  }
});

router.post('/product/newproduct', upload.single('productImage'), (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).send('No file uploaded.');
    }

    const { idCategory, productName, authorProduct, description } = req.body;
    const nameImage = file.filename;

    const product = {
      idCategory: idCategory,
      nameProduct: productName,
      authorProduct: authorProduct,
      sortDescription: description,
      images: nameImage,
    };

    db.query('INSERT INTO products SET ?', product, function (err, data) {
      if (err) {
        console.error(err);
        return res.status(500).send('Error inserting product into the database.');
      }

      let sqlProducts = `SELECT * FROM products`;
      let sqlCatalog = `SELECT * FROM catalog`;

      db.query(sqlProducts, function (errProducts, dataProducts) {
        if (errProducts) {
          console.error(errProducts);
          return res.status(500).send('Error retrieving products.');
        }

        db.query(sqlCatalog, function (errCatalog, dataCatalog) {
          if (errCatalog) {
            console.error(errCatalog);
            return res.status(500).send('Error retrieving catalogs.');
          }

          res.render('product', { catalogs: dataCatalog, products: dataProducts });
        });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


router.put('/product/:idProduct', upload.single('upproductImage'), (req, res) => {
  
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).send('No file uploaded.');
    }

    const productId = req.params.idProduct;
    console.log('Received PUT request:', productId);

    const { upidCategory, upproductName, upauthorProduct, updescription } = req.body;
    const nameImage = file.filename;

    db.query('SELECT * FROM products WHERE idProduct = ?', [productId], function (err, existingProduct) {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }

      if (!existingProduct || existingProduct.length === 0) {
        return res.status(404).send('Không tìm thấy sản phẩm.');
      }

      const product = {
        idCategory: upidCategory,
        nameProduct: upproductName,
        authorProduct: upauthorProduct,
        sortDescription: updescription,
        images: nameImage,
      };

      db.query('UPDATE products SET ? WHERE idProduct = ?', [product, productId], function (errUpdate, data) {
        if (errUpdate) {
          console.error(errUpdate);
          return res.status(500).send('Lỗi cập nhật sản phẩm.');
        }

        let sqlProducts = `SELECT * FROM products`;
        let sqlCatalog = `SELECT * FROM catalog`;

        db.query(sqlProducts, function (errProducts, dataProducts) {
          if (errProducts) {
            console.error(errProducts);
            return res.status(500).send('Lỗi truy xuất sản phẩm.');
          }

          db.query(sqlCatalog, function (errCatalog, dataCatalog) {
            if (errCatalog) {
              console.error(errCatalog);
              return res.status(500).send('Lỗi truy xuất danh mục.');
            }

            res.render('product', { catalogs: dataCatalog, products: dataProducts });
          });
        });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.delete('/delete-product/product/:idProduct', (req, res) => {
  const idProduct = req.params.idProduct;

  db.query('DELETE FROM review WHERE idProduct = ?', idProduct, (reviewErr, reviewResult) => {
      if (reviewErr) {
          console.error(reviewErr);
          res.status(500).json({ message: 'Lỗi khi xóa đánh giá của sản phẩm' });
      } else {
          db.query('DELETE FROM products WHERE idProduct = ?', idProduct, (productErr, productResult) => {
              if (productErr) {
                  console.error(productErr);
                  res.status(500).json({ message: 'Lỗi khi xóa sản phẩm' });
              } else {
                res.redirect("/admin/product");
              }
          });
      }
  });
});

 


module.exports = router;