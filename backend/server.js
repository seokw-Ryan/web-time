// // Import express
// const express = require("express");
// const path = require("path");
// const userRoutes = require('./routes/userRoutes');
// const taskRoutes = require('./routes/taskRoutes');

// // Initialize the express app
// const app = express();

// // Define a port
// const PORT = process.env.PORT || 5000;

// // Serve static files (like CSS, JS, images) from a 'public' directory
// app.use(express.static("public"));

// // Optional: Body parser middleware to handle JSON data
// app.use(express.json());

// // Route for the home page
// app.get("/", (req, res) => {
//   // Serve the main HTML file (make sure it's designed responsively)
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

// // Use the user routes
// app.use('/api/users', userRoutes);

// app.use('/api/task', taskRoutes)

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
// Import express
const express = require("express");
const path = require("path");
const cors = require("cors");
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Initialize the express app
const app = express();

// Use CORS middleware to allow only localhost:3000
app.use(cors({
  origin: 'http://localhost:3000'
}));

// Define a port
const PORT = process.env.PORT || 5000;

// Serve static files (like CSS, JS, images) from a 'public' directory
app.use(express.static("public"));

// Optional: Body parser middleware to handle JSON data
app.use(express.json());

// Route for the home page
app.get("/", (req, res) => {
  // Serve the main HTML file (make sure it's designed responsively)
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Use the user routes
app.use('/api/users', userRoutes);

// Use the task routes
app.use('/api/task', taskRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
