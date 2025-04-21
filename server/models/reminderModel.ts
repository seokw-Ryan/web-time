// server/models/reminderModel.ts
import pool from './db';

export const getAllReminders = async () => {
  const res = await pool.query('SELECT * FROM reminders ORDER BY time ASC');
  return res.rows;
};

export const getRemindersByEventId = async (eventId: string) => {
  const res = await pool.query('SELECT * FROM reminders WHERE eventId = $1 ORDER BY time ASC', [eventId]);
  return res.rows;
};

export const createReminder = async (reminder: any) => {
  const { id, eventId, time, type, message } = reminder;
  await pool.query(
    'INSERT INTO reminders (id, eventId, time, type, message) VALUES ($1, $2, $3, $4, $5)',
    [id, eventId, time, type, message]
  );
};

export const deleteReminder = async (id: string) => {
  await pool.query('DELETE FROM reminders WHERE id = $1', [id]);
};