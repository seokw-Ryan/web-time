import { useEffect, useState, useRef } from 'react'
import {
  startOfWeek,
  addDays,
  startOfDay,
  addHours,
  format,
  isToday,
  isSameDay,
  getHours,
  getMinutes,
} from 'date-fns'
import { useNavigate, useParams } from 'react-router-dom'
import { getEvents } from '@/db/eventStore'
import { CalendarEvent } from '@/lib/types'

const HOUR_HEIGHT = 56 // height of each hour row in pixels
const COL_TEMPLATE = '64px repeat(7,minmax(0,1fr))'

export default function WeekView() {
  const params = useParams()
  const today = new Date(params.date ?? Date.now())
  const weekStart = startOfWeek(today, { weekStartsOn: 0 })
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  const hours = Array.from({ length: 24 }, (_, i) => addHours(startOfDay(today), i))
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const navigate = useNavigate()

  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  // Fetch events
  useEffect(() => {
    async function fetchEvents() {
      setEvents(await getEvents())
    }
    fetchEvents()
  }, [])

  // Auto-scroll grid to current hour
  useEffect(() => {
    const hourEl = document.getElementById(`hour-${new Date().getHours()}`)
    if (hourEl && gridRef.current && headerRef.current) {
      gridRef.current.scrollTop =
        hourEl.offsetTop - headerRef.current.offsetHeight
    }
  }, [])

  return (
    <section className="relative h-full">
      <div className="min-w-[1000px] h-full">
        {/* Header: sticky at top, spans full width */}
        <div
          ref={headerRef}
          className="sticky top-0 z-20 grid border-b bg-surface dark:bg-surface-muted border-border dark:border-border-muted"
          style={{ gridTemplateColumns: COL_TEMPLATE }}
        >
          <div />
          {days.map(d => (
            <div
              key={d.toISOString()}
              className={`py-2 text-center text-sm font-medium ${
                isToday(d) ? 'bg-blue-100 dark:bg-blue-900/30' : ''
              }`}
            >
              {format(d, 'EEE d')}
            </div>
          ))}
        </div>

        {/* Grid: scrollable with sticky left column */}
        <div
          ref={gridRef}
          className="grid grow h-full overflow-auto divide-x"
          style={{ gridTemplateColumns: COL_TEMPLATE }}
        >
          {/* Time labels: sticky on left */}
          <div className="col-span-1 sticky left-0 bg-gray-50 dark:bg-gray-800 border-r z-10">
            {hours.map((h, i) => (
              <div key={i} id={`hour-${i}`} className="h-14 text-xs px-2">
                {format(h, 'h a')}
              </div>
            ))}
          </div>

          {/* Day columns & events */}
          {days.map(d => (
            <div key={d.toISOString()} className="col-span-1 relative border-r">
              {events
                .filter(e => isSameDay(e.start, d))
                .map(e => {
                  const startOffset =
                    (getHours(e.start) + getMinutes(e.start) / 60) * HOUR_HEIGHT
                  const endOffset =
                    (getHours(e.end) + getMinutes(e.end) / 60) * HOUR_HEIGHT
                  const height = endOffset - startOffset
                  return (
                    <div
                      key={e.id}
                      className="absolute left-1 right-1 bg-blue-500 text-white rounded px-1 py-0.5 cursor-pointer"
                      style={{ top: `${startOffset}px`, height: `${height}px` }}
                      onClick={() => navigate(`/event/${e.id}`)}
                    >
                      {e.title}
                    </div>
                  )
                })}
            </div>
          ))}

          {/* Now indicator */}
          <div
            className="absolute left-0 right-0 h-px bg-red-500"
            style={{
              top: `${(getHours(new Date()) +
                getMinutes(new Date()) / 60) * HOUR_HEIGHT}px`,
            }}
          />
        </div>
      </div>
    </section>
  )
}