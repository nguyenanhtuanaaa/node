const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('blogBD', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
  });

module.exports = sequelize;