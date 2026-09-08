import React from 'react';
import { CheckCircle, Shield, FileText, ArrowRight } from 'lucide-react';

export const SettlementBreakdown = ({ settlement }) => {
  if (!settlement) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-gray-100 gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Transparent Cooperative Settlement Pool</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Distributed strictly in proportion to <strong className="text-green-700">verified delivered quantities</strong>. Declared quantities are not used.
          </p>
        </div>

        {settlement.agreementIntegrityHash && (
          <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-lg text-xs">
            <Shield className="w-4 h-4 text-purple-600 flex-shrink-0" />
            <div>
              <span className="text-purple-900 font-bold block">Integrity Proof Hash</span>
              <span className="font-mono text-[10px] text-purple-700 truncate block max-w-[200px]" title={settlement.agreementIntegrityHash}>
                {settlement.agreementIntegrityHash}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
        <div className="bg-gray-50 p-3.5 rounded-lg border border-gray-100">
          <span className="text-xs text-gray-500 font-medium">Gross Pool Value</span>
          <div className="text-lg font-extrabold text-gray-900 mt-1">₹{Number(settlement.grossTotal || 0).toFixed(2)}</div>
        </div>
        <div className="bg-gray-50 p-3.5 rounded-lg border border-gray-100">
          <span className="text-xs text-gray-500 font-medium">Transport Deductions</span>
          <div className="text-lg font-extrabold text-gray-700 mt-1">-₹{Number(settlement.transportTotal || 0).toFixed(2)}</div>
        </div>
        <div className="bg-gray-50 p-3.5 rounded-lg border border-gray-100">
          <span className="text-xs text-gray-500 font-medium">Platform Fee (2%)</span>
          <div className="text-lg font-extrabold text-gray-700 mt-1">-₹{Number(settlement.platformFeeTotal || 0).toFixed(2)}</div>
        </div>
        <div className="bg-emerald-50 p-3.5 rounded-lg border border-emerald-200">
          <span className="text-xs text-emerald-800 font-bold uppercase">Net Farmer Pool</span>
          <div className="text-xl font-black text-emerald-800 mt-1">₹{Number(settlement.netPoolTotal || 0).toFixed(2)}</div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-4 py-3">Farmer</th>
              <th className="px-4 py-3">Verified Delivered Qty</th>
              <th className="px-4 py-3">Gross Share</th>
              <th className="px-4 py-3">Deductions</th>
              <th className="px-4 py-3 text-right">Net Farmer Payout</th>
              <th className="px-4 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {settlement.farmerSettlements?.map((fs) => (
              <tr key={fs.settlementId} className="hover:bg-gray-50">
                <td className="px-4 py-3.5">
                  <div className="font-semibold text-gray-900">{fs.farmerName}</div>
                  <div className="text-xs text-gray-400">{fs.farmerPhone}</div>
                </td>
                <td className="px-4 py-3.5 font-bold text-gray-800">
                  {Number(fs.verifiedQty).toFixed(2)} kg
                </td>
                <td className="px-4 py-3.5 text-gray-600">
                  ₹{Number(fs.grossAmount).toFixed(2)}
                </td>
                <td className="px-4 py-3.5 text-xs text-gray-500">
                  -₹{(Number(fs.transportDeduction) + Number(fs.platformFee)).toFixed(2)}
                </td>
                <td className="px-4 py-3.5 text-right font-black text-emerald-700 text-base">
                  ₹{Number(fs.netPayout).toFixed(2)}
                </td>
                <td className="px-4 py-3.5 text-center">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                    <CheckCircle className="w-3.5 h-3.5 text-green-600" /> Settled
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
