import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { batchesApi } from '../../api/batches';
import { PriceOverlapDisplay } from '../../components/pricing/PriceOverlapDisplay';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { SimulatedLedgerBanner } from '../../components/ui/SimulatedLedgerBanner';
import { Layers, Users, ArrowRight, AlertCircle, CheckCircle2, Shield } from 'lucide-react';

export const BatchPresentationPage = () => {
  const { batchId = 1 } = useParams();

  const { data: batch, isLoading } = useQuery({
    queryKey: ['batch', batchId],
    queryFn: async () => {
      try {
        const res = await batchesApi.getById(batchId);
        return res.data;
      } catch {
        return null;
      }
    },
  });

  if (isLoading) return <LoadingSpinner text="Loading matched batch..." />;

  const isShortfall = batch?.shortfallQty && Number(batch.shortfallQty) > 0;

  return (
    <div className="max-w-4xl mx-auto my-6 space-y-6">
      <SimulatedLedgerBanner />

      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Aggregated Farmer Cooperative Batch</h1>
          <p className="text-xs text-gray-500 mt-1">
            Explainable clustering of compatible smallholders based on proximity, moisture verification, and price overlap.
          </p>
        </div>
        <StatusBadge status={batch?.status || 'FORMED'} />
      </div>

      {/* Allocation Status Alert */}
      {isShortfall ? (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900">
            <strong>Partial Batch Shortfall:</strong> Matched supply covers {Number(batch?.totalAllocatedQty || 500).toFixed(1)} kg of your {Number(batch?.requiredQty || 600).toFixed(1)} kg requirement. 
            Shortfall: <strong className="text-amber-800">{Number(batch?.shortfallQty || 100).toFixed(1)} kg</strong>.
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div className="text-sm text-emerald-900 font-bold">
            100% Demand Fulfilled: {Number(batch?.totalAllocatedQty || 600).toFixed(1)} kg allocated across verified local farmers.
          </div>
        </div>
      )}

      {/* Price Overlap Recommendation */}
      <PriceOverlapDisplay
        farmerMin={27.00}
        buyerMin={28.00}
        buyerMax={32.00}
        marketRef={29.50}
        suggestedPrice={29.50}
        isFeasible={true}
      />

      {/* Explainable Batch Breakdown Table */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-green-600" /> Explainable Farmer Contribution Matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-3">Farmer</th>
                <th className="px-4 py-3">Trust & Reliability</th>
                <th className="px-4 py-3">Verified Lot</th>
                <th className="px-4 py-3">Allocated Qty</th>
                <th className="px-4 py-3">Inclusion Rationale</th>
                <th className="px-4 py-3 text-center">Farmer Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {batch?.members?.map((m) => (
                <tr key={m.membershipId} className="hover:bg-gray-50">
                  <td className="px-4 py-3.5 font-bold text-gray-900">
                    {m.farmerName}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      Score: {Number(m.farmerReliabilityScore).toFixed(1)}/100
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-gray-700">
                    {Number(m.verifiedQty).toFixed(1)} kg
                  </td>
                  <td className="px-4 py-3.5 font-black text-green-700">
                    {Number(m.allocatedQty).toFixed(1)} kg
                  </td>
                  <td className="px-4 py-3.5 text-xs text-gray-500 font-mono">
                    {m.inclusionReason}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <StatusBadge status={m.farmerDecision || 'PENDING'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Link
            to="/agreements/1"
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow transition flex items-center gap-2 text-sm"
          >
            Review Collective Agreement <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
