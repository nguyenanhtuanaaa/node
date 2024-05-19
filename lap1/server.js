const express = require('express')
const app = express()
const port = 3000
app.use(express.urlencoded({ extended: true }));
// var bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded());
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/product', (req, res) => {
  res.send('Đây là trang sản phẩm!')
})
app.get('/add-product', (req, res) => {
  res.send('<form action="/product" method="post"><input type="text" name="productName"><button type="submit">Add product</button></form>')
  
})
app.post('/product', (req, res) => {
    const productName = req.body.productName;
    if (productName) {
        res.send(`Bạn vừa thêm sản phẩm: ${productName}`);
      } else {
        res.send('Không thể đọc tên sản phẩm. Hãy đảm bảo rằng bạn đã nhập tên sản phẩm.');
      }
  });

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})
// 
const inventors = [
    { id:1, first: 'Albert', last: 'Einstein', year: 1879, passed: 1955 },
    { id:2, first: 'Isaac', last: 'Newton', year: 1643, passed: 1727 },
    { id:3, first: 'Galileo', last: 'Galilei', year: 1564, passed: 1642 },
    { id:4, first: 'Marie', last: 'Curie', year: 1867, passed: 1934 },
    { id:5, first: 'Johannes', last: 'Kepler', year: 1571, passed: 1630 },
    { id:6, first: 'Nicolaus', last: 'Copernicus', year: 1473, passed: 1543 }
    ];
    app.get('/inventors', (req, res) => {
        let list='<h2>Danh sách nhà khoa học<ul>';
        inventors.forEach(e => {
        list+=`<li><a style="text-decoration:none;color:green;" href="/inventor/${e.id}">${e.last}</a></li>`;
        });
        list+='</ul></h2>';
        res.send(list);
       });
    
       app.get('/inventor/:id', (req, res) => {
        let id=req.params.id;
        inventor=inventors.find(e=>e.id==id);
        info=`<h2>Thông tin chi tiết nhà khoa học:Full name: ${inventor.first} ${inventor.last}, Year: ${inventor.year},
       Passed: ${inventor.passed}</h2>`;
        res.send(info);
       });
       app.get('/add-inventor', (req, res) => {
        res.send('<h1>Thêm Nhà Khoa Học</h1><form action="/inventor" method="POST"><input type="text"name="first" placeholder="input first name"><input type="text" name="last" placeholder="input last name"><br><input type="number" name="year" placeholder="Year"><input type="number" name="passed"placeholder="passed"><br><button type="submit">Add Product</button></form>');
       });
       app.post('/inventor', (req, res) => {
        let newInventor=req.body;
        newInventor.id=inventors.length+1;
        inventors.push(newInventor);
        res.redirect('/inventors');
       });
       