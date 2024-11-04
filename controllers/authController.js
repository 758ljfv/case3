const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


const register = async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send({ error: 'Пользователь уже существует' });
        }

        const user = new User({ username, password });
        await user.save();

        res.status(201).send({ message: 'Пользователь успешно зарегистрирован' });
    } catch (error) {
        res.status(500).send({ error: 'Не удалось зарегистрировать пользователя' });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).send({ error: 'Недействительные учетные данные' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send({ error: 'Недействительные учетные данные' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1h' });
        res.send({ token });
    } catch (error) {
        res.status(500).send({ error: 'Не удалось войти' });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).send({ error: 'Пользователь не найден' });
        }
        res.send(user);
    } catch (error) {
        res.status(500).send({ error: 'Не удалось получить информацию о пользователе' });
    }
};

module.exports = {
    register,
    login,
    getCurrentUser,
};
