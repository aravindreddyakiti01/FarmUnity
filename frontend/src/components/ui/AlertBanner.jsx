import React from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

export const AlertBanner = ({
  variant = 'info', // 'info' | 'warning' | 'urgent' | 'success'
  title,
  children,
  action,
  className = '',
}) => {
  const styles = {
    info: {
      bg: 'bg-stone-50 border-stone-300 text-stone-800',
      icon: <Info className="w-5 h-5 text-stone-600 shrink-0" />,
    },
    warning: {
      bg: 'bg-amber-50 border-amber-300 text-amber-900',
      icon: <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />,
    },
    urgent: {
      bg: 'bg-red-50 border-red-300 text-red-900',
      icon: <AlertCircle className="w-5 h-5 text-red-700 shrink-0" />,
    },
    success: {
      bg: 'bg-green-50 border-green-300 text-green-900',
      icon: <CheckCircle2 className="w-5 h-5 text-green-700 shrink-0" />,
    },
  };

  const current = styles[variant] || styles.info;

  return (
    <div
      className={`p-4 rounded-xl border flex items-start justify-between gap-3 text-sm shadow-xs ${current.bg} ${className}`}
    >
      <div className="flex items-start gap-3">
        {current.icon}
        <div>
          {title && <h4 className="font-semibold mb-0.5">{title}</h4>}
          <div className="text-xs leading-relaxed opacity-95">{children}</div>
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
