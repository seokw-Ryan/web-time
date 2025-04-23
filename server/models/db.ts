// server/db.ts
import { Pool } from 'pg';

const pool = new Pool({
  host: 'db',              // service name from docker-compose
  port: 5432,              // default Postgres port
  user: 'postgres',        // from POSTGRES_USER
  password: 'dbpass',      // from POSTGRES_PASSWORD
  database: 'webtime',     // from POSTGRES_DB
});

// Initialize the database schema if needed
const initDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id UUID PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        isAllDay BOOLEAN DEFAULT FALSE,
        start TIMESTAMP NOT NULL,
        "end" TIMESTAMP NOT NULL,
        location TEXT,
        color TEXT,
        recurrenceRule TEXT
      );
    `);
    console.log('Database schema initialized successfully');
  } catch (error) {
    console.error('Error initializing database schema:', error);
  }
};

// Run initialization
initDatabase();

export default pool;
