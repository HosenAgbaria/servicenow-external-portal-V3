import * as React from "react"
import { X, CheckCircle, AlertCircle, Info } from "lucide-react"
import { cn } from "../../lib/utils"

export interface ToastProps {
  type?: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
  onClose?: () => void;
  duration?: number;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ type = 'info', title, message, onClose, duration = 5000 }, ref) => {
    const [isVisible, setIsVisible] = React.useState(true);

    React.useEffect(() => {
      if (duration > 0) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          setTimeout(() => onClose?.(), 300);
        }, duration);
        return () => clearTimeout(timer);
      }
    }, [duration, onClose]);

    const handleClose = () => {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 300);
    };

    const getIcon = () => {
      switch (type) {
        case 'success':
          return <CheckCircle className="h-5 w-5 text-green-500" />;
        case 'error':
          return <AlertCircle className="h-5 w-5 text-red-500" />;
        case 'warning':
          return <AlertCircle className="h-5 w-5 text-yellow-500" />;
        default:
          return <Info className="h-5 w-5 text-blue-500" />;
      }
    };

    const getStyles = () => {
      switch (type) {
        case 'success':
          return 'bg-green-50 border-green-200 text-green-800';
        case 'error':
          return 'bg-red-50 border-red-200 text-red-800';
        case 'warning':
          return 'bg-yellow-50 border-yellow-200 text-yellow-800';
        default:
          return 'bg-blue-50 border-blue-200 text-blue-800';
      }
    };

    if (!isVisible) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "fixed top-4 right-4 z-50 max-w-sm w-full p-4 rounded-lg border shadow-lg transition-all duration-300 transform",
          getStyles(),
          isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        )}
      >
        <div className="flex items-start space-x-3">
          {getIcon()}
          <div className="flex-1 min-w-0">
            {title && (
              <h4 className="text-sm font-medium mb-1">{title}</h4>
            )}
            <p className="text-sm">{message}</p>
          </div>
          {onClose && (
            <button
              onClick={handleClose}
              className="flex-shrink-0 p-1 rounded-md hover:bg-black/10 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    )
  }
)
Toast.displayName = "Toast"

export { Toast } 