const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
