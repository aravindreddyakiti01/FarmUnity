import React from 'react';
import { Shield, ShieldCheck, ShieldAlert, AlertCircle } from 'lucide-react';

export const TrustBadge = ({ tier }) => {
  switch (tier) {
    case 'TRUSTED':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-300">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Trusted Tier
        </span>
      );
    case 'ESTABLISHED':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Established
        </span>
      );
    case 'VERIFIED':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-300">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Verified
        </span>
      );
    case 'UNDER_REVIEW':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-300">
          <AlertCircle className="w-3.5 h-3.5 text-orange-600" /> Under Review
        </span>
      );
    case 'SUSPENDED':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-300">
          <ShieldAlert className="w-3.5 h-3.5 text-red-600" /> Suspended
        </span>
      );
    case 'NEW':
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-300">
          <Shield className="w-3.5 h-3.5 text-gray-500" /> New Account
        </span>
      );
  }
};
