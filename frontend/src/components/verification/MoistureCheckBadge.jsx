import React from 'react';
import { Droplet, CheckCircle, AlertTriangle } from 'lucide-react';

export const MoistureCheckBadge = ({ moisture, min = 12.0, max = 14.0 }) => {
  if (moisture === null || moisture === undefined) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
        <Droplet className="w-3 h-3" /> Uninspected
      </span>
    );
  }

  const numMoisture = Number(moisture);
  const isPass = numMoisture >= min && numMoisture <= max;

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${
      isPass
        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
        : 'bg-red-50 text-red-800 border-red-300'
    }`}>
      {isPass ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <AlertTriangle className="w-3.5 h-3.5 text-red-600" />}
      <span>{numMoisture.toFixed(1)}%</span>
      <span className="text-[10px] opacity-75 font-normal">({min}–{max}% band)</span>
      {!isPass && <span className="ml-1 uppercase text-[9px] bg-red-200 px-1 py-0.2 rounded font-bold">Drying</span>}
    </span>
  );
};
