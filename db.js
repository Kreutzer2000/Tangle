// En archivo db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/tangle');
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        // Salir del proceso con fallo
        process.exit(1);
    }
};

module.exports = connectDB;
