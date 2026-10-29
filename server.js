
const express = require('express');
const cors = require('cors');

const sequelize = require('./config/db');
const studentRoutes = require('./routes/studentroutes');
const { getCache } = require('./cache');

const app = express();

app.use(cors());
app.use(express.json());

// Existing student routes
app.use('/students', studentRoutes);

// Check whether decrypted student data is cached
app.get('/cache/status', (req, res) => {
const data = getCache('decryptedStudents');

if (data === null) {
    return res.json({
        cached: false,
        message: 'No decrypted student data in cache'
    });
}

res.json({
    cached: true,
    message: 'Decrypted student data retrieved from cache',
    data
});

});

// Create database tables automatically
sequelize.sync()
.then(() => {
console.log('Tables created');

    app.listen(3000, () => {
        console.log('Server running on port 3000');
    });
})
.catch(err => {
    console.error('Database error:', err);
});

