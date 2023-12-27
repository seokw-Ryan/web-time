// Import express
const express = require("express");
const path = require("path");

// Initialize the express app
const app = express();

// Define a port
const PORT = process.env.PORT || 3000;

// Serve static files (like CSS, JS, images) from a 'public' directory
app.use(express.static("public"));

// Optional: Body parser middleware to handle JSON data
app.use(express.json());

// Route for the home page
app.get("/", (req, res) => {
  // Serve the main HTML file (make sure it's designed responsively)
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Additional routes can be added here
// Example: app.get('/api/events', (req, res) => { /* handle request */ });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
