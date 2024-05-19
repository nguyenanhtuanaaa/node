const express = require('express');
const app = express();
const port = 3000;
const multer = require('multer');
const router = express.Router(); 
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", "./views/layout");
// app.set("views", "./views/admin");
var session = require('express-session');
app.use(express.static("public"));
app.use(session({
  secret: 'abcdefg',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));

const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
app.use(checkLoggedIn);
app.use('/', shopRoutes);
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
function checkLoggedIn(req, res, next) {
  res.locals.loggedIn = req.session && req.session.daDangNhap;
  next();
}
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});
app.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.originalUrl}`);
  next();
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
