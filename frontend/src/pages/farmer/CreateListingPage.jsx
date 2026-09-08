import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listingsApi } from '../../api/listings';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { useDraftQueue } from '../../hooks/useDraftQueue';
import { ErrorAlert } from '../../components/ui/ErrorAlert';
import { Sprout, Save, ArrowLeft, WifiOff } from 'lucide-react';

export const CreateListingPage = () => {
  const [crop, setCrop] = useState('paddy');
  const [variety, setVariety] = useState('Sona Masoori');
  const [declaredQty, setDeclaredQty] = useState('500');
  const [harvestDate, setHarvestDate] = useState('2024-10-15');
  const [minPricePerKg, setMinPricePerKg] = useState('27.00');
  const [moistureReading, setMoistureReading] = useState('13.2');
  const [storageCondition, setStorageCondition] = useState('Dry Aerated Warehouse');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isOnline = useOnlineStatus();
  const { saveDraftListing } = useDraftQueue();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      crop,
      variety,
      declaredQty: parseFloat(declaredQty),
      harvestDate,
      minPricePerKg: parseFloat(minPricePerKg),
      moistureReading: moistureReading ? parseFloat(moistureReading) : null,
      storageCondition,
    };

    try {
      if (!isOnline) {
        await saveDraftListing(payload);
        alert('Listing saved locally in offline queue! It will sync when connection returns.');
        navigate('/farmer');
      } else {
        await listingsApi.create(payload);
        navigate('/farmer');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-6 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-black text-gray-900">List Produce for Pooling</h2>
          <p className="text-xs text-gray-500 mt-0.5">Staple crops (Paddy, Wheat, Pulses, Oilseeds) for bulk aggregation</p>
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
              Staple Crop Type
            </label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 font-semibold focus:ring-2 focus:ring-green-500 focus:bg-white"
            >
              <option value="paddy">Paddy (Rice)</option>
              <option value="wheat">Wheat</option>
              <option value="pulses">Pulses (Toor / Moong)</option>
              <option value="oilseeds">Oilseeds (Mustard / Groundnut)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Variety / Cultivar
            </label>
            <input
              type="text"
              value={variety}
              onChange={(e) => setVariety(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 font-semibold focus:ring-2 focus:ring-green-500 focus:bg-white"
              placeholder="e.g. Sona Masoori, Sharbati"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Declared Quantity (kg)
            </label>
            <input
              type="number"
              step="0.1"
              required
              value={declaredQty}
              onChange={(e) => setDeclaredQty(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 font-bold focus:ring-2 focus:ring-green-500 focus:bg-white"
              placeholder="e.g. 500"
            />
            <span className="text-[10px] text-gray-500 block mt-0.5">Final payment uses verified quantity only</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Protected Minimum Price (₹/kg)
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={minPricePerKg}
              onChange={(e) => setMinPricePerKg(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm font-bold text-green-700 focus:ring-2 focus:ring-green-500 focus:bg-white"
              placeholder="e.g. 27.00"
            />
            <span className="text-[10px] text-gray-500 block mt-0.5">Platform will never match below this price</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Harvest Date
            </label>
            <input
              type="date"
              value={harvestDate}
              onChange={(e) => setHarvestDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 font-semibold focus:ring-2 focus:ring-green-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Moisture % (Optional preliminary reading)
            </label>
            <input
              type="number"
              step="0.1"
              value={moistureReading}
              onChange={(e) => setMoistureReading(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 font-semibold focus:ring-2 focus:ring-green-500 focus:bg-white"
              placeholder="e.g. 13.2"
            />
            <span className="text-[10px] text-gray-500 block mt-0.5">Target band for pooling is 12.0% – 14.0%</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
            Storage & Bagging Condition
          </label>
          <input
            type="text"
            value={storageCondition}
            onChange={(e) => setStorageCondition(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 font-semibold focus:ring-2 focus:ring-green-500 focus:bg-white"
            placeholder="e.g. Jute bags in ventilated godown"
          />
        </div>

        <div className="pt-4 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate('/farmer')}
            className="px-4 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow transition flex items-center gap-2"
          >
            {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
            <Save className="w-4 h-4" /> {isOnline ? 'Publish Listing' : 'Save Offline Draft'}
          </button>
        </div>
      </form>
    </div>
  );
};
