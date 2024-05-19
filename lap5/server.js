const express = require('express');
const app = express();
const port = 3000;
const multer = require('multer');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", "./views/layout");
app.use(express.static("public"));

const homeRoutes = require('./routes/home');

app.use('/', homeRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
