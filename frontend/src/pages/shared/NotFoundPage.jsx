import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="max-w-md mx-auto my-16 text-center bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
      <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
      <h2 className="text-xl font-bold text-gray-900">Page Not Found</h2>
      <p className="text-xs text-gray-500 mt-1 mb-6">The requested module or resource was not found.</p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl shadow transition"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Home
      </Link>
    </div>
  );
};
