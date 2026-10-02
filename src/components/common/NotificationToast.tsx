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
    success: 'bg-white border-l-4 border-l-emerald-600 border-slate-200 text-slate-800',
    alert: 'bg-white border-l-4 border-l-red-600 border-slate-200 text-slate-800',
    warning: 'bg-white border-l-4 border-l-amber-500 border-slate-200 text-slate-800',
    info: 'bg-white border-l-4 border-l-sky-600 border-slate-200 text-slate-800',
  };

  const IconMap = {
    success: CheckCircle2,
    alert: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const iconColorMap = {
    success: 'text-emerald-600',
    alert: 'text-red-600',
    warning: 'text-amber-600',
    info: 'text-sky-600',
  };

  const Icon = IconMap[type];

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-50 max-w-md w-full animate-fade-in pointer-events-auto">
      <div
        className={`border rounded-lg p-4 flex items-start gap-3 shadow-lg ${styleMap[type]}`}
      >
        <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColorMap[type]}`} />
        <div className="flex-1 text-xs sm:text-sm font-medium leading-snug">
          {text}
        </div>
        <button
          onClick={dismissNotification}
          className="text-slate-400 hover:text-slate-700 p-1 -mr-1 -mt-1 transition-colors"
          aria-label="Dismiss Notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
