import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listingsApi } from '../../api/listings';
import { db } from '../../store/db';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { useTranslation } from '../../hooks/useTranslation';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { AlertBanner } from '../../components/ui/AlertBanner';
import {
  Sprout,
  Scale,
  Calendar,
  MapPin,
  Coins,
  ShieldCheck,
  Camera,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sun,
  AlertCircle,
} from 'lucide-react';

export const CreateListingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [offlineNotice, setOfflineNotice] = useState(false);

  const { isOnline } = useOnlineStatus();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    crop: 'paddy',
    variety: 'Sona Masoori',
    declaredQty: '1000',
    unit: 'kg',
    harvestDate: new Date().toISOString().split('T')[0],
    readyDate: new Date().toISOString().split('T')[0],
    village: 'Village Hoskote',
    district: 'Bengaluru Rural',
    latitude: 12.9716,
    longitude: 77.5946,
    minPricePerKg: '25.50',
    preferredPricePerKg: '27.00',
    expectedMoisture: '13.0',
    visualCondition: 'Clean, dry, uniform golden grain',
    photoNotes: 'Harvested under dry sunlight, stored in jute bags',
  });

  const crops = [
    { id: 'paddy', name: 'Paddy (Rice)', icon: '🌾', varieties: ['Sona Masoori', 'Basmati', 'IR64'] },
    { id: 'wheat', name: 'Wheat', icon: '🌿', varieties: ['Sharbati', 'Lokwan', 'Kalyan Sona'] },
    { id: 'pulses', name: 'Pulses (Toor Dal)', icon: '🌱', varieties: ['Toor Dal', 'Moong', 'Chana'] },
    { id: 'oilseeds', name: 'Oilseeds (Mustard)', icon: '🌻', varieties: ['Mustard', 'Groundnut', 'Soybean'] },
  ];

  const handleNext = () => {
    setError('');
    setCurrentStep((prev) => Math.min(prev + 1, 8));
  };

  const handleBack = () => {
    setError('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    const payload = {
      crop: formData.crop,
      variety: formData.variety,
      declaredQty: parseFloat(formData.declaredQty),
      minPricePerKg: parseFloat(formData.minPricePerKg),
      harvestDate: formData.harvestDate,
      latitude: formData.latitude,
      longitude: formData.longitude,
      address: `${formData.village}, ${formData.district}`,
      moistureReading: parseFloat(formData.expectedMoisture) || null,
      storageCondition: formData.visualCondition,
    };

    if (!isOnline) {
      // Save locally to IndexedDB queue
      try {
        await db.produceDrafts.add({
          ...payload,
          idempotencyKey: `draft-${Date.now()}`,
          timestamp: new Date().toISOString(),
          synced: false,
        });
        setOfflineNotice(true);
        setTimeout(() => navigate('/farmer'), 2000);
      } catch (e) {
        setError('Failed to save draft locally: ' + e.message);
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      const res = await listingsApi.create(payload);
      // Auto submit for physical verification
      if (res.data?.id) {
        await listingsApi.submitForVerification(res.data.id);
      }
      navigate('/farmer');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit produce listing. Please check required fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PageHeader
        title="Sell Produce Wizard"
        description="Register your harvest lot step-by-step. Information is used strictly to identify compatible bulk buyers and coordinate pickup."
      />

      {/* Wizard Step Progress Tracker */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
        <div className="flex items-center justify-between text-xs font-semibold text-stone-500 mb-2">
          <span>STEP {currentStep} OF 8</span>
          <span className="text-green-800">
            {currentStep === 1 && 'Crop Selection'}
            {currentStep === 2 && 'Quantity'}
            {currentStep === 3 && 'Harvest & Ready Dates'}
            {currentStep === 4 && 'Farm Location'}
            {currentStep === 5 && 'Price Limits'}
            {currentStep === 6 && 'Quality Declaration'}
            {currentStep === 7 && 'Produce Photos'}
            {currentStep === 8 && 'Review & Confirm'}
          </span>
        </div>

        <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-green-800 h-full transition-all duration-300"
            style={{ width: `${(currentStep / 8) * 100}%` }}
          />
        </div>
      </div>

      {offlineNotice && (
        <AlertBanner variant="warning" title="Saved on this device">
          Your listing was saved locally in offline storage. We will automatically publish and request physical inspection once your internet connection resumes.
        </AlertBanner>
      )}

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Step Contents */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        {/* STEP 1: Crop Selection */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-stone-900">What produce are you selling?</h3>
            <p className="text-xs text-stone-500">Select the crop category for your harvest lot.</p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {crops.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setFormData({ ...formData, crop: c.id, variety: c.varieties[0] })}
                  className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    formData.crop === c.id
                      ? 'border-green-800 bg-green-50/60 ring-1 ring-green-800'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <span className="text-3xl mb-2">{c.icon}</span>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">{c.name}</h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">Bulk demand active</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-3">
              <label className="block text-xs font-semibold text-stone-700 mb-1">Specific Variety</label>
              <select
                value={formData.variety}
                onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-green-800"
              >
                {crops.find((c) => c.id === formData.crop)?.varieties.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* STEP 2: Quantity */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-stone-900">How much do you have available?</h3>
            <p className="text-xs text-stone-500">
              Enter the estimated harvest quantity. Actual payouts will be calculated on verified weighbridge weight.
            </p>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">Declared Quantity (kg)</label>
              <div className="relative">
                <input
                  type="number"
                  min="100"
                  step="50"
                  required
                  value={formData.declaredQty}
                  onChange={(e) => setFormData({ ...formData, declaredQty: e.target.value })}
                  className="w-full px-3 py-2.5 text-base font-semibold border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-green-800"
                  placeholder="e.g. 800"
                />
                <span className="absolute right-3 top-3 text-xs font-semibold text-stone-500">Kilograms (kg)</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Smallholder lots as small as 300 kg are welcome for dynamic cooperative pooling.
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: Dates */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-stone-900">When is the produce ready for collection?</h3>
            <p className="text-xs text-stone-500">Coordinate pickup schedule with logistics and storage availability.</p>

            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Harvest Date</label>
                <input
                  type="date"
                  value={formData.harvestDate}
                  onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-green-800"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Ready for Pickup By</label>
                <input
                  type="date"
                  value={formData.readyDate}
                  onChange={(e) => setFormData({ ...formData, readyDate: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-green-800"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Location */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-stone-900">Where is the produce stored?</h3>
            <p className="text-xs text-stone-500">Pickup trucks use this point to calculate nearest-neighbor collection routes.</p>

            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Village / Collection Point</label>
                <input
                  type="text"
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-green-800"
                  placeholder="e.g. Hoskote Village"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">District / Region</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-green-800"
                  placeholder="e.g. Bengaluru Rural"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Pricing */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-stone-900">What price works for you?</h3>
            <p className="text-xs text-stone-500">
              FarmUnity uses this range to match buyers whose procurement budget overlaps with your acceptable price.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Minimum Floor Price (₹/kg)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-stone-400">₹</span>
                  <input
                    type="number"
                    step="0.25"
                    value={formData.minPricePerKg}
                    onChange={(e) => setFormData({ ...formData, minPricePerKg: e.target.value })}
                    className="w-full pl-7 pr-3 py-2 text-sm font-semibold border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-green-800"
                  />
                </div>
                <p className="text-[10px] text-stone-500 mt-1">You will never be forced to sell below this rate.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Preferred Price (₹/kg)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-stone-400">₹</span>
                  <input
                    type="number"
                    step="0.25"
                    value={formData.preferredPricePerKg}
                    onChange={(e) => setFormData({ ...formData, preferredPricePerKg: e.target.value })}
                    className="w-full pl-7 pr-3 py-2 text-sm font-semibold border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-green-800"
                  />
                </div>
                <p className="text-[10px] text-stone-500 mt-1">Target rate for institutional procurement consensus.</p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Quality Declaration */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-stone-900">Produce condition & moisture</h3>
            <p className="text-xs text-stone-500">
              Declare your lot's current state. Field coordinator will physically verify moisture with calibrated tester.
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Farmer-Estimated Moisture (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.expectedMoisture}
                  onChange={(e) => setFormData({ ...formData, expectedMoisture: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-green-800"
                  placeholder="e.g. 13.0"
                />
                <p className="text-[10px] text-stone-500 mt-1">
                  Recommended moisture for paddy is between 12% and 14% to prevent mold in transit.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Storage Condition</label>
                <textarea
                  rows="2"
                  value={formData.visualCondition}
                  onChange={(e) => setFormData({ ...formData, visualCondition: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-green-800"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: Photos */}
        {currentStep === 7 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-stone-900">Produce Photographs</h3>
            <p className="text-xs text-stone-500">
              Upload clear photographs of your bagged or bulk lot taken in good daylight.
            </p>

            <div className="p-4 rounded-xl border border-dashed border-stone-300 bg-stone-50 text-center space-y-2">
              <Camera className="w-8 h-8 text-stone-400 mx-auto" />
              <p className="text-xs font-medium text-stone-700">Attach photos from camera or photo library</p>
              <p className="text-[10px] text-stone-500 max-w-sm mx-auto">
                Tip: Take one wide photo of the total lot and one close-up of the grain sample in daylight.
              </p>
            </div>
          </div>
        )}

        {/* STEP 8: Review & Confirm */}
        {currentStep === 8 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-stone-900">Review Produce Summary</h3>
            <p className="text-xs text-stone-500">
              Check your details before submitting for field verification.
            </p>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-2.5">
              <div className="flex justify-between py-1 border-b border-stone-200">
                <span className="text-stone-500">Produce:</span>
                <span className="font-bold text-stone-900 capitalize">{formData.crop} &mdash; {formData.variety}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-200">
                <span className="text-stone-500">Quantity:</span>
                <span className="font-bold text-stone-900">{Number(formData.declaredQty).toLocaleString()} kg</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-200">
                <span className="text-stone-500">Price Expectation:</span>
                <span className="font-bold text-stone-900">₹{formData.minPricePerKg} &ndash; ₹{formData.preferredPricePerKg}/kg</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-200">
                <span className="text-stone-500">Pickup Point:</span>
                <span className="font-bold text-stone-900">{formData.village}, {formData.district}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-stone-500">Declared Moisture:</span>
                <span className="font-bold text-stone-900">{formData.expectedMoisture}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-stone-200">
          {currentStep > 1 ? (
            <Button variant="secondary" size="md" onClick={handleBack} icon={ArrowLeft}>
              Previous
            </Button>
          ) : (
            <div />
          )}

          {currentStep < 8 ? (
            <Button variant="primary" size="md" onClick={handleNext}>
              Continue <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button variant="primary" size="md" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Submitting...' : 'Save & Submit Produce'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
