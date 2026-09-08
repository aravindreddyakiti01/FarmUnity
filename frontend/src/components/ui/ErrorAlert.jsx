import React from 'react';
import { AlertCircle } from 'lucide-react';

export const ErrorAlert = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between mb-4 shadow-sm">
      <div className="flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
        <span className="text-sm font-medium">{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-red-400 hover:text-red-700 font-bold ml-4"
        >
          &times;
        </button>
      )}
    </div>
  );
};
