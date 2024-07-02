const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const sequelize = require('./db');
const Event = require('./models/Event');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api', routes);

sequelize.sync({ force: false })
  .then(() => {
    console.log('Database synchronized');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = app; // Export for testing