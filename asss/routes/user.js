const express = require('express');
const productsController = require('../controllers/products');
const router = express.Router();
const multer = require('multer');
const db=require('../model/database');
const path = require('path'); 
const fs = require('fs');
const bcrypt = require("bcrypt");




//đăng kí user
router.post('/adduser', (req, res) => {
  let name = req.body.name;
  let password = req.body.password;
          
    var salt = bcrypt.genSaltSync(10);
    var pass_mahoa = bcrypt.hashSync(password, salt);
    let user ={
      username: name, 
      password:pass_mahoa
    }; 
  db.query('INSERT INTO user SET ?', user, function(err, data) {
    let sqlProducts = `SELECT * FROM products`;
    let sqlCatalog = `SELECT * FROM catalog`;
  console.log(data);
    db.query(sqlProducts, function (errProducts, dataProducts) {
      if (errProducts) throw errProducts;
  
      db.query(sqlCatalog, function (errCatalog, dataCatalog) {
        if (errCatalog) throw errCatalog;
  
        res.render('login', { catalogs: dataCatalog, products: dataProducts });
      });
    });
});
});

// kiểm tra đăng nhập
router.post('/user', (req, res) => {
  const name = req.body.name;
  const password = req.body.password;

  const sqlQuery = 'SELECT * FROM user WHERE username = ?';
  db.query(sqlQuery, [name], function(err, result) {
    if (err) {
      console.error(err);
      throw err;
    }

    if (result.length > 0) {
      const user = result[0];
      const pass_fromdb = user.password;

      const bcrypt = require("bcrypt");
      const passwordMatch = bcrypt.compareSync(password, pass_fromdb);

      if (passwordMatch) {
        res.locals.loggedIn = true;
            res.locals.userID = user.userID; 
        let sqlProducts = `SELECT * FROM products`;
        let sqlCatalog = `SELECT * FROM catalog`;

        db.query(sqlProducts, function (errProducts, dataProducts) {
          if (errProducts) {
            console.error(errProducts);
            throw errProducts;
          }

          db.query(sqlCatalog, function (errCatalog, dataCatalog) {
            if (errCatalog) {
              console.error(errCatalog);
              throw errCatalog;
            }
            
            res.render('shop', { catalogs: dataCatalog, products: dataProducts });
          });
        });
      } else {
        let errorMessage = 'Tên đăng nhập hoặc mật khẩu không đúng.';
        let sqlCatalog = `SELECT * FROM catalog`;

        db.query(sqlCatalog, function (errCatalog, dataCatalog) {
          if (errCatalog) {
            console.error(errCatalog);
            throw errCatalog;
          }
          res.locals.loggedIn = false;

          res.render('login', { catalogs: dataCatalog, errorMessage: errorMessage });
        });
      }
    } else {
      let errorMessage = 'Tài khoản không tồn tại.';
      let sqlCatalog = `SELECT * FROM catalog`;

      db.query(sqlCatalog, function (errCatalog, dataCatalog) {
        if (errCatalog) {
          console.error(errCatalog);
          throw errCatalog;
        }
        res.locals.loggedIn = false;

        res.render('login', { catalogs: dataCatalog, errorMessage: errorMessage });
      });
    }
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    } else {
      res.redirect('/');
    }
  });
});

  router.get('/resgiter', (req, res) => {
  let sqlCatalog = `SELECT * FROM catalog`;
  db.query(sqlCatalog, function (errCatalog, dataCatalog) {
    if (errCatalog) throw errCatalog;
  res.render('resgiter', { catalogs:dataCatalog ,loggedIn: res.locals.loggedIn});
  })

});
  router.get('/login', (req, res) => {
  let sqlCatalog = `SELECT * FROM catalog`;
  db.query(sqlCatalog, function (errCatalog, dataCatalog) {
    if (errCatalog) throw errCatalog;
    res.render('login', { catalogs:dataCatalog,loggedIn: res.locals.loggedIn });
  })

});
module.exports = router;
