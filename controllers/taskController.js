const Task = require('../models/Task');

const addTask = async (req, res) => {
    const task = new Task({
        ...req.body,
        userId: req.userId // Привязываем задачу к авторизованному пользователю
    });

    try {
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
};

const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.userId }); // Только задачи авторизованного пользователя
        res.send(tasks);
    } catch (error) {
        res.status(500).send({ error: 'Не удалось получить задачи' });
    }
};

const updateTask = async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId }, // Только задачи текущего пользователя
            req.body,
            { new: true }
        );
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (error) {
        res.status(400).send(error);
    }
};

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!task) {
            return res.status(404).send();
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).send(error);
    }
};

module.exports = {
    addTask,
    getTasks,
    updateTask,
    deleteTask,
};
