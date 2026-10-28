const express = require('express');
const app = express();
const sequelize = require('./config/db');
const studentRoutes = require('./routes/studentroutes');
const cors= require("cors");
app.use(cors());
app.use(express.json());

// routes
app.use('/students',studentRoutes);


// create table automatically
sequelize.sync()
  .then(() => console.log(" Tables created"))
  .catch(err => console.log(err));

app.listen(3000, () => {
  console.log(" Server running on port 3000");
});

