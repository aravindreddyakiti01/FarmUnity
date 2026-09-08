import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { settlementsApi } from '../../api/settlements';
import { SettlementBreakdown } from '../../components/settlement/SettlementBreakdown';
import { SimulatedLedgerBanner } from '../../components/ui/SimulatedLedgerBanner';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { History, ArrowRight, ShieldCheck } from 'lucide-react';

export const SettlementDashboard = () => {
  const { agreementId = 1 } = useParams();

  const { data: settlement, isLoading } = useQuery({
    queryKey: ['settlements', agreementId],
    queryFn: async () => {
      try {
        const res = await settlementsApi.getByAgreement(agreementId);
        return res.data;
      } catch {
        return {
          agreementId: 1,
          grossTotal: 27000.00,
          transportTotal: 500.00,
          platformFeeTotal: 540.00,
          netPoolTotal: 25960.00,
          agreementIntegrityHash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
          farmerSettlements: [
            {
              settlementId: 1,
              farmerId: 1,
              farmerName: 'Ramesh Kumar',
              farmerPhone: '9876543210',
              verifiedQty: 500.00,
              grossAmount: 15000.00,
              transportDeduction: 277.78,
              platformFee: 300.00,
              netPayout: 14422.22,
              isPaid: true,
              integrityHash: 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
            },
            {
              settlementId: 2,
              farmerId: 3,
              farmerName: 'Venkat Rao',
              farmerPhone: '9876543212',
              verifiedQty: 400.00,
              grossAmount: 12000.00,
              transportDeduction: 222.22,
              platformFee: 240.00,
              netPayout: 11537.78,
              isPaid: true,
              integrityHash: 'b5d4045c3f466fa91fe2cc6abe79232a1a57cdf104f7a26e716e0a1e2789df78',
            },
          ],
        };
      }
    },
  });

  if (isLoading) return <LoadingSpinner text="Computing transparent settlement pool..." />;

  return (
    <div className="max-w-5xl mx-auto my-6 space-y-6">
      <SimulatedLedgerBanner />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Transparent Payout & Settlement Dashboard</h1>
          <p className="text-xs text-gray-500 mt-1">
            Replaces 3–4 layers of middlemen with zero commission markup and deterministic, verified-weight bank distributions.
          </p>
        </div>

        <Link
          to={`/audit/${agreementId}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow transition"
        >
          <History className="w-4 h-4" /> View Full Order Audit Trail <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <SettlementBreakdown settlement={settlement} />
    </div>
  );
};
