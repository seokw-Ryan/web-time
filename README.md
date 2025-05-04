# Web Time Management Application

A modern, lightweight calendar PWA for efficient time management across all major platforms with a single unified TypeScript codebase.

![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🚀 Features

- **Multiple Calendar Views**
  - Month view with event previews
  - Week view with time slots
  - Day view for detailed scheduling

- **Comprehensive Event Management**
  - Create, read, update, and delete events
  - Support for all-day events
  - Recurring events (daily, weekly, monthly, yearly)
  - Event notifications and reminders

- **User Experience**
  - Dark/Light mode with system preference detection
  - Responsive design for all screen sizes
  - Offline support via local storage
  - PWA installable on all platforms

- **Data Handling**
  - iCalendar (ICS) import/export
  - Cross-device synchronization

## 🛠️ Technology Stack

### Frontend
- TypeScript with React
- TailwindCSS for styling
- React Router for navigation
- date-fns for date management
- rrule.js for recurring events
- IndexedDB via localForage

### Backend
- Express.js (Node.js)
- PostgreSQL database
- RESTful API architecture

### DevOps
- Docker and Docker Compose
- Vite build system

## 🚦 Getting Started

### Prerequisites
- Node.js (v16+)
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/web-time.git
cd web-time

# Install dependencies
npm install

# Start development server
npm run dev
```

Access the app at http://localhost:5173

### Building for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

### Docker Deployment

```bash
# Production deployment
docker-compose up web

# Development with hot reload
docker-compose up dev
```

## 📱 Cross-Platform Installation

### As a PWA
1. Open the application in a compatible browser
2. Click "Install" or use the browser's "Add to Home Screen" option

### Desktop Options
Package using Tauri for smaller, native binaries:

```bash
npm run tauri:build
```

### Mobile Options
Use Capacitor for native mobile builds:

```bash
npm run cap:build
npm run cap:sync
```

## 📂 Project Structure

```
web-time/
├── src/                # Frontend source code
│   ├── components/     # Reusable UI components
│   ├── routes/         # View components (month, week, day)
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions
│   ├── db/             # Database operations
│   └── styles/         # CSS and Tailwind config
├── server/             # Backend Express application
│   ├── controllers/    # Request handlers
│   ├── models/         # Data models
│   └── routes/         # API endpoints
├── public/             # Static assets
└── docker/             # Docker configuration files
```

## 🔐 Security Considerations

- API validation and sanitization
- CORS configuration for controlled access
- Environment-based configurations

## 🔄 Development Workflow

- Hot module replacement with Vite
- TypeScript type checking for improved code quality
- ESLint integration

## 🌟 Future Roadmap

- [ ] Enhanced collaboration with multi-user calendar sharing
- [ ] Advanced time analytics dashboard
- [ ] Third-party integrations (Google Calendar, Outlook)
- [ ] AI-powered scheduling suggestions
- [ ] Enhanced mobile-specific features

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

Project Link: [https://github.com/yourusername/web-time](https://github.com/yourusername/web-time)
