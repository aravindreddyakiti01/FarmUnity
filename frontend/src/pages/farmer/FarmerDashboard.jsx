import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { listingsApi } from '../../api/listings';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { MoistureCheckBadge } from '../../components/verification/MoistureCheckBadge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { 
  Sprout, 
  PlusCircle, 
  ArrowRight, 
  Scale, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Coins
} from 'lucide-react';

export const FarmerDashboard = () => {
  const { data: listings, isLoading, refetch } = useQuery({
    queryKey: ['listings', 'my'],
    queryFn: async () => {
      const res = await listingsApi.getMyListings();
      return res.data;
    },
  });

  const handleSubmitForVerification = async (listingId) => {
    try {
      await listingsApi.submitForVerification(listingId);
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit for verification');
    }
  };

  const totalLots = listings?.length || 0;
  const verifiedLots = listings?.filter(l => l.status === 'VERIFIED' || l.status === 'POOLED' || l.status === 'AGREED' || l.status === 'DELIVERED' || l.status === 'SETTLED')?.length || 0;
  const totalVerifiedQty = listings?.reduce((sum, l) => sum + (l.verifiedQty || 0), 0) || 0;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
            <Sprout className="w-3.5 h-3.5 text-green-700" />
            <span>Smallholder Supply Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            My Harvest & Produce Lots
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl leading-relaxed">
            List your harvest, invite a local coordinator for physical moisture & grade certification, and receive guaranteed wholesale offers.
          </p>
        </div>

        <Link
          to="/farmer/listings/new"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-green-700 hover:bg-green-800 text-white text-sm font-bold rounded-2xl shadow-sm hover:shadow transition shrink-0"
        >
          <PlusCircle className="w-5 h-5" />
          <span>List New Produce</span>
        </Link>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-stone-900">{totalLots}</div>
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wide">Total Listed Lots</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 border border-amber-200/60">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-amber-900">{verifiedLots}</div>
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wide">Quality Certified</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-700 border border-green-200/60">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-green-800">{totalVerifiedQty.toLocaleString()} kg</div>
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wide">Total Verified Weight</div>
          </div>
        </div>
      </div>

      {/* Main Listings View */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-stone-900">Current Produce Lots</h2>
            <p className="text-xs text-stone-500">Every lot is tracked through inspection, cooperative pooling, and final payout.</p>
          </div>
          <span className="text-xs font-bold text-stone-400 bg-stone-100 px-3 py-1 rounded-full">
            {listings?.length || 0} Lots
          </span>
        </div>

        {isLoading ? (
          <div className="py-12"><LoadingSpinner text="Retrieving harvest lots..." /></div>
        ) : listings?.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-stone-200 rounded-2xl p-8">
            <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-3 text-stone-400">
              <Sprout className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-800">No produce lots added yet</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4">
              Add your paddy, wheat, maize, pulses, or other harvested staple to connect with nearby pooling opportunities.
            </p>
            <Link
              to="/farmer/listings/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-700 hover:bg-green-800 text-white text-xs font-bold rounded-xl transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Your First Produce Lot</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {listings?.map((l) => {
              const isPending = l.status === 'PENDING_VERIFICATION' || l.status === 'CREATED';
              const isVerified = l.status === 'VERIFIED';
              const isPooled = l.status === 'POOLED' || l.status === 'AGREED';
              const isDone = l.status === 'DELIVERED' || l.status === 'SETTLED';

              return (
                <div 
                  key={l.id} 
                  className="p-5 rounded-2xl border border-stone-200 hover:border-stone-300 transition bg-stone-50/50 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="px-3 py-1 rounded-lg bg-stone-200/70 text-stone-800 text-xs font-black uppercase tracking-wider">
                        {l.crop}
                      </span>
                      <span className="text-xs text-stone-500 font-medium">
                        {l.variety || 'Standard grade'}
                      </span>
                      <StatusBadge status={l.status} />
                    </div>

                    <div className="flex items-center gap-6 pt-1 text-xs text-stone-600 flex-wrap">
                      <div>
                        <span className="text-stone-400 block text-[10px] uppercase font-bold">Estimated by You</span>
                        <span className="font-bold text-stone-800 text-sm">{Number(l.declaredQty).toLocaleString()} kg</span>
                      </div>
                      
                      <div className="border-l border-stone-200 pl-4">
                        <span className="text-stone-400 block text-[10px] uppercase font-bold">Verified on Farm</span>
                        {l.verifiedQty ? (
                          <span className="font-black text-green-700 text-sm">{Number(l.verifiedQty).toLocaleString()} kg</span>
                        ) : (
                          <span className="text-amber-700 font-medium italic">Pending Visit</span>
                        )}
                      </div>

                      <div className="border-l border-stone-200 pl-4">
                        <span className="text-stone-400 block text-[10px] uppercase font-bold">Floor Price</span>
                        <span className="font-bold text-green-800 text-sm">₹{Number(l.minPricePerKg).toFixed(2)}/kg</span>
                      </div>

                      {l.moistureReading && (
                        <div className="border-l border-stone-200 pl-4">
                          <span className="text-stone-400 block text-[10px] uppercase font-bold">Moisture Content</span>
                          <MoistureCheckBadge moisture={l.moistureReading} />
                        </div>
                      )}
                    </div>

                    {/* Explainable Next Steps Banner */}
                    <div className="pt-2 text-[11px] text-stone-500 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      {isPending && <span>Next step: Coordinator schedules an on-farm visit to test moisture & calibrate weight.</span>}
                      {isVerified && <span>Next step: Crop is verified and ready. Our engine will group this with nearby farms for bulk buyers.</span>}
                      {isPooled && <span>Next step: Crop is matched in a bulk batch. Waiting for buyer deposit into escrow.</span>}
                      {isDone && <span>Delivery complete! Payment settled proportionally on verified delivered weight.</span>}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 shrink-0 pt-2 lg:pt-0">
                    {l.status === 'CREATED' && (
                      <button
                        onClick={() => handleSubmitForVerification(l.id)}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1.5"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Request Physical Inspection</span>
                      </button>
                    )}

                    {l.status === 'POOLED' && (
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
                        In Cooperative Pool
                      </span>
                    )}

                    {l.status === 'AGREED' && (
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                        Buyer Agreement Confirmed
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Educational Walkthrough Card */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-900">How You Get Paid Through FarmUnity</h3>
            <p className="text-xs text-amber-700">Simple, transparent, and protected against middlemen deductions.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-amber-900 pt-2">
          <div className="bg-white/80 p-4 rounded-xl border border-amber-200/60 space-y-1">
            <span className="font-bold text-amber-800 block">1. On-Farm Verification</span>
            <p className="text-amber-700 leading-relaxed">
              Your declared quantity is an estimate. Payment is strictly computed on the verified weight confirmed by the local coordinator.
            </p>
          </div>

          <div className="bg-white/80 p-4 rounded-xl border border-amber-200/60 space-y-1">
            <span className="font-bold text-amber-800 block">2. Protected Buyer Escrow</span>
            <p className="text-amber-700 leading-relaxed">
              Before your crop leaves the collection point, the institutional buyer deposits full contract funds into an escrow holding account.
            </p>
          </div>

          <div className="bg-white/80 p-4 rounded-xl border border-amber-200/60 space-y-1">
            <span className="font-bold text-amber-800 block">3. Instant Proportional Release</span>
            <p className="text-amber-700 leading-relaxed">
              Upon physical gate delivery, funds release directly to your account with zero broker commission deductions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
