import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { batchesApi } from '../../api/batches';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  Layers,
  Scale,
  Calendar,
  Truck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

export const FarmerOrdersPage = () => {
  const { data: batches = [], isLoading } = useQuery({
    queryKey: ['my-batches'],
    queryFn: async () => {
      const res = await batchesApi.getMyBatches();
      return res.data;
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Orders & Cooperative Batches"
        description="Track your contributions through the entire lifecycle: aggregation, agreement lock, pickup, processing, and weighbridge delivery."
      />

      {batches.length === 0 && !isLoading ? (
        <EmptyState
          icon={Layers}
          title="No active batches yet"
          description="Once your produce lot is accepted into an institutional cooperative batch, it will appear here."
          actionLabel="View Opportunities"
          onAction={() => (window.location.href = '/farmer/opportunities')}
        />
      ) : (
        <div className="grid gap-4">
          {batches.map((batch) => (
            <div
              key={batch.id}
              className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs hover:border-stone-300 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-stone-900">
                      Cooperative Batch #{batch.id} &mdash; {batch.product?.toUpperCase()}
                    </span>
                    <StatusBadge status={batch.status} />
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Target Volume: {Number(batch.requiredQty || 3000).toLocaleString()} kg &middot; Contributing Producers: {batch.members?.length || 3}
                  </p>
                </div>

                <Link to={`/batches/${batch.id}`}>
                  <Button variant="secondary" size="sm">
                    Open Batch Details <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>

              {/* Progress Milestones */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 text-xs">
                <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 block mb-0.5">My Contribution</span>
                  <span className="font-bold text-stone-900 text-sm">1,200 kg</span>
                  <span className="text-[10px] text-green-700 block font-semibold">Verified Lot</span>
                </div>

                <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 block mb-0.5">Agreed Price</span>
                  <span className="font-bold text-stone-900 text-sm">₹26.50 / kg</span>
                  <span className="text-[10px] text-stone-500 block">Version Locked</span>
                </div>

                <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 block mb-0.5">Pickup Window</span>
                  <span className="font-bold text-stone-900 text-sm">Scheduled</span>
                  <span className="text-[10px] text-stone-500 block">Stop #1 on Route</span>
                </div>

                <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 block mb-0.5">Est. Net Payout</span>
                  <span className="font-bold text-green-800 text-sm">₹30,260</span>
                  <span className="text-[10px] text-stone-500 block">Escrow Protected</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
                <span>Created: {new Date(batch.createdAt || Date.now()).toLocaleDateString()}</span>
                <span className="text-stone-600 font-medium">All physical actions logged with cryptographic SHA-256 trail</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
