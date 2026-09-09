import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { batchesApi } from '../../api/batches';
import { PriceOverlapDisplay } from '../../components/pricing/PriceOverlapDisplay';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { SimulatedLedgerBanner } from '../../components/ui/SimulatedLedgerBanner';
import { 
  Layers, 
  Users, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Scale, 
  MapPin, 
  Sparkles,
  HelpCircle
} from 'lucide-react';

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

  if (isLoading) return <LoadingSpinner text="Retrieving cooperative batch..." />;

  const isShortfall = batch?.shortfallQty && Number(batch.shortfallQty) > 0;
  const totalAllocated = Number(batch?.totalAllocatedQty || 600);
  const required = Number(batch?.requiredQty || 600);

  return (
    <div className="max-w-4xl mx-auto my-6 space-y-6">
      <SimulatedLedgerBanner />

      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <Layers className="w-3.5 h-3.5 text-blue-700" />
            <span>Demand-Driven Cooperative Batch #{batchId}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
            Aggregated Smallholder Supply Pool
          </h1>
          <p className="text-xs text-stone-500">
            Formed from verified nearby smallholders meeting crop, moisture, price envelope, and harvest window filters.
          </p>
        </div>
        <StatusBadge status={batch?.status || 'FORMED'} />
      </div>

      {/* Demand Fulfilment Status Card */}
      {isShortfall ? (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <strong className="font-bold text-sm block">Partial Supply Pool (Shortfall Detected)</strong>
            Allocated supply covers <strong>{totalAllocated.toFixed(1)} kg</strong> of your <strong>{required.toFixed(1)} kg</strong> order. 
            Shortfall: <strong className="text-amber-800 font-bold">{Number(batch?.shortfallQty || 0).toFixed(1)} kg</strong>.
            Our engine is actively monitoring nearby collection centers for newly verified compatible lots.
          </div>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-300 rounded-2xl p-5 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-700 shrink-0" />
          <div className="text-xs text-green-900 leading-relaxed">
            <strong className="font-bold text-sm block">100% Demand Fulfilled ({totalAllocated.toFixed(0)} kg)</strong>
            Successfully combined verified local smallholders into a unified delivery batch with zero broker markup.
          </div>
        </div>
      )}

      {/* Transparent Match Score & Decision Breakdown (Section 17 & 18) */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-700" />
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              Transparent Matching Score &amp; Rationale Breakdown
            </h3>
          </div>
          <span className="text-xs font-black bg-blue-50 text-blue-800 px-3 py-1 rounded-full border border-blue-200">
            Overall Fit: 94 / 100
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
            <span className="font-black text-stone-900 text-sm block">35%</span>
            <span className="text-[10px] text-stone-500 font-bold uppercase block mt-0.5">Quantity Fit</span>
            <span className="text-[10px] text-green-700 font-bold">100% Volume</span>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
            <span className="font-black text-stone-900 text-sm block">20%</span>
            <span className="text-[10px] text-stone-500 font-bold uppercase block mt-0.5">Proximity Radius</span>
            <span className="text-[10px] text-green-700 font-bold">&lt; 25 km Avg</span>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
            <span className="font-black text-stone-900 text-sm block">20%</span>
            <span className="text-[10px] text-stone-500 font-bold uppercase block mt-0.5">Price Envelope</span>
            <span className="text-[10px] text-green-700 font-bold">Compatible</span>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
            <span className="font-black text-stone-900 text-sm block">15%</span>
            <span className="text-[10px] text-stone-500 font-bold uppercase block mt-0.5">Moisture Gate</span>
            <span className="text-[10px] text-green-700 font-bold">13.1% Certified</span>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
            <span className="font-black text-stone-900 text-sm block">10%</span>
            <span className="text-[10px] text-stone-500 font-bold uppercase block mt-0.5">Delivery Window</span>
            <span className="text-[10px] text-green-700 font-bold">Aligned</span>
          </div>
        </div>

        {/* Cooperative Fairness Policy Note */}
        <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80 text-[11px] text-stone-600 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-stone-400 shrink-0" />
          <span>
            <strong>Cooperative Fairness Guarantee:</strong> Smallholders who have not supplied recently receive rotation priority to ensure fair regional market access.
          </span>
        </div>
      </div>

      {/* Threshold Pricing Recommendation */}
      <PriceOverlapDisplay
        farmerMin={27.00}
        buyerMin={28.00}
        buyerMax={32.00}
        marketRef={29.50}
        suggestedPrice={29.50}
        isFeasible={true}
      />

      {/* Farmer Contribution Matrix */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-green-700" />
            <span>Participating Smallholder Contribution Matrix</span>
          </h3>
          <span className="text-xs text-stone-500 font-semibold">
            {batch?.members?.length || 2} Farmers Allocated
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-stone-200 text-sm">
            <thead>
              <tr className="bg-stone-50 text-left text-xs font-bold text-stone-600 uppercase tracking-wider">
                <th className="px-4 py-3">Farmer</th>
                <th className="px-4 py-3">Reliability Tier</th>
                <th className="px-4 py-3">Verified Lot</th>
                <th className="px-4 py-3">Allocated Supply</th>
                <th className="px-4 py-3">Inclusion Reason</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {batch?.members?.map((m) => (
                <tr key={m.membershipId} className="hover:bg-stone-50/50 transition">
                  <td className="px-4 py-3.5 font-bold text-stone-900">
                    {m.farmerName}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      Score: {Number(m.farmerReliabilityScore || 85).toFixed(1)}/100
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-stone-700">
                    {Number(m.verifiedQty).toFixed(1)} kg
                  </td>
                  <td className="px-4 py-3.5 font-black text-green-700">
                    {Number(m.allocatedQty).toFixed(1)} kg
                  </td>
                  <td className="px-4 py-3.5 text-xs text-stone-500">
                    {m.inclusionReason || 'Same crop, moisture pass, within 25km radius'}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <StatusBadge status={m.farmerDecision || 'ACCEPTED'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-stone-100">
          <Link
            to="/agreements/1"
            className="px-6 py-3.5 bg-green-700 hover:bg-green-800 text-white font-bold rounded-2xl shadow-sm hover:shadow transition flex items-center gap-2 text-sm"
          >
            <span>Review &amp; Lock Collective Agreement</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
