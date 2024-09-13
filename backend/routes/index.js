const express = require('express');
const userRoutes = require('./userRoutes');
const taskRoutes = require('./taskRoutes');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/', taskRoutes); 

module.exports = router;
