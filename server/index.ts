// import express, { Request, Response } from 'express';
// import pool from './models/db';

// const app = express();
// const port = 3000;

// app.use(express.json());

// // Basic route to confirm server is running
// app.get('/', (req: Request, res: Response) => {
//   res.send('Hello from TypeScript + Express!');
// });

// // Test database connection
// app.get('/db-test', async (req: Request, res: Response) => {
//   try {
//     const result = await pool.query('SELECT NOW()');
//     res.send(`DB connected! Time: ${result.rows[0].now}`);
//   } catch (err) {
//     console.error('Database error:', err);
//     res.status(500).send('Failed to connect to the database');
//   }
// });

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });
import express from 'express';
import cors from 'cors';

import eventsRouter from './routes/events';
import remindersRouter from './routes/reminders';

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Mount routes
app.use('/events', eventsRouter);
app.use('/reminders', remindersRouter);

// Root route (optional)
app.get('/', (req, res) => {
  res.send('Hello from Express + TypeScript!');
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
