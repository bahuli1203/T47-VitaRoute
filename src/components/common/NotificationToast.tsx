import React, { useEffect } from 'react';
import { useBedLink } from '../../context/BedLinkContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { notificationMessage, dismissNotification } = useBedLink();

  useEffect(() => {
    if (!notificationMessage) return;
    const timer = setTimeout(() => {
      dismissNotification();
    }, 5000);
    return () => clearTimeout(timer);
  }, [notificationMessage, dismissNotification]);

  if (!notificationMessage) return null;

  const { text, type } = notificationMessage;

  const styleMap = {
    success: 'border-l-4 border-l-emerald-600 bg-white text-neutral-900 shadow-md',
    alert: 'border-l-4 border-l-rose-600 bg-white text-neutral-900 shadow-md',
    warning: 'border-l-4 border-l-amber-500 bg-white text-neutral-900 shadow-md',
    info: 'border-l-4 border-l-neutral-900 bg-white text-neutral-900 shadow-md',
  };

  const IconMap = {
    success: CheckCircle2,
    alert: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const iconColorMap = {
    success: 'text-emerald-600',
    alert: 'text-rose-600',
    warning: 'text-amber-600',
    info: 'text-neutral-800',
  };

  const Icon = IconMap[type];

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 sm:right-6 z-50 max-w-md w-full animate-fade-in pointer-events-auto">
      <div
        className={`border border-neutral-200 rounded-xl p-3.5 flex items-start gap-3 shadow-lg ${styleMap[type]}`}
      >
        <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColorMap[type]}`} />
        <div className="flex-1 text-xs sm:text-sm font-medium leading-snug text-neutral-800">
          {text}
        </div>
        <button
          onClick={dismissNotification}
          className="text-neutral-400 hover:text-neutral-700 p-1 -mr-1 -mt-1 transition-colors cursor-pointer"
          aria-label="Dismiss Notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
