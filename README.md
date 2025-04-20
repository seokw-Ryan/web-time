# Minimal Calendar App

A lightweight, installable calendar PWA that runs on Windows, macOS, Android, and iOS, with one unified TypeScript codebase and minimal binary sizes.

## Features

- **Multiple Views**: Month, week, and day views with fast rendering
- **Event Management**: Create, read, update, and delete events with support for all-day and recurring events
- **Offline Support**: Works offline with local storage
- **Notifications**: Local reminders for upcoming events
- **ICS Import/Export**: Import and export calendar events in iCalendar format
- **PWA**: Installable on all major platforms

## Technology Stack

- **Language**: TypeScript
- **UI Framework**: React with Vite
- **Storage**: IndexedDB via localForage
- **Date Utilities**: date-fns
- **Recurrence Rules**: rrule.js
- **ICS Handling**: ics npm package
- **Styling**: TailwindCSS

## Getting Started

### Prerequisites

- Node.js (v16 or newer)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/calendar-app.git
cd calendar-app

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at http://localhost:5173

### Building for Production

```bash
# Build for web
npm run build

# Serve the built app
npm run preview
```

### Docker Support

```bash
# Production build
docker-compose up web

# Development with hot-reload
docker-compose up dev
```

## Deployment

### Web Deployment

The built application can be deployed to any static hosting service like Netlify, Vercel, or GitHub Pages.

### Desktop Apps

For desktop applications, you can use Tauri to package the application:

```bash
# Install Tauri CLI
npm install -g @tauri-apps/cli

# Build with Tauri
tauri build
```

### Mobile Apps

For mobile applications, you can use Capacitor:

```bash
# Install Capacitor
npm install -g @capacitor/cli

# Initialize Capacitor
npx cap init

# Add platforms
npx cap add android
npx cap add ios

# Build web assets
npm run build

# Sync assets to native projects
npx cap sync
```

## Project Structure

```
calendar-app/
├── public/            # Static assets, manifest, etc.
├── src/
│   ├── components/    # Reusable UI components
│   ├── routes/        # Page components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions
│   ├── db/            # Database operations
│   └── styles/        # CSS and Tailwind
├── Dockerfile         # Production Docker config
├── Dockerfile.dev     # Development Docker config
└── docker-compose.yml # Docker Compose config
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
