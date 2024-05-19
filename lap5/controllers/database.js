const mysql = require('mysql2');
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'lab5'
});

db.connect((err) => {
  if (err) {
    console.error('Lỗi kết nối đến cơ sở dữ liệu: ' + err.message);
    return;
  }
  console.log('Kết nối đến cơ sở dữ liệu thành công');
});
module.exports = db;
