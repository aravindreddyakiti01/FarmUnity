import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { requirementsApi } from '../../api/requirements';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { SimulatedLedgerBanner } from '../../components/ui/SimulatedLedgerBanner';
import { 
  Building2, 
  PlusCircle, 
  ArrowRight, 
  Layers, 
  ShieldCheck, 
  Clock, 
  Truck,
  CheckCircle2,
  Coins
} from 'lucide-react';

export const BuyerDashboard = () => {
  const { data: requirements, isLoading } = useQuery({
    queryKey: ['requirements', 'my'],
    queryFn: async () => {
      const res = await requirementsApi.getMyRequirements();
      return res.data;
    },
  });

  const totalDemands = requirements?.length || 0;
  const totalVolumeKg = requirements?.reduce((sum, r) => sum + (r.quantityKg || 0), 0) || 0;

  return (
    <div className="space-y-8">
      <SimulatedLedgerBanner />

      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <Building2 className="w-3.5 h-3.5 text-blue-700" />
            <span>Institutional Procurement Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Procurement Demands & Cooperative Batches
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl leading-relaxed">
            Specify bulk staple grain demands. Our demand-driven pooling engine aggregates verified nearby smallholders into a single certified delivery.
          </p>
        </div>

        <Link
          to="/buyer/requirements/new"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold rounded-2xl shadow-sm hover:shadow transition shrink-0"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Post Bulk Demand</span>
        </Link>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 border border-blue-200/60">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-stone-900">{totalDemands}</div>
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wide">Active Demands</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-stone-900">{totalVolumeKg.toLocaleString()} kg</div>
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wide">Total Requisitioned Volume</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-700 border border-green-200/60">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-green-800">100% Escrow</div>
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wide">Protected Settlement</div>
          </div>
        </div>
      </div>

      {/* Main Demands Table */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-stone-900">Active Procurement Orders</h2>
            <p className="text-xs text-stone-500">Track cooperative formation, moisture verification, and delivery status.</p>
          </div>
          <span className="text-xs font-bold text-stone-400 bg-stone-100 px-3 py-1 rounded-full">
            {requirements?.length || 0} Demands
          </span>
        </div>

        {isLoading ? (
          <div className="py-12"><LoadingSpinner text="Retrieving institutional demands..." /></div>
        ) : requirements?.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-stone-200 rounded-2xl p-8">
            <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-3 text-stone-400">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-800">No procurement demands posted</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4">
              Post weekly or monthly institutional demand for paddy, wheat, pulses, or oilseeds.
            </p>
            <Link
              to="/buyer/requirements/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post First Bulk Requirement</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {requirements?.map((r) => (
              <div 
                key={r.id}
                className="p-5 rounded-2xl border border-stone-200 hover:border-stone-300 transition bg-stone-50/50 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="px-3 py-1 rounded-lg bg-blue-100 text-blue-900 text-xs font-black uppercase tracking-wider">
                      {r.product}
                    </span>
                    <span className="text-xs text-stone-500 font-medium">
                      {r.variety || 'Standard grade'}
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-700">
                      Req #{r.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-6 pt-1 text-xs text-stone-600 flex-wrap">
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">Required Weight</span>
                      <span className="font-black text-blue-900 text-sm">{Number(r.quantityKg).toLocaleString()} kg</span>
                    </div>

                    <div className="border-l border-stone-200 pl-4">
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">Moisture Band</span>
                      <span className="font-bold text-stone-800 text-sm">{r.moistureBandMin}% – {r.moistureBandMax}%</span>
                    </div>

                    <div className="border-l border-stone-200 pl-4">
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">Budget Range</span>
                      <span className="font-bold text-stone-900 text-sm">₹{Number(r.priceMin).toFixed(2)} – ₹{Number(r.priceMax).toFixed(2)} / kg</span>
                    </div>

                    <div className="border-l border-stone-200 pl-4">
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">Escrow Deposit</span>
                      <span className="font-bold text-amber-800 text-sm">₹{Number(r.commitmentDeposit || 0).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="pt-1 text-[11px] text-stone-500 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>Destination: <strong>{r.destination || 'Institutional Central Receiving Dock'}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 pt-2 lg:pt-0">
                  <Link
                    to={`/buyer/batches/${r.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold rounded-xl border border-blue-200 transition shadow-xs"
                  >
                    <Layers className="w-4 h-4" />
                    <span>View Matched Pool</span>
                  </Link>

                  <Link
                    to={`/agreements/1`}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-green-700 hover:bg-green-800 text-white text-xs font-bold rounded-xl transition shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>View Agreement</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
