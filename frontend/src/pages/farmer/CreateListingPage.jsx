import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listingsApi } from '../../api/listings';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { useDraftQueue } from '../../hooks/useDraftQueue';
import { ErrorAlert } from '../../components/ui/ErrorAlert';
import { 
  Sprout, 
  Save, 
  ArrowLeft, 
  WifiOff, 
  ShieldCheck, 
  Scale, 
  Calendar, 
  Droplet, 
  Check, 
  Info,
  Layers
} from 'lucide-react';

export const CreateListingPage = () => {
  const [crop, setCrop] = useState('paddy');
  const [variety, setVariety] = useState('Sona Masoori');
  const [declaredQty, setDeclaredQty] = useState('1000');
  const [harvestDate, setHarvestDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [minPricePerKg, setMinPricePerKg] = useState('26.50');
  const [moistureReading, setMoistureReading] = useState('13.0');
  const [storageCondition, setStorageCondition] = useState('Jute bags in aerated godown');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isOnline = useOnlineStatus();
  const { saveDraftListing } = useDraftQueue();
  const navigate = useNavigate();

  const crops = [
    { id: 'paddy', name: 'Paddy (Rice)', benchmark: '₹22 - ₹28 / kg', moistureTarget: '12% - 14%' },
    { id: 'wheat', name: 'Wheat', benchmark: '₹23 - ₹29 / kg', moistureTarget: '11% - 13%' },
    { id: 'maize', name: 'Maize (Corn)', benchmark: '₹19 - ₹24 / kg', moistureTarget: '12% - 14%' },
    { id: 'pulses', name: 'Pulses (Toor/Moong)', benchmark: '₹65 - ₹85 / kg', moistureTarget: '10% - 12%' },
    { id: 'oilseeds', name: 'Oilseeds (Mustard/Soy)', benchmark: '₹42 - ₹54 / kg', moistureTarget: '9% - 11%' },
    { id: 'cotton', name: 'Cotton', benchmark: '₹60 - ₹75 / kg', moistureTarget: '8% - 10%' },
  ];

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
        alert('Listing saved locally in offline queue! It will sync automatically when connection returns.');
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

  const selectedCrop = crops.find(c => c.id === crop) || crops[0];

  return (
    <div className="max-w-3xl mx-auto my-6 space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/farmer')}
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-stone-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Lots</span>
        </button>

        {!isOnline && (
          <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full font-bold">
            <WifiOff className="w-3.5 h-3.5" /> Offline Draft Mode
          </span>
        )}
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200 mb-2">
            <Sprout className="w-3.5 h-3.5 text-green-700" />
            <span>Step 1: Produce Registration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900">List Your Harvest</h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Provide estimated quantity and floor price. Your local coordinator will verify the physical weight and moisture on-site.
          </p>
        </div>

        <ErrorAlert message={error} onClose={() => setError('')} />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Visual Crop Selector */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Select Staple Crop
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {crops.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCrop(c.id)}
                  className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                    crop === c.id
                      ? 'border-green-600 bg-green-50/60 ring-2 ring-green-600/20'
                      : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm font-bold text-stone-900">{c.name}</span>
                    {crop === c.id && <Check className="w-4 h-4 text-green-700 shrink-0" />}
                  </div>
                  <div className="mt-2 text-[10px] text-stone-500">
                    <div>Ref: {c.benchmark}</div>
                    <div className="text-green-700 font-semibold">Moisture: {c.moistureTarget}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Variety & Harvest Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Variety / Cultivar Name
              </label>
              <input
                type="text"
                required
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 font-semibold focus:ring-2 focus:ring-green-600 focus:bg-white transition"
                placeholder="e.g. Sona Masoori, Sharbati 306"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Harvest Completion Date
              </label>
              <input
                type="date"
                required
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 font-semibold focus:ring-2 focus:ring-green-600 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Declared Qty & Floor Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Estimated Quantity (kg)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="1"
                  min="50"
                  required
                  value={declaredQty}
                  onChange={(e) => setDeclaredQty(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-stone-300 rounded-xl text-lg font-black text-stone-900 focus:ring-2 focus:ring-green-600 transition"
                  placeholder="1000"
                />
                <span className="absolute right-3 top-2.5 text-xs font-bold text-stone-400">KG</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1.5 leading-tight">
                = {(Number(declaredQty || 0) / 100).toFixed(1)} Quintals (approx. {Math.round(Number(declaredQty || 0) / 50)} bags)
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-green-50/50 border border-green-200/80">
              <label className="block text-xs font-bold text-green-900 uppercase tracking-wider mb-1">
                Your Minimum Floor Price (₹/kg)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  required
                  value={minPricePerKg}
                  onChange={(e) => setMinPricePerKg(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-green-300 rounded-xl text-lg font-black text-green-800 focus:ring-2 focus:ring-green-600 transition"
                  placeholder="26.50"
                />
                <span className="absolute right-3 top-2.5 text-xs font-bold text-green-600">₹ / KG</span>
              </div>
              <p className="text-[11px] text-green-700 mt-1.5 leading-tight font-medium">
                Protected Floor: The platform will never match you below this price.
              </p>
            </div>
          </div>

          {/* Moisture & Storage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Estimated Moisture % (Optional)
              </label>
              <input
                type="number"
                step="0.1"
                value={moistureReading}
                onChange={(e) => setMoistureReading(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 font-semibold focus:ring-2 focus:ring-green-600 focus:bg-white transition"
                placeholder="e.g. 13.0"
              />
              <span className="text-[10px] text-stone-400 block mt-1">
                Optimal range for {selectedCrop.name}: {selectedCrop.moistureTarget}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Storage & Bagging Condition
              </label>
              <input
                type="text"
                value={storageCondition}
                onChange={(e) => setStorageCondition(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 font-semibold focus:ring-2 focus:ring-green-600 focus:bg-white transition"
                placeholder="e.g. Jute bags in dry shed"
              />
              <span className="text-[10px] text-stone-400 block mt-1">
                Helps the coordinator verify bag count & pickup access
              </span>
            </div>
          </div>

          {/* Transparency & Safety Guarantee Card */}
          <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200 text-xs text-stone-600 flex items-start gap-3">
            <Info className="w-5 h-5 text-stone-500 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold text-stone-800 block mb-0.5">Physical Verification Notice</span>
              Submitting this lot does not bind you to an immediate sale. A certified coordinator will visit your village to test moisture and weigh sample bags. Final settlement is always based on the verified weight.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate('/farmer')}
              className="px-5 py-3 text-xs font-bold text-stone-600 hover:text-stone-900 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 bg-green-700 hover:bg-green-800 text-white font-bold rounded-2xl shadow-sm hover:shadow transition flex items-center gap-2 text-sm"
            >
              {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
              <Save className="w-4 h-4" />
              <span>{isOnline ? 'Register Produce Lot' : 'Save Offline Draft'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
