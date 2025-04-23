// server/models/eventModel.ts
import pool from './db';

export const getAllEvents = async () => {
  const res = await pool.query('SELECT * FROM events ORDER BY start ASC');
  return res.rows;
};

export const getEventById = async (id: string) => {
  const res = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
  return res.rows[0];
};

export const createEvent = async (event: any) => {
  const {
    id,
    title,
    description,
    isAllDay,
    start,
    end,
    location,
    color,
    recurrenceRule,
  } = event;

  await pool.query(
    `INSERT INTO events 
      (id, title, description, isAllDay, start, end, location, color, recurrenceRule) 
     VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [id, title, description, isAllDay, start, end, location, color, recurrenceRule]
  );
};

export const updateEvent = async (id: string, eventData: Partial<any>) => {
  const fields = Object.keys(eventData);
  const values = Object.values(eventData);

  const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
  const query = `UPDATE events SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`;

  const res = await pool.query(query, [...values, id]);
  return res.rows[0];
};

export const deleteEvent = async (id: string) => {
  await pool.query('DELETE FROM events WHERE id = $1', [id]);
};
