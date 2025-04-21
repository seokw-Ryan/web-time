import { Outlet, NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react'

const Layout = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    if (isMobile) {
      setIsMenuOpen(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Calendar App</h1>
          
          {isMobile ? (
            <button 
              onClick={toggleMenu}
              className="p-2 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          ) : (
            <nav className="flex items-center space-x-4">
              <NavLink to="/" className={({isActive}) => isActive ? "font-bold underline" : ""} end>
                Month
              </NavLink>
              <NavLink to="/week" className={({isActive}) => isActive ? "font-bold underline" : ""}>
                Week
              </NavLink>
              <NavLink to="/day" className={({isActive}) => isActive ? "font-bold underline" : ""}>
                Day
              </NavLink>
              <NavLink to="/settings" className={({isActive}) => isActive ? "font-bold underline" : ""}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98L14.96 2.8a.507.507 0 00-.5-.3h-4c-.24 0-.45.17-.5.39L9.9 5.24c-.61.25-1.17.58-1.69.98l-2.49-1a.5.5 0 00-.61.22l-2 3.46c-.12.22-.07.49.12.64l2.11 1.65c-.04.32-.07.64-.07.98s.03.66.07.98L2.8 14.96c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.07 2.43c.05.22.26.39.5.39h4c.24 0 .45-.17.5-.39l.07-2.43c.61-.25 1.17-.58 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5S10.07 8.5 12 8.5s3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
                </svg>
                <span className="sr-only">Settings</span>
              </NavLink>
            </nav>
          )}
        </div>
      </header>

      {/* Mobile menu */}
      {isMobile && isMenuOpen && (
        <div className="bg-white shadow-md absolute top-16 right-0 z-50 w-48">
          <nav className="flex flex-col p-4">
            <NavLink 
              to="/" 
              className={({isActive}) => 
                `p-2 hover:bg-gray-100 ${isActive ? "font-bold bg-gray-100" : ""}`
              } 
              onClick={closeMenu}
              end
            >
              Month
            </NavLink>
            <NavLink 
              to="/week" 
              className={({isActive}) => 
                `p-2 hover:bg-gray-100 ${isActive ? "font-bold bg-gray-100" : ""}`
              } 
              onClick={closeMenu}
            >
              Week
            </NavLink>
            <NavLink 
              to="/day" 
              className={({isActive}) => 
                `p-2 hover:bg-gray-100 ${isActive ? "font-bold bg-gray-100" : ""}`
              } 
              onClick={closeMenu}
            >
              Day
            </NavLink>
            <NavLink
              to="/settings"
              className={({isActive}) =>
                `p-2 hover:bg-gray-100 ${isActive ? "font-bold bg-gray-100" : ""}`
              }
              onClick={closeMenu}
            >
              Settings
            </NavLink>
          </nav>
        </div>
      )}

      <main className="flex-grow container mx-auto p-4">
        <Outlet />
      </main>

      <footer className="bg-gray-100 p-4 text-center text-sm text-gray-600">
        <p>Minimal Calendar App © {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}

export default Layout 