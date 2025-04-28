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
import { useNavigate, useParams } from 'react-router-dom'
import { getEvents } from '@/db/eventStore'
import { CalendarEvent } from '@/lib/types'

const HOUR_HEIGHT = 56 // height of each hour row in pixels (h-14)
// constants – keep in one place so header & body stay identical
const COL_TEMPLATE = '64px repeat(7,minmax(0,1fr))';

export default function WeekView() {
  const params = useParams()
  const today = new Date(params.date ?? Date.now())
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
    const el = document.getElementById(`hour-${new Date().getHours()}`)
    el?.scrollIntoView({ block: 'center' })
  }, [])

  return (
    <section className="relative overflow-auto">
      <div className="flex-1 overflow-auto">
        <div className="min-w-[1000px]">
          {/* Sticky header row */}
          <div
            className="sticky top-0 z-10 grid border-b
                     bg-surface dark:bg-surface-muted
                     border-border dark:border-border-muted
                     w-full"
            style={{ gridTemplateColumns: COL_TEMPLATE }}
          >
            <div /> {/* empty cell over the hour column */}
            {days.map(d => (
              <div
                key={d.toISOString()}
                role="columnheader"
                className={`py-2 text-center text-sm font-medium ${
                  isToday(d) ? 'bg-blue-100 dark:bg-blue-900/30' : ''
                }`}
              >
                {format(d, 'EEE d')}
              </div>
            ))}
          </div>
          
          {/* Time grid */}
          <div
            className="grid divide-x"
            style={{ gridTemplateColumns: COL_TEMPLATE }}
          >
            {/* first column – hour labels */}
            <div className="col-span-1 border-r bg-gray-50 dark:bg-gray-800">
              {hours.map((h, i) => (
                <div key={i} id={`hour-${i}`} className="h-14 text-xs px-2">
                  {format(h, 'h a')}
                </div>
              ))}
            </div>

            {/* 7 day columns */}
            {days.map((d) => (
              <div key={d.toISOString()} className="col-span-1 border-r relative">
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
        </div>
      </div>
    </section>
  )
}