import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { listingsApi } from '../../api/listings';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { MoistureCheckBadge } from '../../components/verification/MoistureCheckBadge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Sprout, PlusCircle, ArrowUpRight, Scale, Clock } from 'lucide-react';

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
      alert(err.response?.data?.message || 'Failed to submit');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Farmer Produce Supply Hub</h1>
          <p className="text-xs text-gray-500 mt-1">
            List your harvest, request quality verification, and approve collective institutional bulk offers.
          </p>
        </div>
        <Link
          to="/farmer/listings/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl shadow transition"
        >
          <PlusCircle className="w-4 h-4" /> Add Produce Listing
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Sprout className="w-5 h-5 text-green-600" /> My Active Produce Lots
        </h2>

        {isLoading ? (
          <LoadingSpinner text="Loading your listings..." />
        ) : listings?.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Sprout className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p className="font-semibold text-gray-600">No produce listings found.</p>
            <p className="text-xs text-gray-400 mt-1">Add your paddy, wheat, pulses, or oilseed crop to begin.</p>
            <Link
              to="/farmer/listings/new"
              className="inline-block mt-4 text-xs font-bold text-green-600 hover:underline"
            >
              + Create your first listing
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-3">Crop & Variety</th>
                  <th className="px-4 py-3">Declared Qty</th>
                  <th className="px-4 py-3">Verified Qty</th>
                  <th className="px-4 py-3">Moisture Status</th>
                  <th className="px-4 py-3">Min Floor Price</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {listings?.map((l) => (
                  <tr key={l.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="font-bold text-gray-900 capitalize">{l.crop}</div>
                      <div className="text-xs text-gray-500">{l.variety || 'Standard grade'}</div>
                    </td>
                    <td className="px-4 py-4 font-semibold text-gray-700">
                      {Number(l.declaredQty).toFixed(1)} kg
                      <span className="block text-[10px] text-gray-400 uppercase font-bold">Declared</span>
                    </td>
                    <td className="px-4 py-4">
                      {l.verifiedQty ? (
                        <span className="font-black text-green-700">
                          {Number(l.verifiedQty).toFixed(1)} kg
                          <span className="block text-[10px] text-green-600 font-bold uppercase">Verified Official</span>
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Pending Inspection</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <MoistureCheckBadge moisture={l.moistureReading} />
                    </td>
                    <td className="px-4 py-4 font-bold text-gray-900">
                      ₹{Number(l.minPricePerKg).toFixed(2)} / kg
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={l.status} />
                    </td>
                    <td className="px-4 py-4 text-right">
                      {l.status === 'DRAFT' && (
                        <button
                          onClick={() => handleSubmitForVerification(l.id)}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg border border-blue-200 transition"
                        >
                          Request Inspection
                        </button>
                      )}
                      {l.status === 'IN_BATCH' && (
                        <Link
                          to={`/farmer/negotiate/1`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-300 transition"
                        >
                          Review Shared Offer <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
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
