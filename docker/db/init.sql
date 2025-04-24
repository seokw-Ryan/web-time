-- Initialize database schema
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