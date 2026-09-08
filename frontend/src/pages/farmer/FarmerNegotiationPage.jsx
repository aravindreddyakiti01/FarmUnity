import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { agreementsApi } from '../../api/agreements';
import { useAuth } from '../../hooks/useAuth';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorAlert } from '../../components/ui/ErrorAlert';
import { CheckCircle2, XCircle, RefreshCcw, MinusCircle, AlertTriangle, WifiOff, Users, ArrowRight } from 'lucide-react';

export const FarmerNegotiationPage = () => {
  const { agreementId = 1 } = useParams();
  const { user } = useAuth();
  const isOnline = useOnlineStatus();
  const navigate = useNavigate();

  const [decisionType, setDecisionType] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [note, setNote] = useState('');
  const [revisedPrice, setRevisedPrice] = useState('');
  const [revisedQty, setRevisedQty] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { data: agreement, isLoading, refetch } = useQuery({
    queryKey: ['agreement', agreementId],
    queryFn: async () => {
      try {
        const res = await agreementsApi.getById(agreementId);
        return res.data;
      } catch {
        return null;
      }
    },
  });

  const handleOpenModal = (type) => {
    setDecisionType(type);
    setModalOpen(true);
  };

  const handleConfirmDecision = async () => {
    setSubmitting(true);
    setError('');

    try {
      await agreementsApi.submitFarmerDecision(agreementId, {
        decision: decisionType,
        note,
        requestedPrice: revisedPrice ? parseFloat(revisedPrice) : null,
        revisedQuantity: revisedQty ? parseFloat(revisedQty) : null,
      });

      setModalOpen(false);
      refetch();
      alert(`Decision "${decisionType}" submitted successfully!`);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit decision');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOnline) {
    return (
      <div className="max-w-2xl mx-auto my-12 bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
        <WifiOff className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-amber-900">Agreement Review Disabled Offline</h3>
        <p className="text-sm text-amber-800 mt-2">
          Reviewing and approving binding collective agreements requires an active internet connection to ensure synchronization across all cooperative batch members.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSpinner text="Loading shared agreement details..." />;
  }

  return (
    <div className="max-w-4xl mx-auto my-6 space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-gray-900">Shared Institutional Offer Review</h1>
            <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded font-mono font-bold">
              Version {agreement?.version || 1}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            All farmers in this candidate batch see the exact same transparent offer terms.
          </p>
        </div>
        <StatusBadge status={agreement?.status || 'PENDING_APPROVAL'} />
      </div>

      <ErrorAlert message={error} onClose={() => setError('')} />

      {/* Offer Summary Card */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-4">Contract Terms</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-white p-3.5 rounded-xl border border-emerald-100">
            <span className="text-xs text-gray-500 block">Bulk Buyer</span>
            <span className="font-extrabold text-gray-900 text-sm">{agreement?.buyerName || 'Bangalore Central Hostel'}</span>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-emerald-100">
            <span className="text-xs text-gray-500 block">Offered Price</span>
            <span className="font-extrabold text-emerald-800 text-base">₹{Number(agreement?.agreedPricePerKg || 30.00).toFixed(2)} / kg</span>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-emerald-100">
            <span className="text-xs text-gray-500 block">Total Batch Qty</span>
            <span className="font-extrabold text-gray-900 text-base">{Number(agreement?.totalValueGross ? (agreement.totalValueGross / agreement.agreedPricePerKg) : 900).toFixed(1)} kg</span>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-emerald-100">
            <span className="text-xs text-gray-500 block">Gross Pool Value</span>
            <span className="font-extrabold text-gray-900 text-base">₹{Number(agreement?.totalValueGross || 27000).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Batch Members Overview */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-green-600" /> Cooperative Batch Member Status
        </h3>

        <div className="space-y-3">
          {agreement?.members?.map((m) => (
            <div key={m.membershipId} className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100 text-sm">
              <div>
                <span className="font-bold text-gray-900">{m.farmerName}</span>
                <span className="text-xs text-gray-500 block">Allocated Contribution: {Number(m.allocatedQty).toFixed(1)} kg ({m.inclusionReason})</span>
              </div>
              <div>
                <StatusBadge status={m.farmerDecision || 'PENDING'} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons for Farmer */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Your Decision on Version {agreement?.version || 1}</h3>
        <p className="text-xs text-gray-500">
          The agreement will lock automatically into Version {agreement?.version || 1} as soon as all included batch members approve.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <button
            type="button"
            onClick={() => handleOpenModal('ACCEPTED')}
            className="py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow transition flex items-center justify-center gap-2 text-sm"
          >
            <CheckCircle2 className="w-4 h-4" /> Accept Terms
          </button>

          <button
            type="button"
            onClick={() => handleOpenModal('REVISED')}
            className="py-3 px-4 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-bold rounded-xl transition flex items-center justify-center gap-2 text-sm"
          >
            <RefreshCcw className="w-4 h-4" /> Request Revision
          </button>

          <button
            type="button"
            onClick={() => handleOpenModal('REDUCED')}
            className="py-3 px-4 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300 font-bold rounded-xl transition flex items-center justify-center gap-2 text-sm"
          >
            <MinusCircle className="w-4 h-4" /> Reduce Qty
          </button>

          <button
            type="button"
            onClick={() => handleOpenModal('REJECTED')}
            className="py-3 px-4 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold rounded-xl transition flex items-center justify-center gap-2 text-sm"
          >
            <XCircle className="w-4 h-4" /> Reject Offer
          </button>
        </div>
      </div>

      {/* Verification Modal for Irreversible / Contractual Decision */}
      <ConfirmModal
        isOpen={modalOpen}
        title={`Confirm Decision: ${decisionType}`}
        message={`Are you sure you want to submit your decision as "${decisionType}" for Agreement Version ${agreement?.version || 1}?`}
        confirmText="Submit Binding Decision"
        isDestructive={decisionType === 'REJECTED'}
        isLoading={submitting}
        onConfirm={handleConfirmDecision}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
};
