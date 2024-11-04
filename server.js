const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
require('dotenv').config();

const app = express();

// Middleware для обработки JSON
app.use(express.json());

// Подключение к базе данных
connectDB();

// Обслуживание статических файлов
app.use(express.static(path.join(__dirname, 'public')));

// Маршруты
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Главный маршрут
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
