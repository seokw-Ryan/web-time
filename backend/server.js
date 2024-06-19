// // Import express
// const express = require("express");
// const path = require("path");

// // Initialize the express app
// const app = express();

// // Define a port
// const PORT = process.env.PORT || 3000;

// // Serve static files (like CSS, JS, images) from a 'public' directory
// app.use(express.static("public"));

// // Optional: Body parser middleware to handle JSON data
// app.use(express.json());

// // Route for the home page
// app.get("/", (req, res) => {
//   // Serve the main HTML file (make sure it's designed responsively)
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

// // Additional routes can be added here
// // Example: app.get('/api/events', (req, res) => { /* handle request */ });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const { sequelize } = require('./models/db');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use('/api', routes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');
    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }
    console.log(`Server is running on http://localhost:${port}`);
});
