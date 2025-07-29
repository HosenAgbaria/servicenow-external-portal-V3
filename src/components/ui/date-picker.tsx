import * as React from "react"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "../../lib/utils"

export interface DatePickerProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  error?: boolean
  minDate?: string
  maxDate?: string
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Select date...",
  disabled = false,
  className,
  error = false,
  minDate,
  maxDate
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [currentDate, setCurrentDate] = React.useState(() => {
    const date = value ? new Date(value) : new Date()
    return new Date(date.getFullYear(), date.getMonth(), 1)
  })
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  const selectedDate = value ? new Date(value) : null

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const isDateDisabled = (date: Date) => {
    const dateStr = formatDate(date)
    if (minDate && dateStr < minDate) return true
    if (maxDate && dateStr > maxDate) return true
    return false
  }

  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false
    return formatDate(date) === formatDate(selectedDate)
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return formatDate(date) === formatDate(today)
  }

  const handleDateSelect = (date: Date) => {
    if (isDateDisabled(date)) return
    onChange?.(formatDate(date))
    setOpen(false)
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const generateCalendarDays = () => {
    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-9" />)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const disabled = isDateDisabled(date)
      const selected = isDateSelected(date)
      const today = isToday(date)
      
      days.push(
        <button
          key={day}
          className={cn(
            "h-9 w-9 rounded-md text-sm font-medium transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            disabled && "text-slate-300 cursor-not-allowed hover:bg-transparent",
            selected && "bg-blue-600 text-white hover:bg-blue-700",
            today && !selected && "bg-blue-100 text-blue-900",
            !disabled && !selected && !today && "text-slate-900"
          )}
          onClick={() => handleDateSelect(date)}
          disabled={disabled}
        >
          {day}
        </button>
      )
    }
    
    return days
  }

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          className={cn(
            "flex h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-10 py-2 text-sm ring-offset-background placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-300 focus:border-red-500 focus:ring-red-500",
            className
          )}
          placeholder={placeholder}
          value={selectedDate ? formatDate(selectedDate) : ""}
          readOnly
          onClick={() => setOpen(!open)}
          onFocus={() => setOpen(true)}
          disabled={disabled}
        />
      </div>

      {open && (
        <div className="absolute z-50 mt-1 w-80 bg-white border border-slate-200 rounded-lg shadow-lg p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={goToPreviousMonth}
              className="p-1 hover:bg-slate-100 rounded-md transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <h3 className="text-sm font-semibold text-slate-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <button
              type="button"
              onClick={goToNextMonth}
              className="p-1 hover:bg-slate-100 rounded-md transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Day names */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div key={day} className="h-9 flex items-center justify-center text-xs font-medium text-slate-500">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {generateCalendarDays()}
          </div>

          {/* Today button */}
          <div className="mt-4 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => handleDateSelect(new Date())}
              className="w-full px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 