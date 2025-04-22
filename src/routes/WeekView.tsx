import { useEffect, useState } from 'react'
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
import { useNavigate } from 'react-router-dom'
import { getEvents } from '@/db/eventStore'
import { CalendarEvent } from '@/lib/types'

const HOUR_HEIGHT = 56 // height of each hour row in pixels (h-14)

export default function WeekView() {
  const today = new Date()
  const weekStart = startOfWeek(today, { weekStartsOn: 0 }) // Sunday
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  const hours = Array.from({ length: 24 }, (_, i) => addHours(startOfDay(today), i))
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const navigate = useNavigate()

  // Fetch all events once
  useEffect(() => {
    async function fetchEvents() {
      const data = await getEvents()
      setEvents(data)
    }
    fetchEvents()
  }, [])

  // Scroll to current hour on mount
  useEffect(() => {
    const el = document.getElementById(`hour-${today.getHours()}`)
    el?.scrollIntoView({ block: 'center' })
  }, [today])

  return (
    <section className="relative overflow-auto h-full">
      <div className="grid grid-cols-8 min-w-[1200px] relative">
        {/* Time labels */}
        <div className="border-r bg-gray-50 dark:bg-gray-800">
          {hours.map((h, i) => (
            <div key={i} id={`hour-${i}`} className="h-14 text-xs px-1">
              {format(h, 'h a')}
            </div>
          ))}
        </div>
        {/* Day columns */}
        {days.map((d) => (
          <div key={d.toISOString()} className="border-r relative">
            {/* Date header */}
            <div
              className={`sticky top-0 py-1 text-center ${
                isToday(d) ? 'bg-blue-600 text-white rounded-full w-8 mx-auto' : ''
              }`}
            >
              {format(d, 'EE dd')}
            </div>
            {/* Events */}
            {events
              .filter((e) => isSameDay(e.start, d))
              .map((e) => {
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
        {/* Now line */}
        <div
          className="absolute left-0 right-0 h-px bg-red-500"
          style={{ top: `${(getHours(new Date()) + getMinutes(new Date()) / 60) * HOUR_HEIGHT}px` }}
        />
      </div>
    </section>
  )
}