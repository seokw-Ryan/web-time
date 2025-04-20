// server/db.ts
import { Pool } from 'pg';

const pool = new Pool({
  host: 'db',              // service name from docker-compose
  port: 5432,              // default Postgres port
  user: 'postgres',        // from POSTGRES_USER
  password: 'dbpass',      // from POSTGRES_PASSWORD
  database: 'webtime',     // from POSTGRES_DB
});

export default pool;
