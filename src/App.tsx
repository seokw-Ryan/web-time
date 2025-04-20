import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'

// Layout
const Layout = lazy(() => import('./components/Layout'))

// Routes
const MonthView = lazy(() => import('./routes/MonthView'))
const WeekView = lazy(() => import('./routes/WeekView'))
const DayView = lazy(() => import('./routes/DayView'))
const EventDetail = lazy(() => import('./routes/EventDetail'))
const NotFound = lazy(() => import('./routes/NotFound'))

function App() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MonthView />} />
          <Route path="week" element={<WeekView />} />
          <Route path="day/:date?" element={<DayView />} />
          <Route path="event/:id" element={<EventDetail />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
