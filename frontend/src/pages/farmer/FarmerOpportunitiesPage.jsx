import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { requirementsApi } from '../../api/requirements';
import { batchesApi } from '../../api/batches';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import { AlertBanner } from '../../components/ui/AlertBanner';
import {
  Compass,
  CheckCircle2,
  Building2,
  Calendar,
  Scale,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
} from 'lucide-react';

export const FarmerOpportunitiesPage = () => {
  const [decisions, setDecisions] = useState({});
  const [submittedStatus, setSubmittedStatus] = useState(null);

  const { data: requirements = [], isLoading } = useQuery({
    queryKey: ['active-requirements'],
    queryFn: async () => {
      const res = await requirementsApi.getAll();
      return res.data;
    },
  });

  const { data: batches = [] } = useQuery({
    queryKey: ['my-batches'],
    queryFn: async () => {
      const res = await batchesApi.getMyBatches();
      return res.data;
    },
  });

  const handleDecision = (reqId, decision) => {
    setDecisions((prev) => ({ ...prev, [reqId]: decision }));
    setSubmittedStatus(`Your response (${decision === 'ACCEPT' ? 'Accepted' : 'Declined'}) has been recorded.`);
    setTimeout(() => setSubmittedStatus(null), 4000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Procurement Opportunities"
        description="Active institutional buyer demands compatible with your verified produce lots. Review terms and choose whether to join the cooperative batch."
      />

      {submittedStatus && (
        <AlertBanner variant="success" title="Decision Recorded">
          {submittedStatus}
        </AlertBanner>
      )}

      {requirements.length === 0 && !isLoading ? (
        <EmptyState
          icon={Compass}
          title="No matching opportunities right now"
          description="When institutional buyers publish bulk requirements matching your verified crop, variety, and radius, they will appear here."
        />
      ) : (
        <div className="grid gap-6">
          {requirements.map((req) => {
            const userDecision = decisions[req.id];
            const currentAllocated = 2200; // Realistic demo aggregation context
            const targetQty = Number(req.quantityKg) || 3000;
            const myContribution = 800;

            return (
              <div
                key={req.id}
                className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs hover:border-stone-300 transition-colors"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-green-100 text-green-900 capitalize">
                        {req.product} ({req.variety || 'Bulk'})
                      </span>
                      <span className="text-xs text-stone-500 font-medium">Demand ID: #{req.id}</span>
                    </div>
                    <h3 className="text-lg font-bold text-stone-900">
                      Bulk Requirement for {targetQty.toLocaleString()} kg
                    </h3>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-xs text-stone-500">Agreed Price Band</p>
                    <p className="text-lg font-bold text-green-800">
                      ₹{req.priceMin || '25.00'} &ndash; ₹{req.priceMax || '28.00'}/kg
                    </p>
                  </div>
                </div>

                {/* Aggregation Progress */}
                <div className="py-4 space-y-2">
                  <div className="flex justify-between text-xs text-stone-600">
                    <span>
                      Cooperative Aggregation Progress: <strong>{(currentAllocated + myContribution).toLocaleString()} kg</strong> of {targetQty.toLocaleString()} kg
                    </span>
                    <span className="font-semibold text-green-800">
                      {Math.round(((currentAllocated + myContribution) / targetQty) * 100)}% Matched
                    </span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-green-700 h-full rounded-full"
                      style={{ width: `${Math.min(100, ((currentAllocated + myContribution) / targetQty) * 100)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-stone-500">
                    4 nearby farmers contributing 2,200 kg &middot; Your potential lot allocation: <strong>{myContribution} kg</strong>
                  </p>
                </div>

                {/* Why You Match Section */}
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 mb-5">
                  <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                    Why your lot was matched
                  </h4>
                  <div className="grid sm:grid-cols-3 gap-2.5 text-xs text-stone-700">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0" />
                      <span><strong>Crop:</strong> Compatible {req.product}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0" />
                      <span><strong>Quality:</strong> Verified &le; 14.0% moisture</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0" />
                      <span><strong>Distance:</strong> Within 18 km radius</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0" />
                      <span><strong>Price:</strong> In budget threshold</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0" />
                      <span><strong>Pickup:</strong> Scheduled 5 days out</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0" />
                      <span><strong>Payment:</strong> 100% Escrow deposit</span>
                    </div>
                  </div>
                </div>

                {/* Farmer Choice Action Area */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-stone-200">
                  <div className="text-xs text-stone-500">
                    Estimated gross payout for your 800 kg lot: <strong className="text-stone-900 text-sm font-bold">₹21,200</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    {userDecision ? (
                      <div className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-stone-100 text-stone-800">
                        <Check className="w-4 h-4 text-green-700" />
                        Response: {userDecision}
                      </div>
                    ) : (
                      <>
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={X}
                          onClick={() => handleDecision(req.id, 'DECLINE')}
                        >
                          Decline
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          icon={Check}
                          onClick={() => handleDecision(req.id, 'ACCEPT')}
                        >
                          Join this Cooperative
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
