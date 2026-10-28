const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('nodestudent', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

sequelize.authenticate()
  .then(() => console.log(' Connected to MySQL'))
  .catch(err => console.log('Error:', err));

module.exports = sequelize;