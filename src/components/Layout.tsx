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
            <nav className="flex space-x-4">
              <NavLink to="/" className={({isActive}) => isActive ? "font-bold underline" : ""} end>
                Month
              </NavLink>
              <NavLink to="/week" className={({isActive}) => isActive ? "font-bold underline" : ""}>
                Week
              </NavLink>
              <NavLink to="/day" className={({isActive}) => isActive ? "font-bold underline" : ""}>
                Day
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