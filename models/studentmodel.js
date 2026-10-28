const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Student = sequelize.define('student', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING
  },
  age: {
    type: DataTypes.INTEGER
  },
  course: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'student',
  timestamps: false
});

module.exports = Student;