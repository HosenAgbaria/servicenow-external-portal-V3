import * as React from "react"
import { Upload } from "lucide-react"
import { cn } from "../../lib/utils"

export interface FileInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  accept?: string;
  multiple?: boolean;
}

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ className, label, accept, multiple = false, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            type="file"
            className={cn(
              "absolute inset-0 w-full h-full opacity-0 cursor-pointer",
              className
            )}
            ref={ref}
            accept={accept}
            multiple={multiple}
            {...props}
          />
          <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className="text-center">
              <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
              <p className="text-sm text-slate-600">
                Click to upload or drag and drop
              </p>
              {accept && (
                <p className="text-xs text-slate-500 mt-1">
                  Accepted formats: {accept}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
)
FileInput.displayName = "FileInput"

export { FileInput } 