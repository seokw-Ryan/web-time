import { Outlet, Link, useNavigate } from 'react-router-dom'
import ViewToggle from './ViewToggle'
import { useState, useEffect } from 'react'

const Layout = () => {
  // Theme state for dark mode
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  // State for sidebar drawer
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
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
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Global Header */}
      <header className="flex items-center h-[64px] px-6 bg-white dark:bg-[#202124] shadow-md">
        {/* Hamburger - now the first item in header */}
        <button 
          onClick={() => setSidebarOpen(true)}
          className="p-2 mr-4 rounded hover:bg-[rgba(0,0,0,0.06)] dark:hover:bg-[rgba(255,255,255,0.08)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4285F4]"
        >
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
          {/* Settings */}
          <button onClick={toggleTheme} className="p-2 rounded hover:bg-[rgba(0,0,0,0.06)] dark:hover:bg-[rgba(255,255,255,0.08)] focus:outline-none">
            {theme === 'light' ? <span className="text-2xl text-foreground">🌙</span> : <span className="text-2xl text-foreground">☀️</span>}
          </button>
          {/* View Toggle */}
          <ViewToggle />
          {/* Create button relocated from sidebar */}
          <button
            onClick={() => navigate('/event/new')}
            className="flex items-center h-12 rounded-lg bg-[#1A73E8] hover:bg-[#1669C1] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4285F4] text-white px-6 gap-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Create</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 ml-2 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.06 0l-4.25-4.25a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          </button>
          {/* User Avatar */}
          <div className="h-8 w-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm">R</div>
        </div>
      </header>
      {/* Content Layout - Now a single column grid */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-background text-foreground flex items-center justify-center">
          {/* Center the calendar content */}
          <div className="flex items-center justify-center flex-col">
            <Outlet />
          </div>
        </main>
        {/* Right Rail (icons removed, only avatar remains in header) */}
        <aside className="w-[60px] bg-background border-l border-gray-200 dark:border-gray-700 p-2 flex-shrink-0 flex flex-col items-center min-h-fit">
          {/* toolbar icons have been removed per updated design */}
        </aside>
      </div>
      
      {/* Sidebar Drawer (Overlay) */}
      {sidebarOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Drawer */}
          <div className="fixed left-0 top-0 h-full w-full max-w-xs bg-background z-50 shadow-xl border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded hover:bg-[rgba(0,0,0,0.06)] dark:hover:bg-[rgba(255,255,255,0.08)] focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Sidebar navigation items */}
            <nav className="space-y-1">
              <Link 
                to="/" 
                className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-foreground"
                onClick={() => setSidebarOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Calendar
              </Link>
              <Link 
                to="/tasks" 
                className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-foreground"
                onClick={() => setSidebarOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Tasks
              </Link>
              <Link 
                to="/settings" 
                className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-foreground"
                onClick={() => setSidebarOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </Link>
            </nav>
          </div>
        </>
      )}
      
      {/* Footer */}
      <footer className="bg-muted p-4 text-center text-sm text-muted-foreground">
        <p>Minimal Calendar App © {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}

export default Layout 