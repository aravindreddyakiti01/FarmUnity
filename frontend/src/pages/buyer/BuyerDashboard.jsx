import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { requirementsApi } from '../../api/requirements';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { SimulatedLedgerBanner } from '../../components/ui/SimulatedLedgerBanner';
import { Building2, PlusCircle, ArrowUpRight, Layers } from 'lucide-react';

export const BuyerDashboard = () => {
  const { data: requirements, isLoading } = useQuery({
    queryKey: ['requirements', 'my'],
    queryFn: async () => {
      const res = await requirementsApi.getMyRequirements();
      return res.data;
    },
  });

  return (
    <div className="space-y-6">
      <SimulatedLedgerBanner />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Institutional Procurement Hub</h1>
          <p className="text-xs text-gray-500 mt-1">
            Post bulk staple requirements (paddy/rice, wheat, pulses), review matched farmer batches, and track delivery.
          </p>
        </div>
        <Link
          to="/buyer/requirements/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow transition"
        >
          <PlusCircle className="w-4 h-4" /> Post Bulk Requirement
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-600" /> Active Procurement Demands
        </h2>

        {isLoading ? (
          <LoadingSpinner text="Loading requirements..." />
        ) : requirements?.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Building2 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p className="font-semibold text-gray-600">No active requirements posted.</p>
            <p className="text-xs text-gray-400 mt-1">Post your institution's weekly or monthly demand to match with aggregated farmer pools.</p>
            <Link
              to="/buyer/requirements/new"
              className="inline-block mt-4 text-xs font-bold text-blue-600 hover:underline"
            >
              + Post Requirement
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Required Qty</th>
                  <th className="px-4 py-3">Moisture Band</th>
                  <th className="px-4 py-3">Budget Range</th>
                  <th className="px-4 py-3">Simulated Deposit</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requirements?.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="font-bold text-gray-900 capitalize">{r.product}</div>
                      <div className="text-xs text-gray-500">{r.variety || 'Any standard variety'}</div>
                    </td>
                    <td className="px-4 py-4 font-black text-blue-700">
                      {Number(r.quantityKg).toFixed(1)} kg
                    </td>
                    <td className="px-4 py-4 text-xs font-semibold text-gray-600">
                      {Number(r.moistureBandMin).toFixed(1)}% – {Number(r.moistureBandMax).toFixed(1)}%
                    </td>
                    <td className="px-4 py-4 font-bold text-gray-900">
                      ₹{Number(r.priceMin).toFixed(2)} – ₹{Number(r.priceMax).toFixed(2)} / kg
                    </td>
                    <td className="px-4 py-4 text-xs font-semibold text-amber-700">
                      ₹{Number(r.commitmentDeposit || 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-4 text-right space-x-2">
                      <Link
                        to={`/buyer/batches/${r.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg border border-blue-200 transition"
                      >
                        <Layers className="w-3.5 h-3.5" /> View Matched Batch
                      </Link>
                      <Link
                        to={`/buyer/delivery/1`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-bold rounded-lg border border-green-200 transition"
                      >
                        Confirm Delivery <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
