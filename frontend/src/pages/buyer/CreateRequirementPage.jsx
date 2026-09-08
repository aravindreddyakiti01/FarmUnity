import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requirementsApi } from '../../api/requirements';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { useDraftQueue } from '../../hooks/useDraftQueue';
import { ErrorAlert } from '../../components/ui/ErrorAlert';
import { SimulatedLedgerBanner } from '../../components/ui/SimulatedLedgerBanner';
import { Building2, Save, WifiOff } from 'lucide-react';

export const CreateRequirementPage = () => {
  const [product, setProduct] = useState('paddy');
  const [variety, setVariety] = useState('Sona Masoori');
  const [quantityKg, setQuantityKg] = useState('600');
  const [moistureBandMin, setMoistureBandMin] = useState('12.0');
  const [moistureBandMax, setMoistureBandMax] = useState('14.0');
  const [priceMin, setPriceMin] = useState('28.00');
  const [priceMax, setPriceMax] = useState('32.00');
  const [deliveryWindowStart, setDeliveryWindowStart] = useState('2024-10-20');
  const [deliveryWindowEnd, setDeliveryWindowEnd] = useState('2024-10-25');
  const [destination, setDestination] = useState('Bangalore Central Hostel Mess, Koramangala');
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
      destination,
      commitmentDeposit: parseFloat(commitmentDeposit),
    };

    try {
      if (!isOnline) {
        await saveDraftRequirement(payload);
        alert('Requirement saved locally in offline queue!');
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
    <div className="max-w-2xl mx-auto my-6 space-y-4">
      <SimulatedLedgerBanner />

      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Post Institutional Bulk Demand</h2>
            <p className="text-xs text-gray-500 mt-0.5">Define your quantity, quality moisture band, and acceptable price envelope</p>
          </div>
          {!isOnline && (
            <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-bold">
              <WifiOff className="w-3.5 h-3.5" /> Offline Draft Mode
            </span>
          )}
        </div>

        <ErrorAlert message={error} onClose={() => setError('')} />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Staple Product
              </label>
              <select
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 font-semibold focus:ring-2 focus:ring-blue-500"
              >
                <option value="paddy">Paddy / Rice</option>
                <option value="wheat">Wheat / Atta</option>
                <option value="pulses">Pulses / Dal</option>
                <option value="oilseeds">Oilseeds</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Preferred Variety
              </label>
              <input
                type="text"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 font-semibold focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Sona Masoori, Sharbati"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Required Bulk Quantity (kg)
            </label>
            <input
              type="number"
              step="1"
              required
              value={quantityKg}
              onChange={(e) => setQuantityKg(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-black text-blue-700 focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Required Moisture Band (% Min - Max)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  value={moistureBandMin}
                  onChange={(e) => setMoistureBandMin(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-center font-bold text-gray-900"
                />
                <span className="text-gray-400 font-bold">–</span>
                <input
                  type="number"
                  step="0.1"
                  value={moistureBandMax}
                  onChange={(e) => setMoistureBandMax(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-center font-bold text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Acceptable Price Budget (₹/kg Min - Max)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.5"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-center font-bold text-green-700"
                />
                <span className="text-gray-400 font-bold">–</span>
                <input
                  type="number"
                  step="0.5"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-center font-bold text-green-700"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Destination Delivery Address
            </label>
            <input
              type="text"
              required
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Simulated Commitment Deposit (₹)
            </label>
            <input
              type="number"
              step="100"
              value={commitmentDeposit}
              onChange={(e) => setCommitmentDeposit(e.target.value)}
              className="w-full px-4 py-2.5 bg-amber-50 border border-amber-200 text-amber-900 font-black rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white"
              placeholder="e.g. 5000"
            />
            <span className="text-[10px] text-gray-400 block mt-0.5">Protects batch against fake/uncommitted institutional orders</span>
          </div>

          <div className="pt-4 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate('/buyer')}
              className="px-4 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow transition flex items-center gap-2"
            >
              {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
              <Save className="w-4 h-4" /> {isOnline ? 'Post Demand' : 'Save Offline Draft'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
