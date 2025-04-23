import { Outlet, Link, useNavigate } from 'react-router-dom'
import ViewToggle from './ViewToggle'
import { useState, useEffect } from 'react'

const Layout = () => {
  // Theme state for dark mode
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'light' || saved === 'dark') {
      setTheme(saved)
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark')
    }
  }, [])
  // Apply theme class to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])
  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  // Navigation for create button
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Global Header */}
      <header className="flex items-center h-[64px] px-6 bg-white dark:bg-[#202124] shadow-md">
        {/* Hamburger */}
        <button className="p-2 mr-4 rounded hover:bg-[rgba(0,0,0,0.06)] dark:hover:bg-[rgba(255,255,255,0.08)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4285F4]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {/* Brand */}
        <Link to="/" className="flex items-center mr-6 text-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6 2a1 1 0 000 2h8a1 1 0 100-2H6zM3 5a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm2 3a1 1 0 000 2h10a1 1 0 100-2H5z" />
          </svg>
          <span className="ml-2 text-xl font-semibold tracking-[0.15px]">Daiw</span>
        </Link>
        {/* Spacer */}
        <div className="flex-1" />
        {/* Global icons */}
        <div className="flex items-center space-x-2">
          {/* Search */}
          <button className="p-2 rounded hover:bg-[rgba(0,0,0,0.06)] dark:hover:bg-[rgba(255,255,255,0.08)] focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          {/* Help */}
          <button className="p-2 rounded hover:bg-[rgba(0,0,0,0.06)] dark:hover:bg-[rgba(255,255,255,0.08)] focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-foreground" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a3 3 0 00-3 3h2a1 1 0 112 0 1 1 0 11-1 1h-1v2h1a1 1 0 010 2H9a1 1 0 110-2h1v-1a3 3 0 00-3-3z" clipRule="evenodd" />
            </svg>
          </button>
          {/* Settings */}
          <button onClick={toggleTheme} className="p-2 rounded hover:bg-[rgba(0,0,0,0.06)] dark:hover:bg-[rgba(255,255,255,0.08)] focus:outline-none">
            {theme === 'light' ? <span className="text-2xl text-foreground">🌙</span> : <span className="text-2xl text-foreground">☀️</span>}
          </button>
          {/* View Toggle */}
          <ViewToggle />
          {/* User Avatar */}
          <div className="h-8 w-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm">R</div>
        </div>
      </header>
      {/* Content Layout */}
      <div className="flex flex-1">
        {/* Left Panel */}
        <aside className="w-[260px] bg-background border-r border-gray-200 dark:border-gray-700 p-4 flex-shrink-0">
          <button onClick={() => navigate('/event/new')} className="flex items-center h-12 rounded-lg bg-[#1A73E8] hover:bg-[#1669C1] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4285F4] text-white px-6 gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Create</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 ml-2 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.06 0l-4.25-4.25a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          </button>
        </aside>
        {/* Main Content */}
        <main className="flex-1 bg-background text-foreground overflow-auto">
          <Outlet />
        </main>
        {/* Right Rail (icons removed, only avatar remains in header) */}
        <aside className="w-[60px] bg-background border-l border-gray-200 dark:border-gray-700 p-2 flex-shrink-0 flex flex-col items-center min-h-fit">
          {/* toolbar icons have been removed per updated design */}
        </aside>
      </div>
      {/* Footer */}
      <footer className="bg-muted p-4 text-center text-sm text-muted-foreground">
        <p>Minimal Calendar App © {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}

export default Layout 