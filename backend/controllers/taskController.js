const { Task, User } = require('../src/db');

// Create a new task for a user
exports.createTaskForUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.userId);
        if (user) {
            const task = await Task.create({ ...req.body, userId: req.params.userId });
            res.status(200).json(task);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get tasks for a user
exports.getTasksForUser = async (req, res) => {
    const tasks = await Task.findAll({ where: { userId: req.params.userId } });
    res.json(tasks);
};
