const express=require('express');
var bodyParser = require('body-parser');
var app=express();
const port=3000;
var multer = require('multer');
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded());
app.set("view engine", "ejs");
app.set("views", "./views/layout");
app.use(express.static("public"));
app.get("/",(req,res)=>{
 var today=new Date();
 currentDay=today.getDay();
 var day='';
 switch(currentDay){
 case 0:
 day='Chủ nhật';
 break;
 case 1:
 day = 'Thứ hai';
 break;
 case 2:
 day = 'Thứ ba';
 break;
 case 3:
 day = 'Thứ tư';
 break;
 case 4:
 day = 'Thứ năm';
 break;
 case 5:
 day = 'Thứ sáu';
 break;
 case 6:
 day = 'Thứ bảy';
 break;
 default:
 console.log(`Error: ${currentDay}`);
 }
 res.render('home',{kindOfDay:day});
})
// 
var listProduct=[
  {
  id:0101,
  title:'Apple Book',
  price:3000,
  description:"A very interesting book about so many even more interesting things!",
  imageURL:"productImage-1699809890009-743698166.png",
  },
  {id:0102,
    title:'Microsoft Book',
    price:2000,
    description:"A very interesting book about so many even more interesting things!",
    imageURL:"productImage-1699809890009-743698166.png",
    },
    {
    id:0103,
    title:'VFast Book',
    price:1000,
    description:"A very interesting book about so many even more interesting things!",
    imageURL:"productImage-1699809890009-743698166.png",
    }
   ];
   app.get("/shop",(req,res)=>{
    res.render('shop',{listProduct:listProduct});
   })   
// 
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

const listsProduct = [];

app.get("/addnew", (req, res) => {
  res.render("add-product");
});

app.post('/addnew', upload.single('productImage'), (req, res) => {
  const file = req.file
  let title = req.body.productName;
  let price = req.body.price;
  let description = req.body.description;
  let nameImage = file.filename;

  // Thêm vào mảng json 1 cuối sách mới
  listProduct.push({
    id: 0110,
    title: title,
    price: price,
    description: description,
    imageURL: nameImage,
  });

  res.redirect('/shop');
});

app.get("/shop", (req, res) => {
  res.render('shop', { listsProduct: listProduct });
});
// 
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})