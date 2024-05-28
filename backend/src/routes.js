const express = require('express');
const pool = require('./db');
const router = express.Router();

// Example route
router.get('/tasks', async (req, res) => {
    try {
        const allTasks = await pool.query('SELECT * FROM tasks');
        res.json(allTasks.rows);
    } catch (err) {
        console.error(err.message);
    }
});

module.exports = router;
