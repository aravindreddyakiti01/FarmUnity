import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { millingApi } from '../../api/milling';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorAlert } from '../../components/ui/ErrorAlert';
import { Factory, AlertTriangle, CheckCircle2, Play, ArrowRight } from 'lucide-react';

export const MillingPage = () => {
  const [agreementId, setAgreementId] = useState('1');
  const [processorId, setProcessorId] = useState('1');
  const [rawInputQty, setRawInputQty] = useState('600');
  const [actualOutputQty, setActualOutputQty] = useState('390');
  const [creating, setCreating] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [activeWorkOrder, setActiveWorkOrder] = useState(null);
  const [error, setError] = useState('');

  const { data: processors } = useQuery({
    queryKey: ['processors'],
    queryFn: async () => {
      const res = await millingApi.getAllProcessors();
      return res.data;
    },
  });

  const handleCreateWorkOrder = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError('');

    try {
      const res = await millingApi.createWorkOrder({
        agreementId: parseInt(agreementId),
        processorId: parseInt(processorId),
        rawInputQty: parseFloat(rawInputQty),
      });
      setActiveWorkOrder(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create work order');
    } finally {
      setCreating(false);
    }
  };

  const handleCompleteWorkOrder = async (e) => {
    e.preventDefault();
    if (!activeWorkOrder) return;

    setCompleting(true);
    setError('');

    try {
      const res = await millingApi.completeWorkOrder(activeWorkOrder.id, {
        actualOutputQty: parseFloat(actualOutputQty),
        notes: 'Milling cycle completed. Intake weighed and yield verified.',
      });
      setActiveWorkOrder(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to complete work order');
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-6 space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h1 className="text-2xl font-black text-gray-900">Staple Processing & Milling Oversight</h1>
        <p className="text-xs text-gray-500 mt-1">
          Coordinate paddy→rice conversion, compare actual yield ratio against benchmark (65.0%), and apply processor ledger adjustments for shortfalls.
        </p>
      </div>

      <ErrorAlert message={error} onClose={() => setError('')} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Work Order Creator */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Factory className="w-5 h-5 text-purple-600" /> 1. Issue Milling Work Order
          </h2>

          <form onSubmit={handleCreateWorkOrder} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Select Rice Miller (Processor)
              </label>
              <select
                value={processorId}
                onChange={(e) => setProcessorId(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 font-semibold focus:ring-2 focus:ring-purple-500"
              >
                {processors?.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Fee: ₹{Number(p.feePerKg).toFixed(2)}/kg)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Raw Paddy Input Qty (kg)
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={rawInputQty}
                onChange={(e) => setRawInputQty(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-900 focus:ring-2 focus:ring-purple-500"
              />
              <span className="text-[10px] text-gray-500 block mt-0.5">Expected yield ratio benchmark: 65.0%</span>
            </div>

            <button
              type="submit"
              disabled={creating}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow transition flex items-center justify-center gap-2 text-sm"
            >
              {creating && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
              Issue Processing Order
            </button>
          </form>
        </div>

        {/* Completion and Yield Verification */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" /> 2. Record Output & Verify Yield
          </h2>

          {activeWorkOrder ? (
            <form onSubmit={handleCompleteWorkOrder} className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs">
                <span className="text-gray-500 block">Work Order #{activeWorkOrder.id} Active</span>
                <span className="font-bold text-gray-900">Miller: {activeWorkOrder.processorName}</span>
                <span className="text-gray-500 block">Raw Input: {Number(activeWorkOrder.rawInputQty).toFixed(1)} kg</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Actual Processed Output (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={actualOutputQty}
                  onChange={(e) => setActualOutputQty(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-black text-green-700 focus:ring-2 focus:ring-green-500"
                />
                <span className="text-[10px] text-gray-500 block mt-0.5">Try entering 390 kg for 65.0% (Pass) or 340 kg for 56.6% (Shortfall Flag)</span>
              </div>

              <button
                type="submit"
                disabled={completing || activeWorkOrder.status === 'COMPLETED'}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow transition flex items-center justify-center gap-2 text-sm"
              >
                {completing && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                Calculate Yield & Complete
              </button>
            </form>
          ) : (
            <div className="text-center py-12 text-gray-400">
              Issue a work order first on the left to track milling yield.
            </div>
          )}

          {/* Yield Shortfall Notification */}
          {activeWorkOrder?.status && (
            <div className={`p-4 rounded-xl border ${
              activeWorkOrder.flaggedForReview
                ? 'bg-red-50 border-red-300 text-red-900'
                : 'bg-emerald-50 border-emerald-300 text-emerald-900'
            }`}>
              <div className="flex items-center gap-2 font-bold text-sm">
                {activeWorkOrder.flaggedForReview ? (
                  <>
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <span>YIELD SHORTFALL FLAGGED</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>MILLING YIELD MEETS BENCHMARK</span>
                  </>
                )}
              </div>
              <div className="text-xs mt-2 space-y-1">
                <div>Expected Ratio: <strong>{(Number(activeWorkOrder.expectedYieldRatio) * 100).toFixed(1)}%</strong></div>
                <div>Actual Ratio: <strong>{(Number(activeWorkOrder.actualYieldRatio || 0) * 100).toFixed(1)}%</strong></div>
                {activeWorkOrder.flagReason && (
                  <div className="text-red-700 font-semibold">{activeWorkOrder.flagReason}</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
