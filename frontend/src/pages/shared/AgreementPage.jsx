import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { agreementsApi } from '../../api/agreements';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { SimulatedLedgerBanner } from '../../components/ui/SimulatedLedgerBanner';
import { FileCheck, Shield, Lock, ArrowRight, RefreshCw, Users } from 'lucide-react';

export const AgreementPage = () => {
  const { id = 1 } = useParams();
  const [amendmentOpen, setAmendmentOpen] = useState(false);
  const [newPrice, setNewPrice] = useState('30.50');
  const [reason, setReason] = useState('Adjusted price based on revised transportation and bagging terms.');
  const [submitting, setSubmitting] = useState(false);

  const { data: agreement, isLoading, refetch } = useQuery({
    queryKey: ['agreement', id],
    queryFn: async () => {
      try {
        const res = await agreementsApi.getById(id);
        return res.data;
      } catch {
        return {
          id: 1,
          version: 1,
          status: 'LOCKED_V1',
          agreedPricePerKg: 30.00,
          totalValueGross: 27000.00,
          buyerName: 'Bangalore Central Hostel Network',
          product: 'paddy',
          integrityHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          members: [
            { membershipId: 1, farmerName: 'Ramesh Kumar', allocatedQty: 500.0, farmerDecision: 'ACCEPTED' },
            { membershipId: 2, farmerName: 'Venkat Rao', allocatedQty: 400.0, farmerDecision: 'ACCEPTED' },
          ],
        };
      }
    },
  });

  const handleProposeAmendment = async () => {
    setSubmitting(true);
    try {
      await agreementsApi.proposeAmendment(id, {
        newPricePerKg: parseFloat(newPrice),
        reason,
      });
      setAmendmentOpen(false);
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to propose amendment');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <LoadingSpinner text="Loading agreement..." />;

  const isLocked = agreement?.status === 'LOCKED_V1' || agreement?.status === 'LOCKED_V2';

  return (
    <div className="max-w-4xl mx-auto my-6 space-y-6">
      <SimulatedLedgerBanner />

      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-gray-900">Multi-Party Collective Agreement</h1>
            <span className="text-xs bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded font-mono font-bold">
              Version {agreement?.version || 1}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Optimistic concurrency locked agreement with all participating farmers and the institutional buyer.
          </p>
        </div>
        <StatusBadge status={agreement?.status || 'LOCKED_V1'} />
      </div>

      {/* Contract Details Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
            <span className="text-xs text-gray-500 block">Agreed Price</span>
            <span className="text-lg font-black text-emerald-800">₹{Number(agreement?.agreedPricePerKg || 30.00).toFixed(2)} / kg</span>
          </div>
          <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
            <span className="text-xs text-gray-500 block">Total Contract Value</span>
            <span className="text-lg font-black text-gray-900">₹{Number(agreement?.totalValueGross || 27000).toFixed(2)}</span>
          </div>
          <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
            <span className="text-xs text-gray-500 block">Product</span>
            <span className="text-lg font-bold text-gray-900 capitalize">{agreement?.product || 'Paddy'}</span>
          </div>
          <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
            <span className="text-xs text-gray-500 block">Institutional Buyer</span>
            <span className="text-sm font-bold text-blue-700 block truncate">{agreement?.buyerName || 'Bangalore Hostel'}</span>
          </div>
        </div>

        {agreement?.integrityHash && (
          <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600 flex-shrink-0" />
              <div>
                <span className="text-xs font-bold text-purple-900 block">Agreement Integrity Proof (SHA-256)</span>
                <span className="text-[11px] font-mono text-purple-700 block truncate max-w-xl">{agreement.integrityHash}</span>
              </div>
            </div>
            <span className="text-xs bg-purple-200 text-purple-900 px-2 py-0.5 rounded font-bold uppercase">Immutable</span>
          </div>
        )}

        {/* Member Approvals */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-green-600" /> Participating Farmer Sign-offs
          </h3>
          <div className="space-y-2">
            {agreement?.members?.map((m) => (
              <div key={m.membershipId} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between text-sm">
                <span className="font-bold text-gray-900">{m.farmerName}</span>
                <span className="font-semibold text-gray-600">{Number(m.allocatedQty).toFixed(1)} kg</span>
                <StatusBadge status={m.farmerDecision || 'ACCEPTED'} />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setAmendmentOpen(true)}
            className="px-4 py-2 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Propose Amendment (Creates Version {((agreement?.version || 1) + 1)})
          </button>

          <Link
            to={`/commitments/${agreement?.id || 1}`}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow transition flex items-center gap-2 text-sm"
          >
            View Commitment Ledger <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <ConfirmModal
        isOpen={amendmentOpen}
        title={`Propose Amendment (Creates Version ${(agreement?.version || 1) + 1})`}
        message={`Proposing an amendment will unlock this agreement and require fresh approval from all participating farmers.`}
        confirmText="Propose New Version"
        isLoading={submitting}
        onConfirm={handleProposeAmendment}
        onCancel={() => setAmendmentOpen(false)}
      />
    </div>
  );
};
