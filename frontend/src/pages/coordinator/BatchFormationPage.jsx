import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { requirementsApi } from '../../api/requirements';
import { batchesApi } from '../../api/batches';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorAlert } from '../../components/ui/ErrorAlert';
import { Layers, Play, CheckCircle2, ArrowRight } from 'lucide-react';

export const BatchFormationPage = () => {
  const [selectedReqId, setSelectedReqId] = useState('1');
  const [forming, setForming] = useState(false);
  const [batchResult, setBatchResult] = useState(null);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const { data: requirements, isLoading } = useQuery({
    queryKey: ['requirements', 'active'],
    queryFn: async () => {
      const res = await requirementsApi.getActive();
      return res.data;
    },
  });

  const handleFormBatch = async () => {
    setForming(true);
    setError('');

    try {
      const res = await batchesApi.formBatch(selectedReqId);
      setBatchResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to form cooperative batch');
    } finally {
      setForming(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-6 space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h1 className="text-2xl font-black text-gray-900">Dynamic Cooperative Batch Formation</h1>
        <p className="text-xs text-gray-500 mt-1">
          Executes greedy compatibility clustering against verified lots (crop match, moisture check pass, price overlap, harvest window, Haversine distance).
        </p>
      </div>

      <ErrorAlert message={error} onClose={() => setError('')} />

      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <Layers className="w-5 h-5 text-purple-600" /> Select Target Institutional Demand
        </h2>

        {isLoading ? (
          <LoadingSpinner text="Loading active buyer requirements..." />
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Active Buyer Requirements
              </label>
              <select
                value={selectedReqId}
                onChange={(e) => setSelectedReqId(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-900 focus:ring-2 focus:ring-purple-500 focus:bg-white"
              >
                {requirements?.map((r) => (
                  <option key={r.id} value={r.id}>
                    Req #{r.id}: {r.buyerName} — {r.product.toUpperCase()} ({Number(r.quantityKg).toFixed(0)} kg at ₹{Number(r.priceMin).toFixed(0)}-₹{Number(r.priceMax).toFixed(0)}/kg)
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleFormBatch}
              disabled={forming}
              className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow transition flex items-center justify-center gap-2 text-sm"
            >
              {forming ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <Play className="w-4 h-4" />
              )}
              Run Greedy Compatibility Clustering
            </button>
          </div>
        )}
      </div>

      {batchResult && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Cooperative Batch Formed #{batchResult.id}</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Total Allocated: <strong className="text-green-700">{Number(batchResult.totalAllocatedQty).toFixed(1)} kg</strong> / {Number(batchResult.requiredQty).toFixed(1)} kg
              </p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold border border-green-300">
              {batchResult.isFullyAllocated ? 'Fully Fulfilled' : `Shortfall: ${Number(batchResult.shortfallQty).toFixed(1)} kg`}
            </span>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Matched Compatible Farmers</h4>
            {batchResult.members?.map((m) => (
              <div key={m.membershipId} className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between text-sm">
                <div>
                  <span className="font-bold text-gray-900">{m.farmerName}</span>
                  <span className="text-xs text-gray-500 block font-mono">{m.inclusionReason}</span>
                </div>
                <div className="text-right">
                  <span className="font-black text-green-700 block">{Number(m.allocatedQty).toFixed(1)} kg</span>
                  <span className="text-[10px] text-gray-400">Verified: {Number(m.verifiedQty).toFixed(1)} kg</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={() => navigate(`/agreements/${batchResult.id}`)}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow transition flex items-center gap-2 text-sm"
            >
              Lock Agreement & Notify Farmers <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
