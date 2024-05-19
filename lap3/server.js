const mysql = require('mysql2');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const multer = require('multer');
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded());
app.set("view engine", "ejs");
app.set("views", "./views/layout");
app.use(express.static("public"));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'demonode'
});

db.connect((err) => {
  if (err) {
    console.error('Lỗi kết nối đến cơ sở dữ liệu: ' + err.message);
    return;
  }
  console.log('Kết nối đến cơ sở dữ liệu thành công');
});

app.get("/", (req, res) => {
  let sqlProducts = `SELECT * FROM products`;
  let sqlCatalog = `SELECT * FROM catalog`;

  db.query(sqlProducts, function (errProducts, dataProducts) {
    if (errProducts) throw errProducts;

    db.query(sqlCatalog, function (errCatalog, dataCatalog) {
      if (errCatalog) throw errCatalog;

      res.render('shop', { catalogs: dataCatalog, products: dataProducts });
    });
  });
});

app.get("/addnew",(req,res)=>{
  let sqlCatalog = `SELECT * FROM catalog`;
  db.query(sqlCatalog, function (errCatalog, dataCatalog) {
    if (errCatalog) throw errCatalog;
  res.render('add-product', { catalogs:dataCatalog });
  })
})

app.get("/shop/:cateId",(req,res)=>{
  let cateId = req.params.cateId; 
  let sqlProducts = `SELECT * FROM products where idCategory=${cateId}`;
  let sqlCatalog = `SELECT * FROM catalog`;

  db.query(sqlProducts, function (errProducts, dataProducts) {
    if (errProducts) throw errProducts;

    db.query(sqlCatalog, function (errCatalog, dataCatalog) {
      if (errCatalog) throw errCatalog;

      res.render('shop', { catalogs: dataCatalog, products: dataProducts });
    });
  });
})

 const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destinationPath = path.join(__dirname, 'public', 'image');
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
app.get("/addnew",(req,res)=>{
  res.render("add-product");
 })
 app.post('/addnew', upload.single('productImage'),(req, res) => {
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
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
