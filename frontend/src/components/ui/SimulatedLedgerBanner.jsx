import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const SimulatedLedgerBanner = () => {
  return (
    <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 mb-6 rounded-r-md shadow-xs">
      <div className="flex items-center">
        <ShieldCheck className="h-5 w-5 text-emerald-600 mr-3 flex-shrink-0" />
        <div className="text-sm text-emerald-900">
          <span className="font-bold uppercase tracking-wider text-[11px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded mr-2">
            Protected Commitment
          </span>
          All transaction commitments are held under <strong>FarmUnity Verified Settlement Protocol</strong>. Funds are locked at agreement signing and released solely upon destination physical delivery verification.
        </div>
      </div>
    </div>
  );
};
