const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).send({ error: 'Токен отсутствует, пожалуйста, пройдите аутентификацию' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
        req.userId = decoded.userId; // Декодируем userId и передаем дальше
        next();
    } catch (error) {
        res.status(401).send({ error: 'Недействительный токен, пожалуйста, пройдите аутентификацию' });
    }
};

module.exports = authMiddleware;
