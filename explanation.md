# Web Time Calendar App - Codebase Explanation

This document provides an overview of the codebase structure and functionality for the Web Time Calendar application.

## Frontend (React)

### Main Configuration Files

- **package.json**: Defines project dependencies and scripts. Main dependencies include React, React Router, Express, and date/time utilities like date-fns and rrule.
- **vite.config.ts**: Configuration for Vite bundler with React plugin and PWA support.
- **tailwind.config.js**: Tailwind CSS configuration for styling the application.
- **index.html**: Entry HTML file for the application.

### Core Application Files

- **src/main.tsx**: Application entry point that renders the App component within React Router's BrowserRouter.
- **src/App.tsx**: Main component that defines application routes using React Router with lazy-loaded components:
  - Month, Week, and Day views for different calendar perspectives
  - Event detail view for creating/editing events
  - Settings page for user preferences

### Components

- **src/components/Layout.tsx**: Main layout component that provides:
  - Application header with navigation and global controls
  - Theme switching between light and dark modes
  - Sidebar navigation
  - Content area for displaying different views
  - Footer
  
- **src/components/ViewToggle.tsx**: Component for toggling between different calendar views (month, week, day).

### Routes/Views

- **src/routes/MonthView.tsx**: Displays calendar in month format, showing days of the month with events.
- **src/routes/WeekView.tsx**: Displays calendar in week format, showing days of the week with hourly divisions.
- **src/routes/DayView.tsx**: Shows detailed view of a single day with all events and time slots.
- **src/routes/EventDetail.tsx**: Form for creating, viewing, and editing calendar events with properties like title, time, recurrence, etc.
- **src/routes/Settings.tsx**: User settings page for adjusting application preferences.
- **src/routes/NotFound.tsx**: 404 page for handling invalid routes.

## Backend (Express/Node.js)

### Main Files

- **server/index.ts**: Express server setup with routes for events and reminders, configured with CORS and JSON parsing middleware.
- **server/package.json**: Backend dependencies and scripts.

### Database

- **server/models/db.ts**: Database connection setup using PostgreSQL (pg) with connection pool. Includes initialization function that creates the events table if it doesn't exist.

### Models

- **server/models/eventModel.ts**: Data model for calendar events with methods for CRUD operations.
- **server/models/reminderModel.ts**: Data model for event reminders with methods for managing reminder data.

### Controllers

- **server/controllers/eventsController.ts**: Controller for handling event-related API requests with functions like getEvents, createEvent, updateEvent, and deleteEvent.
- **server/controllers/remindersController.ts**: Controller for handling reminder-related API requests.

### Routes

- **server/routes/events.ts**: Defines API endpoints for event operations, mapping them to controller functions.
- **server/routes/reminders.ts**: Defines API endpoints for reminder operations.

## Docker Configuration

- **Dockerfile**: Production Docker configuration for the application.
- **Dockerfile.dev**: Development Docker configuration.
- **docker-compose.yml**: Docker Compose configuration for running the full stack (frontend, backend, database).
- **nginx.conf**: Nginx configuration for serving the application in production.

## Project Structure Summary

The application follows a typical React frontend with Express backend architecture:

1. **Frontend**: React application with React Router for navigation, using Tailwind CSS for styling. Implements different calendar views (month, week, day) and event management.

2. **Backend**: Express server providing API endpoints for event and reminder CRUD operations, connected to a PostgreSQL database.

3. **Database**: PostgreSQL database for storing events and reminders.

4. **Docker**: Configuration for containerization of the entire application stack.

The application is designed as a modern calendar solution offering multiple viewing options and complete event management functionality with a clean, responsive UI that supports both light and dark themes. 