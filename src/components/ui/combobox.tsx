import * as React from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { cn } from "../../lib/utils"

export interface ComboboxOption {
  value: string
  label: string
}

export interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  disabled?: boolean
  className?: string
  error?: boolean
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  disabled = false,
  className,
  error = false
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
        setSearchValue("")
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  const filteredOptions = React.useMemo(() => {
    if (!searchValue) return options
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchValue.toLowerCase())
    )
  }, [options, searchValue])

  const selectedOption = React.useMemo(() => {
    return options.find((option) => option.value === value)
  }, [options, value])

  const handleSelect = (option: ComboboxOption) => {
    onChange?.(option.value)
    setSearchValue("")
    setOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
    if (!open) setOpen(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && filteredOptions.length > 0) {
      handleSelect(filteredOptions[0])
    }
    if (e.key === "Escape") {
      setOpen(false)
      setSearchValue("")
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className={cn(
              "flex h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-10 py-2 text-sm ring-offset-background placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-red-300 focus:border-red-500 focus:ring-red-500",
              className
            )}
            placeholder={open ? searchPlaceholder : selectedOption?.label || placeholder}
            value={open ? searchValue : selectedOption?.label || ""}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setOpen(true)}
            disabled={disabled}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onClick={() => setOpen(!open)}
            disabled={disabled}
          >
            <ChevronsUpDown className="h-4 w-4 text-slate-400" />
          </button>
        </div>
      </div>

      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {filteredOptions.length === 0 ? (
            <div className="px-3 py-2 text-sm text-slate-500">
              No options found.
            </div>
          ) : (
            <div className="py-1">
              {filteredOptions.map((option) => (
                <button
                  key={option.value}
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center px-3 py-2 text-sm hover:bg-slate-100 focus:bg-slate-100 focus:outline-none",
                    option.value === value && "bg-blue-50 text-blue-900"
                  )}
                  onClick={() => handleSelect(option)}
                >
                  <span className="flex-1 truncate">{option.label}</span>
                  {option.value === value && (
                    <Check className="h-4 w-4 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
} 