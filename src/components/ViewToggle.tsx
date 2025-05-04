import { useNavigate, useLocation } from 'react-router-dom'

export enum ViewRoute {
  Month = 'month',
  Week = 'week',
  Day = 'day',
}

interface ToggleOption {
  id: ViewRoute
  label: string
}

const options: ToggleOption[] = [
  { id: ViewRoute.Month, label: 'Month' },
  { id: ViewRoute.Week, label: 'Week' },
  { id: ViewRoute.Day, label: 'Day' },
]

export default function ViewToggle() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <div className="flex gap-2">
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => navigate(`/${o.id}`)}
          className={`px-3 py-1 rounded text-white ${
            pathname.startsWith(`/${o.id}`) ? 'bg-blue-600' : 'bg-zinc-700'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}