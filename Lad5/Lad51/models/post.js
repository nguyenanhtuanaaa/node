const Sequelize = require('sequelize');
const sequelize = require ('../models/database');

const Post = sequelize.define('tblPost',{
    postId :{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true    
    },
    title: Sequelize.STRING,
    Content:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    create_date:{
        type: Sequelize.DATE,
        allowNull: false,
    }
},
 {timestamps: false}
);

module.exports = Post;