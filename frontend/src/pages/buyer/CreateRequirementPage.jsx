import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requirementsApi } from '../../api/requirements';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { useDraftQueue } from '../../hooks/useDraftQueue';
import { ErrorAlert } from '../../components/ui/ErrorAlert';
import { SimulatedLedgerBanner } from '../../components/ui/SimulatedLedgerBanner';
import { 
  Building2, 
  Save, 
  WifiOff, 
  ArrowLeft, 
  Scale, 
  Warehouse, 
  Factory, 
  ShieldCheck,
  Info
} from 'lucide-react';

export const CreateRequirementPage = () => {
  const [product, setProduct] = useState('paddy');
  const [variety, setVariety] = useState('Sona Masoori');
  const [quantityKg, setQuantityKg] = useState('5000');
  const [moistureBandMin, setMoistureBandMin] = useState('12.0');
  const [moistureBandMax, setMoistureBandMax] = useState('14.0');
  const [priceMin, setPriceMin] = useState('27.00');
  const [priceMax, setPriceMax] = useState('31.00');
  const [deliveryWindowStart, setDeliveryWindowStart] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [deliveryWindowEnd, setDeliveryWindowEnd] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [destination, setDestination] = useState('Central Receiving Godown, Bengaluru Rural');
  const [processingRequirement, setProcessingRequirement] = useState('MILLING_REQUIRED');
  const [storagePreference, setStoragePreference] = useState('COORDINATOR_HUB');
  const [commitmentDeposit, setCommitmentDeposit] = useState('5000');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isOnline = useOnlineStatus();
  const { saveDraftRequirement } = useDraftQueue();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      product,
      variety,
      quantityKg: parseFloat(quantityKg),
      moistureBandMin: parseFloat(moistureBandMin),
      moistureBandMax: parseFloat(moistureBandMax),
      priceMin: parseFloat(priceMin),
      priceMax: parseFloat(priceMax),
      deliveryWindowStart,
      deliveryWindowEnd,
      destination: `${destination} [Storage: ${storagePreference}, Processing: ${processingRequirement}]`,
      commitmentDeposit: parseFloat(commitmentDeposit),
    };

    try {
      if (!isOnline) {
        await saveDraftRequirement(payload);
        alert('Requirement saved locally in offline queue! Will sync when connection returns.');
        navigate('/buyer');
      } else {
        await requirementsApi.create(payload);
        navigate('/buyer');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to post requirement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-6 space-y-6">
      <SimulatedLedgerBanner />

      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/buyer')}
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-stone-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Procurement Demands</span>
        </button>

        {!isOnline && (
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full font-bold">
            <WifiOff className="w-3.5 h-3.5" /> Offline Draft Mode
          </span>
        )}
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200 mb-2">
            <Building2 className="w-3.5 h-3.5 text-blue-700" />
            <span>Demand Requisition Wizard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900">Post Institutional Demand</h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Specify bulk quantity and quality parameters. FarmUnity aggregates verified local smallholders to fulfill your order.
          </p>
        </div>

        <ErrorAlert message={error} onClose={() => setError('')} />

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Staple Product
              </label>
              <select
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 font-semibold focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
              >
                <option value="paddy">Paddy / Rice</option>
                <option value="wheat">Wheat / Atta</option>
                <option value="maize">Maize / Corn</option>
                <option value="pulses">Pulses (Toor / Moong)</option>
                <option value="oilseeds">Oilseeds (Mustard / Soy)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Target Variety / Grade
              </label>
              <input
                type="text"
                required
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 font-semibold focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                placeholder="e.g. Sona Masoori, Grade A"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Total Required Quantity (kg)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="100"
                  min="200"
                  required
                  value={quantityKg}
                  onChange={(e) => setQuantityKg(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-stone-300 rounded-xl text-lg font-black text-stone-900 focus:ring-2 focus:ring-blue-600 transition"
                  placeholder="5000"
                />
                <span className="absolute right-3 top-2.5 text-xs font-bold text-stone-400">KG</span>
              </div>
              <span className="text-[11px] text-stone-500 block mt-1.5 font-medium">
                = {(Number(quantityKg || 0) / 1000).toFixed(1)} Metric Tonnes
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200/80">
              <label className="block text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">
                Acceptable Price Range (₹/kg)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.5"
                  required
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-blue-300 rounded-xl text-sm font-black text-blue-900 text-center"
                  placeholder="27.00"
                />
                <span className="text-blue-400 font-bold">to</span>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-blue-300 rounded-xl text-sm font-black text-blue-900 text-center"
                  placeholder="31.00"
                />
              </div>
              <span className="text-[11px] text-blue-700 block mt-1.5 font-medium">
                Threshold pricing finds overlap with farmer minimums
              </span>
            </div>
          </div>

          {/* Quality Band & Processing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Moisture Content Acceptance Band (%)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  value={moistureBandMin}
                  onChange={(e) => setMoistureBandMin(e.target.value)}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 text-center font-bold"
                />
                <span className="text-stone-400 font-bold">% to</span>
                <input
                  type="number"
                  step="0.1"
                  value={moistureBandMax}
                  onChange={(e) => setMoistureBandMax(e.target.value)}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 text-center font-bold"
                />
                <span className="text-stone-400 font-bold">%</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Processing / Milling Requirement
              </label>
              <select
                value={processingRequirement}
                onChange={(e) => setProcessingRequirement(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 font-semibold focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
              >
                <option value="NO_PROCESSING">Raw Harvest (Direct Dispatch)</option>
                <option value="MILLING_REQUIRED">Requires Processing (e.g. Paddy to Rice Mill)</option>
                <option value="CLEANING_GRADING">Cleaning &amp; Grading Only</option>
              </select>
            </div>
          </div>

          {/* Storage Management (Section 15 & 31) */}
          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2">
            <div className="flex items-center gap-2">
              <Warehouse className="w-4 h-4 text-amber-800" />
              <label className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Buffer Storage Contingency Plan
              </label>
            </div>
            <p className="text-[11px] text-amber-800 leading-tight">
              If transport, milling or weather delays pickup, what is the planned storage arrangement?
            </p>
            <select
              value={storagePreference}
              onChange={(e) => setStoragePreference(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-amber-300 rounded-xl text-xs text-stone-900 font-semibold focus:ring-2 focus:ring-amber-500 transition"
            >
              <option value="COORDINATOR_HUB">FarmUnity Local Coordinator Godown (Recommended)</option>
              <option value="BUYER_RECEIVING">Buyer Receiving Dock / Warehouse Ready</option>
              <option value="THIRD_PARTY_STORAGE">Certified Third-Party Rural Godown</option>
              <option value="NO_STORAGE_DIRECT">Direct Farm-Gate to Receiving Dock (Zero Storage)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Destination Receiving Dock Address
            </label>
            <input
              type="text"
              required
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 font-semibold focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
              placeholder="e.g. Apollo Hospital Kitchen Dock, Bannerghatta Road, Bengaluru"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Demo Commitment Escrow Deposit (₹)
            </label>
            <input
              type="number"
              step="500"
              value={commitmentDeposit}
              onChange={(e) => setCommitmentDeposit(e.target.value)}
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-black text-stone-900 focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
              placeholder="5000"
            />
            <span className="text-[10px] text-stone-400 block mt-1">
              Simulated commitment recorded on the ledger to protect participating farmers before dispatch.
            </span>
          </div>

          <div className="pt-2 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate('/buyer')}
              className="px-4 py-2.5 text-xs font-bold text-stone-600 hover:text-stone-900 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-2xl shadow-sm hover:shadow transition flex items-center gap-2 text-sm"
            >
              {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
              <Save className="w-4 h-4" />
              <span>{isOnline ? 'Publish Bulk Demand' : 'Save Offline Draft'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
