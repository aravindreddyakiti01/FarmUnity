import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deliveryApi } from '../../api/delivery';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { ErrorAlert } from '../../components/ui/ErrorAlert';
import { SimulatedLedgerBanner } from '../../components/ui/SimulatedLedgerBanner';
import { CheckCircle2, Star, Truck, AlertTriangle } from 'lucide-react';

export const DeliveryConfirmationPage = () => {
  const { agreementId = 1 } = useParams();
  const navigate = useNavigate();

  const [receivedQty, setReceivedQty] = useState('600');
  const [qualityRating, setQualityRating] = useState(5);
  const [notes, setNotes] = useState('High quality paddy delivered directly to institution kitchen in dry, clean jute bags.');
  const [discrepancyDetails, setDiscrepancyDetails] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleConfirmSubmit = async () => {
    setSubmitting(true);
    setError('');

    try {
      await deliveryApi.confirmDelivery(agreementId, {
        receivedQty: parseFloat(receivedQty),
        qualityRating,
        notes,
        discrepancyDetails,
      });

      setModalOpen(false);
      navigate(`/settlements/${agreementId}`);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Delivery confirmation failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-6 space-y-6">
      <SimulatedLedgerBanner />

      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-6">
          <div className="p-3 bg-green-100 text-green-700 rounded-xl">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900">Institutional Delivery Confirmation</h2>
            <p className="text-xs text-gray-500 mt-0.5">Agreement #{agreementId} · Structured intake verification</p>
          </div>
        </div>

        <ErrorAlert message={error} onClose={() => setError('')} />

        <form onSubmit={(e) => { e.preventDefault(); setModalOpen(true); }} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Actual Received Quantity (kg)
            </label>
            <input
              type="number"
              step="0.1"
              required
              value={receivedQty}
              onChange={(e) => setReceivedQty(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-black text-gray-900 focus:ring-2 focus:ring-green-500 focus:bg-white"
            />
            <span className="text-[10px] text-gray-400 block mt-0.5">Submitting will trigger pro-rata net farmer pool settlement</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Quality Assessment Rating (1 to 5 Stars)
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setQualityRating(star)}
                  className={`p-2 rounded-lg transition ${
                    qualityRating >= star ? 'text-amber-500 bg-amber-50' : 'text-gray-300 hover:text-gray-400'
                  }`}
                >
                  <Star className="w-6 h-6 fill-current" />
                </button>
              ))}
              <span className="text-sm font-bold text-gray-700 ml-2">{qualityRating} / 5 Stars</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Intake Notes & Warehouse Feedback
            </label>
            <textarea
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 font-medium focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Any Discrepancy or Loss Report (Optional)
            </label>
            <input
              type="text"
              value={discrepancyDetails}
              onChange={(e) => setDiscrepancyDetails(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 font-medium focus:ring-2 focus:ring-green-500"
              placeholder="e.g. None — bags intact and weight verified"
            />
          </div>

          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Irreversible Action:</strong> Submitting this delivery confirmation will automatically compute and freeze the transparent farmer payout settlement ledger.
            </span>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow transition flex items-center gap-2 text-sm"
            >
              <CheckCircle2 className="w-4 h-4" /> Confirm Delivery & Trigger Settlement
            </button>
          </div>
        </form>
      </div>

      <ConfirmModal
        isOpen={modalOpen}
        title="Confirm Institutional Delivery Intake"
        message={`Are you sure you want to verify receipt of ${receivedQty} kg produce? This will release the simulated commitment ledger and compute individual farmer settlements.`}
        confirmText="Confirm & Release Settlement"
        isLoading={submitting}
        onConfirm={handleConfirmSubmit}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
};
