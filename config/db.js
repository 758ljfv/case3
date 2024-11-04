const mongoose = require('mongoose');
require('dotenv').config();

const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/taskmanager';

const connectDB = async () => {
    try {
        await mongoose.connect(DB_URL);
        console.log('Подключился к MongoDB');
    } catch (error) {
        console.error('Ошибка подключения:', error);
        process.exit(1); // Завершение процесса, если подключение не удалось
    }
};

module.exports = connectDB;
