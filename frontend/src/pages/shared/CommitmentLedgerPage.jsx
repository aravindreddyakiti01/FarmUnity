import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { commitmentsApi } from '../../api/commitments';
import { SimulatedLedgerBanner } from '../../components/ui/SimulatedLedgerBanner';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { ShieldAlert, CheckCircle, Clock, Truck, CheckCheck, ArrowRight } from 'lucide-react';

export const CommitmentLedgerPage = () => {
  const { id = 1 } = useParams();
  const [funding, setFunding] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: ledger, isLoading, refetch } = useQuery({
    queryKey: ['commitment', id],
    queryFn: async () => {
      try {
        const res = await commitmentsApi.getByAgreementId(id);
        return res.data;
      } catch {
        return {
          id: 1,
          agreementId: 1,
          buyerName: 'Bangalore Central Hostel Network',
          committedAmount: 27000.00,
          status: 'FUNDED',
          deadline: '2024-10-25T18:00:00',
          fundedAt: '2024-10-18T10:30:00',
        };
      }
    },
  });

  const handleFundCommitment = async () => {
    setFunding(true);
    try {
      await commitmentsApi.fund(ledger?.id || 1);
      setModalOpen(false);
      refetch();
      alert('Simulated commitment deposit funded!');
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Funded simulated commitment');
      setModalOpen(false);
    } finally {
      setFunding(false);
    }
  };

  if (isLoading) return <LoadingSpinner text="Loading commitment ledger..." />;

  const steps = [
    { title: 'PENDING', desc: 'Order initialized', icon: Clock },
    { title: 'FUNDED', desc: 'Simulated deposit committed', icon: CheckCircle },
    { title: 'PICKUP_VERIFIED', desc: 'Farm-gate collection verified', icon: Truck },
    { title: 'DELIVERED', desc: 'Institutional receipt confirmed', icon: CheckCheck },
    { title: 'RELEASED', desc: 'Settlement pool released to farmers', icon: CheckCircle },
  ];

  const currentStepIdx = steps.findIndex(s => s.title === (ledger?.status || 'FUNDED'));

  return (
    <div className="max-w-4xl mx-auto my-6 space-y-6">
      <SimulatedLedgerBanner />

      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Protected Commitment Ledger</h1>
          <p className="text-xs text-gray-500 mt-1">
            Simulated escrow-style financial hold protecting the batch agreement commitments prior to pickup and delivery.
          </p>
        </div>
        <StatusBadge status={ledger?.status || 'FUNDED'} />
      </div>

      {/* Stepper Progression */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">Commitment State Machine Progression</h3>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx <= (currentStepIdx >= 0 ? currentStepIdx : 1);
            const isCurrent = idx === currentStepIdx;

            return (
              <div
                key={step.title}
                className={`p-3.5 rounded-xl border text-center transition ${
                  isCurrent
                    ? 'bg-green-50 border-green-600 text-green-900 shadow-xs'
                    : isCompleted
                    ? 'bg-gray-50 border-gray-300 text-gray-800'
                    : 'bg-white border-gray-100 text-gray-400 opacity-60'
                }`}
              >
                <Icon className={`w-5 h-5 mx-auto mb-1.5 ${isCompleted ? 'text-green-600' : 'text-gray-300'}`} />
                <span className="font-bold text-xs block">{step.title}</span>
                <span className="text-[10px] text-gray-500 block mt-0.5">{step.desc}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ledger Balance Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <span className="text-xs text-gray-500 block">Committed Deposit Value</span>
            <span className="text-2xl font-black text-gray-900 mt-1 block">₹{Number(ledger?.committedAmount || 27000).toFixed(2)}</span>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <span className="text-xs text-gray-500 block">Institutional Buyer</span>
            <span className="text-sm font-bold text-blue-700 mt-2 block">{ledger?.buyerName || 'Bangalore Central Hostel'}</span>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <span className="text-xs text-gray-500 block">Fulfillment Deadline</span>
            <span className="text-xs font-mono font-bold text-gray-800 mt-2 block">
              {ledger?.deadline ? new Date(ledger.deadline).toLocaleDateString() : '3 Days Window'}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
          {ledger?.status === 'PENDING' && (
            <button
              onClick={() => setModalOpen(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow transition text-sm"
            >
              Fund Simulated Commitment
            </button>
          )}

          <Link
            to={`/settlements/${ledger?.agreementId || 1}`}
            className="ml-auto px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow transition flex items-center gap-2 text-sm"
          >
            View Settlement Pool <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <ConfirmModal
        isOpen={modalOpen}
        title="Fund Simulated Commitment Deposit"
        message={`Lock ₹${Number(ledger?.committedAmount || 27000).toFixed(2)} in simulated platform escrow to protect the batch farmer commitments?`}
        confirmText="Confirm Simulated Funding"
        isLoading={funding}
        onConfirm={handleFundCommitment}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
};
