const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Для связи с пользователем
    completed: { type: Boolean, default: false } // Статус выполнения задачи
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
