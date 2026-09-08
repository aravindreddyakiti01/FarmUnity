import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { listingsApi } from '../../api/listings';
import { verificationApi } from '../../api/verification';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { MoistureCheckBadge } from '../../components/verification/MoistureCheckBadge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorAlert } from '../../components/ui/ErrorAlert';
import { UserCheck, Droplet, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

export const VerificationPage = () => {
  const [selectedListing, setSelectedListing] = useState(null);
  const [verifiedQty, setVerifiedQty] = useState('');
  const [moistureReading, setMoistureReading] = useState('');
  const [evidenceNotes, setEvidenceNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [error, setError] = useState('');

  const { data: pendingListings, isLoading, refetch } = useQuery({
    queryKey: ['listings', 'pending'],
    queryFn: async () => {
      const res = await listingsApi.getPendingListings();
      return res.data;
    },
  });

  const handleSelectListing = (listing) => {
    setSelectedListing(listing);
    setVerifiedQty(listing.declaredQty);
    setMoistureReading(listing.moistureReading || '13.2');
    setEvidenceNotes(`Physical on-site inspection for ${listing.farmerName}. Sample tested on calibrated moisture meter.`);
    setVerificationResult(null);
    setError('');
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!selectedListing) return;

    setSubmitting(true);
    setError('');

    try {
      const res = await verificationApi.verify(selectedListing.id, {
        verifiedQty: parseFloat(verifiedQty),
        moistureReading: parseFloat(moistureReading),
        evidenceNotes,
        photoUrls: 'https://images.unsplash.com/photo-1586201375761-83865001e31c',
      });

      setVerificationResult(res.data);
      refetch();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Verification failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto my-6 space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h1 className="text-2xl font-black text-gray-900">Deterministic Quality & Moisture Verification</h1>
        <p className="text-xs text-gray-500 mt-1">
          Hard numeric band check (12.0% – 14.0% for paddy). Incompatible lots are strictly excluded from pooling and routed to drying review.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Queue */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-purple-600" /> Pending Verification Queue
          </h2>

          {isLoading ? (
            <LoadingSpinner text="Fetching pending inspections..." />
          ) : pendingListings?.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <CheckCircle className="w-10 h-10 mx-auto mb-2 text-green-500" />
              <p className="font-semibold text-gray-700">All listings inspected!</p>
              <p className="text-xs text-gray-400 mt-1">No pending inspection requests in queue.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingListings?.map((l) => (
                <div
                  key={l.id}
                  onClick={() => handleSelectListing(l)}
                  className={`p-4 rounded-xl border transition cursor-pointer ${
                    selectedListing?.id === l.id
                      ? 'border-green-600 bg-green-50 shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-gray-900">{l.farmerName}</span>
                      <span className="text-xs text-gray-500 block capitalize">{l.crop} ({l.variety || 'Standard'})</span>
                    </div>
                    <StatusBadge status={l.status} />
                  </div>
                  <div className="mt-2 text-xs flex justify-between text-gray-600">
                    <span>Declared: <strong>{Number(l.declaredQty).toFixed(1)} kg</strong></span>
                    <span>Floor: <strong>₹{Number(l.minPricePerKg).toFixed(2)}/kg</strong></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Verification Form */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Droplet className="w-5 h-5 text-blue-600" /> Inspection Workbench
          </h2>

          <ErrorAlert message={error} onClose={() => setError('')} />

          {selectedListing ? (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs">
                <span className="text-gray-500 block">Inspecting Lot For:</span>
                <span className="font-bold text-gray-900 text-sm">{selectedListing.farmerName} — {selectedListing.crop}</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Verified Physical Quantity (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={verifiedQty}
                  onChange={(e) => setVerifiedQty(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 font-bold focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Moisture Meter Reading (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={moistureReading}
                  onChange={(e) => setMoistureReading(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-bold text-blue-700 focus:ring-2 focus:ring-green-500"
                />
                <div className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                  <span>Standard Acceptance Band: <strong>12.0% – 14.0%</strong></span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Inspection Notes & Calibration Evidence
                </label>
                <textarea
                  rows="2"
                  value={evidenceNotes}
                  onChange={(e) => setEvidenceNotes(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 focus:ring-2 focus:ring-green-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow transition flex items-center justify-center gap-2 text-sm"
              >
                {submitting && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                Record Official Inspection Result
              </button>
            </form>
          ) : (
            <div className="text-center py-12 text-gray-400">
              Select a pending listing from the queue on the left to start quality verification.
            </div>
          )}

          {/* Inspection Result Callout */}
          {verificationResult && (
            <div className={`mt-4 p-4 rounded-xl border ${
              verificationResult.isCompatible
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-red-50 border-red-300 text-red-900'
            }`}>
              <div className="flex items-center gap-2 font-bold text-sm">
                {verificationResult.isCompatible ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span>PASSED: Marked VERIFIED_COMPATIBLE (Eligible for Pooling)</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <span>FAILED MOISTURE BAND: Routed to DRYING_REVIEW (Excluded from Pool)</span>
                  </>
                )}
              </div>
              <p className="text-xs mt-1 opacity-90">{verificationResult.evidenceNotes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
