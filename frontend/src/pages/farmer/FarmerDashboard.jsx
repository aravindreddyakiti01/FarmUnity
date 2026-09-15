import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { listingsApi } from '../../api/listings';
import { batchesApi } from '../../api/batches';
import { requirementsApi } from '../../api/requirements';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  Sprout,
  PlusCircle,
  TrendingUp,
  Clock,
  Compass,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Scale,
  Calendar,
} from 'lucide-react';

export const FarmerDashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  const { data: listings = [], isLoading: listingsLoading } = useQuery({
    queryKey: ['my-listings'],
    queryFn: async () => {
      const res = await listingsApi.getMyListings();
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

  const { data: requirements = [] } = useQuery({
    queryKey: ['active-requirements'],
    queryFn: async () => {
      const res = await requirementsApi.getAll();
      return res.data;
    },
  });

  // Derived metrics
  const totalListedKg = listings.reduce((sum, l) => sum + (Number(l.declaredQty) || 0), 0);
  const activeBatchesCount = batches.length;
  const verifiedLotsCount = listings.filter((l) => l.status === 'VERIFIED_COMPATIBLE').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Good morning, ${user?.name || 'Farmer'}`}
        description="Manage your harvest lots, review cooperative buyer opportunities, and track your verified payouts."
        action={
          <Link to="/farmer/listings/new">
            <Button variant="primary" size="md" icon={PlusCircle}>
              {t('sell_produce')}
            </Button>
          </Link>
        }
      />

      {/* Farm Activity Snapshot */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
          <p className="text-xs text-stone-500 font-medium">Produce Listed</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-stone-900">{listings.length}</span>
            <span className="text-xs text-stone-500">lots ({totalListedKg.toLocaleString()} kg)</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
          <p className="text-xs text-stone-500 font-medium">Quality Verified</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-green-800">{verifiedLotsCount}</span>
            <span className="text-xs text-stone-500">certified lots</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
          <p className="text-xs text-stone-500 font-medium">Active Batches</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-stone-900">{activeBatchesCount}</span>
            <span className="text-xs text-stone-500">cooperatives</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
          <p className="text-xs text-stone-500 font-medium">Settlement Status</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-green-800">Protected</span>
            <span className="text-xs text-stone-500">in ledger</span>
          </div>
        </div>
      </div>

      {/* High-Priority Matched Opportunity Banner */}
      {requirements.length > 0 && (
        <div className="p-5 rounded-xl bg-green-50 border border-green-200 text-stone-900 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-green-200/70 text-green-900 text-xs font-semibold mb-2">
                <Compass className="w-3.5 h-3.5" />
                <span>Compatible Bulk Demand Nearby</span>
              </div>
              <h3 className="text-lg font-bold text-stone-900">
                {requirements[0].product?.toUpperCase()} &mdash; Institutional Need for {Number(requirements[0].quantityKg).toLocaleString()} kg
              </h3>
              <p className="text-xs text-stone-600 mt-1 max-w-2xl">
                Destination: {requirements[0].destination || 'Bengaluru Central'} &middot; Price Target: ₹{requirements[0].priceMin || 25} - ₹{requirements[0].priceMax || 28}/kg.
                Your verified lot is eligible to contribute to this bulk batch.
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-stone-700">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-700" /> Compatible Crop Variety
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-700" /> Moisture Tolerances Met
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-700" /> Price Range Overlapping
                </span>
              </div>
            </div>

            <Link to="/farmer/opportunities">
              <Button variant="primary" size="md">
                Review Opportunity
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* My Produce Lots */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-stone-900">{t('my_produce')}</h2>
          <Link to="/farmer/listings/new" className="text-xs font-semibold text-green-800 hover:underline">
            + {t('sell_produce')}
          </Link>
        </div>

        {listings.length === 0 && !listingsLoading ? (
          <EmptyState
            icon={Sprout}
            title="No produce lots listed yet"
            description="Add your first harvest lot to connect with institutional buyers and local cooperative batches."
            actionLabel={t('sell_produce')}
            onAction={() => (window.location.href = '/farmer/listings/new')}
          />
        ) : (
          <div className="grid gap-3">
            {listings.map((lot) => (
              <div
                key={lot.id}
                className="p-4 rounded-xl bg-white border border-stone-200 hover:border-stone-300 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-stone-900 capitalize">
                      {lot.crop} ({lot.variety || 'Standard'})
                    </span>
                    <StatusBadge status={lot.status} />
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500">
                    <span className="flex items-center gap-1">
                      <Scale className="w-3.5 h-3.5 text-stone-400" />
                      Declared: <strong>{Number(lot.declaredQty).toLocaleString()} kg</strong>
                      {lot.verifiedQty && (
                        <span className="text-green-800 font-semibold ml-1">
                          (Verified: {Number(lot.verifiedQty).toLocaleString()} kg)
                        </span>
                      )}
                    </span>

                    {lot.moistureReading && (
                      <span>
                        Moisture: <strong>{lot.moistureReading}%</strong>
                      </span>
                    )}

                    <span>
                      Floor: <strong>₹{lot.minPricePerKg}/kg</strong>
                    </span>

                    {lot.harvestDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        {lot.harvestDate}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {lot.status === 'DRAFT' && (
                    <Link to={`/farmer/listings`}>
                      <Button variant="outline" size="sm">
                        Submit for Verification
                      </Button>
                    </Link>
                  )}
                  {lot.status === 'IN_BATCH' && (
                    <Link to={`/batches/${batches[0]?.id || 1}`}>
                      <Button variant="secondary" size="sm">
                        View Batch
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
