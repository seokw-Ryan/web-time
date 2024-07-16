const express = require("express");
const path = require("path");
const cors = require("cors");
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Initialize the express app
const app = express();

app.use(cors({
  origin: 'http://localhost:3000'
}));

// Define a port
const PORT = process.env.PORT || 5000;

app.use(express.static("public"));

app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use('/api/users', userRoutes);

app.use('/api/task', taskRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
