import React from 'react';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

export const PriceOverlapDisplay = ({ farmerMin, buyerMin, buyerMax, marketRef, suggestedPrice, isFeasible }) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Threshold Pricing Discovery</h4>
        {isFeasible ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Feasible Overlap Found
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-100 px-3 py-1 rounded-full border border-red-300">
            <XCircle className="w-4 h-4 text-red-600" /> NO_FEASIBLE_PRICE
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-xs">
          <div className="text-xs text-gray-500 font-semibold uppercase">Farmer Floor Price</div>
          <div className="text-lg font-extrabold text-gray-800 mt-1">₹{Number(farmerMin || 0).toFixed(2)} / kg</div>
          <div className="text-[11px] text-gray-400 mt-0.5">Minimum acceptable</div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-xs">
          <div className="text-xs text-gray-500 font-semibold uppercase">Buyer Acceptable Range</div>
          <div className="text-lg font-extrabold text-blue-700 mt-1">
            ₹{Number(buyerMin || 0).toFixed(2)} – ₹{Number(buyerMax || 0).toFixed(2)}
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5">Institutional budget</div>
        </div>

        <div className={`p-3 rounded-lg border shadow-xs ${isFeasible ? 'bg-emerald-50 border-emerald-300' : 'bg-red-50 border-red-200'}`}>
          <div className={`text-xs font-semibold uppercase ${isFeasible ? 'text-emerald-700' : 'text-red-700'}`}>
            {isFeasible ? 'Recommended Overlap Price' : 'Outcome'}
          </div>
          <div className={`text-xl font-black mt-1 ${isFeasible ? 'text-emerald-800' : 'text-red-700'}`}>
            {isFeasible ? `₹${Number(suggestedPrice || 0).toFixed(2)} / kg` : 'Renegotiation Required'}
          </div>
          <div className="text-[11px] text-gray-500 mt-0.5">
            {isFeasible ? (marketRef ? `Clamped to market ref (₹${Number(marketRef).toFixed(2)})` : 'Midpoint of overlap') : 'No mutual price agreement possible'}
          </div>
        </div>
      </div>
    </div>
  );
};
