import * as React from "react"
import { cn } from "../../lib/utils"

export interface RadioOption {
  value: string;
  label: string;
}

export interface RadioGroupProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  name: string;
}

const RadioGroup = React.forwardRef<HTMLInputElement, RadioGroupProps>(
  ({ className, options, value, onChange, label, name, ...props }, ref) => {
    return (
      <div className="space-y-3">
        {label && (
          <label className="text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        <div className="space-y-2">
          {options.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <input
                type="radio"
                id={`${name}-${option.value}`}
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange?.(e.target.value)}
                className={cn(
                  "h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-2",
                  className
                )}
                ref={ref}
                {...props}
              />
              <label
                htmlFor={`${name}-${option.value}`}
                className="text-sm text-slate-700 cursor-pointer"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    )
  }
)
RadioGroup.displayName = "RadioGroup"

export { RadioGroup } 