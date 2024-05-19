const express = require('express');
// const bookController = require('../controllers/book');
const router = express.Router();
const multer = require('multer');
const db=require('../controllers/database');
const path = require('path'); 
const fs = require('fs');

router.get('/', (req, res) => {
    let sqlcategory = `SELECT * FROM category`;
    db.query(sqlcategory, function (errcategory, datacategory) {
        if (errcategory) {
            console.error(errcategory);
            throw errcategory;
        }
        console.log(datacategory); 
        res.render('homeadmin', { category: datacategory });
    });
    });
router.delete('/delete-category/:categoryId', (req, res) => {
        const categoryId = req.params.categoryId;
        db.query('DELETE FROM category WHERE idCategory = ?',categoryId, (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ message: 'Lỗi khi xóa category' });
            } else {
                res.status(200).json({ message: 'Xóa category thành công' });
            }
        });
    });
 router.post('/addnew', (req, res) => {
            let nameCategory = req.body.categoryName;
            const newCategory = {
                nameCategory: nameCategory
            };
        
            db.query('INSERT INTO category SET ?', newCategory, (err, result) => {
                if (err) {
                    console.error('Lỗi khi thêm vào cơ sở dữ liệu:', err);
                    res.status(500).send('Lỗi khi thêm vào cơ sở dữ liệu');
                } else {
                    console.log('Đã thêm mới vào cơ sở dữ liệu');
                    res.redirect('/'); 
                }
            });
            
        });
 router.post('/addneww/:categoryId', (req, res) => {
            const categoryId = parseInt(req.params.categoryId, 10);
        
            if (!isNaN(categoryId) && categoryId > 0) {
                const newNameCategory = req.body.categoryName;
        
                db.query('UPDATE category SET nameCategory = ? WHERE idCategory = ?', [newNameCategory, categoryId], (err, result) => {
                    if (err) {
                        console.error('Lỗi khi cập nhật cơ sở dữ liệu:', err);
                        res.status(500).send('Lỗi khi cập nhật cơ sở dữ liệu');
                    } else {
                        console.log('Đã cập nhật dữ liệu trong cơ sở dữ liệu');
                        res.redirect('/');
                    }
                });
            } else {
                console.error('categoryId không hợp lệ:', req.params.categoryId);
                res.status(400).send('categoryId không hợp lệ');
            }
        });
        
        
        
        
        
module.exports = router;
