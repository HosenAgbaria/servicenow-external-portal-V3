import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, Info } from 'lucide-react';

interface DemoModeNotificationProps {
  show: boolean;
  onDismiss: () => void;
}

export const DemoModeNotification: React.FC<DemoModeNotificationProps> = ({ show, onDismiss }) => {
  if (!show) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md bg-amber-50 border border-amber-200 rounded-lg shadow-lg p-4">
      <div className="flex items-start gap-3">
        <Info className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-amber-800 mb-1">
            Demo Mode Active
          </h4>
          <p className="text-sm text-amber-700">
            Unable to connect to ServiceNow API. Displaying sample data for demonstration purposes.
          </p>
          <p className="text-xs text-amber-600 mt-2">
            For production use, a server-side proxy is required to handle CORS restrictions.
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="text-amber-500 hover:text-amber-700 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export const useDemoModeNotification = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [hasShownNotification, setHasShownNotification] = useState(false);

  useEffect(() => {
    // Listen for demo mode events
    const handleDemoMode = () => {
      if (!hasShownNotification) {
        setShowNotification(true);
        setHasShownNotification(true);
      }
    };

    // Check if we're in demo mode by listening to console messages
    const originalConsoleInfo = console.info;
    console.info = (...args) => {
      originalConsoleInfo(...args);
      const message = args.join(' ');
      if (message.includes('Running in demo mode')) {
        handleDemoMode();
      }
    };

    return () => {
      console.info = originalConsoleInfo;
    };
  }, [hasShownNotification]);

  const dismissNotification = () => {
    setShowNotification(false);
  };

  return {
    showNotification,
    dismissNotification
  };
};