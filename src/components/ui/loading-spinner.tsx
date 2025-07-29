import * as React from "react"
import { cn } from "../../lib/utils"

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ size = 'md', className, text }, ref) => {
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-8 w-8',
      lg: 'h-12 w-12'
    };

    return (
      <div
        ref={ref}
        className={cn("flex flex-col items-center justify-center", className)}
      >
        <div
          className={cn(
            "animate-spin rounded-full border-2 border-slate-200 border-t-blue-600",
            sizeClasses[size]
          )}
        />
        {text && (
          <p className="mt-2 text-sm text-slate-600">{text}</p>
        )}
      </div>
    )
  }
)
LoadingSpinner.displayName = "LoadingSpinner"

export { LoadingSpinner } 