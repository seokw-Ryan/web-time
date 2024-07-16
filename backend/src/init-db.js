const { sequelize } = require('./db');

async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    await sequelize.sync({ force: true });
    console.log('Database tables created successfully.');

    process.exit(0);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

initializeDatabase();