import React from 'react'

interface Section {
  title: string
  items: string[]
}

const sections: Section[] = [
  {
    title: 'Account & Profile',
    items: [
      'Change your name, email, password, profile picture, and language.',
      'Manage linked accounts (Google, Microsoft, Apple).',
    ],
  },
  {
    title: 'Calendar Defaults',
    items: [
      'Default calendar view (day/week/month/agenda).',
      'First day of the week (Sunday/Monday).',
      'Default event duration (e.g. 30 min, 1 hr).',
    ],
  },
  {
    title: 'Time & Date',
    items: [
      'Time zone (with auto–detect option).',
      'Date format (YYYY‑MM‑DD, MM/DD/YYYY, etc.).',
      'Time format (12‑hour vs. 24‑hour).',
    ],
  },
  {
    title: 'Notifications & Reminders',
    items: [
      'Default reminder lead time (e.g. 10 min before).',
      'Channels (email, push, SMS).',
      'Notification snooze options.',
    ],
  },
  {
    title: 'Appearance',
    items: [
      'Theme (light, dark, auto).',
      'Calendar color scheme and event–color defaults.',
      'Density/compact vs. comfortable view.',
    ],
  },
  {
    title: 'Working Hours & Availability',
    items: [
      'Define your normal working hours for scheduling.',
      '“Do not disturb” periods or focus time.',
    ],
  },
  {
    title: 'Privacy & Sharing',
    items: [
      'Make your calendar public or keep private.',
      'Share specific calendars or events with others.',
      'Default RSVP visibility.',
    ],
  },
  {
    title: 'Integrations & Sync',
    items: [
      'Connect to external calendars (Google, Outlook, CalDAV).',
      'Enable/disable two‑way sync.',
      'API key management for third‑party apps.',
    ],
  },
  {
    title: 'Import & Export',
    items: [
      'Import .ics or CSV files.',
      'Export your calendars.',
    ],
  },
  {
    title: 'Advanced & Developer',
    items: [
      'Manage API tokens or webhooks.',
      'Enable beta features or lab experiments.',
    ],
  },
]

const Settings: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      {sections.map((section) => (
        <section key={section.title} className="mb-6">
          <h3 className="text-xl font-semibold mb-2">{section.title}</h3>
          <ul className="list-disc ml-6 space-y-1">
            {section.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

export default Settings