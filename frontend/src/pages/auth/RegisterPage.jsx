import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ErrorAlert } from '../../components/ui/ErrorAlert';
import { 
  Sprout, 
  Building2, 
  User, 
  Phone, 
  MapPin, 
  Lock, 
  Check, 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const RegisterPage = () => {
  // Step tracking: 1 = Role selection, 2 = Basic/Org details, 3 = Farm/Demand info, 4 = Security, 5 = Review
  const [currentStep, setCurrentStep] = useState(1);
  const [role, setRole] = useState('FARMER');

  // Common fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');

  // Farmer specific
  const [cropsGrown, setCropsGrown] = useState('Paddy, Wheat');
  const [farmAreaAcres, setFarmAreaAcres] = useState('3.5');
  const [preferredLanguage, setPreferredLanguage] = useState('English');

  // Buyer specific
  const [orgType, setOrgType] = useState('HOSTEL');
  const [recurringDemandKg, setRecurringDemandKg] = useState('5000');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { registerFarmer, registerBuyer } = useAuth();
  const navigate = useNavigate();

  const handleNext = (e) => {
    e?.preventDefault?.();
    setError('');

    if (currentStep === 2) {
      if (!name.trim()) return setError('Please enter your full name or organization name.');
      if (!phone.trim()) return setError('Please enter a valid mobile number.');
    }
    if (currentStep === 4) {
      if (password.length < 6) return setError('Password must be at least 6 characters.');
      if (password !== confirmPassword) return setError('Passwords do not match.');
    }

    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setError('');
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      const cleanPhone = phone ? phone.trim().replace(/\s+/g, '').replace(/^[+]91/, '') : '';
      const cleanPassword = password ? password.trim() : '';
      const cleanEmail = email && email.trim() ? email.trim() : null;
      const cleanName = name ? name.trim() : '';
      const cleanAddress = address ? address.trim() : 'Bengaluru Rural';

      if (role === 'FARMER') {
        await registerFarmer({ 
          name: cleanName, 
          phone: cleanPhone, 
          email: cleanEmail, 
          password: cleanPassword, 
          address: cleanAddress,
          latitude: 12.9716,
          longitude: 77.5946
        });
        navigate('/farmer');
      } else {
        await registerBuyer({ 
          name: cleanName, 
          phone: cleanPhone, 
          email: cleanEmail, 
          password: cleanPassword, 
          address: cleanAddress, 
          orgType,
          latitude: 12.9716,
          longitude: 77.5946
        });
        navigate('/buyer');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Registration failed';
      setError(errorMsg);
      setCurrentStep(4); // return to password step if auth error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-6 bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-10 text-stone-900 space-y-6">
      {/* Stepper Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
              Step {currentStep} of 5
            </span>
            <span className="text-xs text-stone-500 font-semibold">
              {role === 'FARMER' ? 'Farmer Registration' : 'Institutional Buyer Registration'}
            </span>
          </div>
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="text-xs text-stone-500 hover:text-stone-800 font-bold flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          )}
        </div>

        {/* Progress bar */}
        <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-green-700 h-full transition-all duration-300"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>
      </div>

      <ErrorAlert message={error} onClose={() => setError('')} />

      {/* STEP 1: Who Are You? */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-2xl font-black text-stone-900">Who are you?</h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Select your primary role to customize your FarmUnity workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => { setRole('FARMER'); setCurrentStep(2); }}
              className={`p-6 rounded-2xl border text-left transition flex flex-col justify-between ${
                role === 'FARMER'
                  ? 'border-green-600 bg-green-50/50 ring-2 ring-green-600/20 shadow-xs'
                  : 'border-stone-200 hover:border-stone-300 bg-stone-50/30'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-green-100 text-green-700 flex items-center justify-center mb-4">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Smallholder Farmer</h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  "I want to sell my produce at fair floor prices through certified cooperative bulk pools."
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100 text-xs font-bold text-green-700 flex items-center gap-1">
                <span>Continue as Farmer</span> <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => { setRole('BUYER'); setCurrentStep(2); }}
              className={`p-6 rounded-2xl border text-left transition flex flex-col justify-between ${
                role === 'BUYER'
                  ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20 shadow-xs'
                  : 'border-stone-200 hover:border-stone-300 bg-stone-50/30'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Bulk Institutional Buyer</h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  "I need agricultural produce in bulk (hospitals, hostels, canteens, processors)."
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100 text-xs font-bold text-blue-700 flex items-center gap-1">
                <span>Continue as Buyer</span> <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Basic Details / Org Info */}
      {currentStep === 2 && (
        <form onSubmit={handleNext} className="space-y-5 animate-in fade-in duration-200">
          <div>
            <h2 className="text-2xl font-black text-stone-900">
              {role === 'FARMER' ? 'Your Personal Details' : 'Organization Details'}
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Used for physical quality visits and dispatch notifications.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                {role === 'FARMER' ? 'Farmer Full Name' : 'Organization / Institution Name'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-green-600 focus:bg-white"
                placeholder={role === 'FARMER' ? 'e.g. Ramesh Kumar' : 'e.g. Bangalore Central Hostel Mess'}
              />
            </div>

            {role === 'BUYER' && (
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Organization Category
                </label>
                <select
                  value={orgType}
                  onChange={(e) => setOrgType(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-green-600 focus:bg-white"
                >
                  <option value="HOSTEL">Hostel / Dormitory Mess</option>
                  <option value="HOSPITAL">Hospital / Healthcare Kitchen</option>
                  <option value="CANTEEN">School / College / Corporate Canteen</option>
                  <option value="HOTEL">Hotel / Hospitality</option>
                  <option value="RESTAURANT">Restaurant / Cloud Kitchen</option>
                  <option value="PROCESSOR">Grain Processor / Rice Mill</option>
                  <option value="WHOLESALER">Wholesale Aggregator</option>
                  <option value="GOVERNMENT">Government Institution / Depot</option>
                  <option value="OTHER">Other Institution</option>
                </select>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Mobile Number (Used for Login)
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-green-600 focus:bg-white"
                  placeholder="e.g. 9876543210"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-green-600 focus:bg-white"
                  placeholder="e.g. name@example.com"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-2"
            >
              <span>Next: {role === 'FARMER' ? 'Farm Information' : 'Procurement Needs'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: Farm Info (Farmer) OR Procurement Info (Buyer) */}
      {currentStep === 3 && (
        <form onSubmit={handleNext} className="space-y-5 animate-in fade-in duration-200">
          <div>
            <h2 className="text-2xl font-black text-stone-900">
              {role === 'FARMER' ? 'Farm & Village Details' : 'Procurement Requirements'}
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              {role === 'FARMER' 
                ? 'Helps our regional coordinator plan farm visits and collection routes.'
                : 'Helps matching algorithms locate nearby cooperative farmer pools.'}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                {role === 'FARMER' ? 'Village & District Location' : 'Delivery Dock Address'}
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-green-600 focus:bg-white"
                placeholder={role === 'FARMER' ? 'e.g. Village Hoskote, Bengaluru Rural' : 'e.g. Central Receiving Dock, Koramangala, Bengaluru'}
              />
            </div>

            {role === 'FARMER' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Crops Normally Grown
                  </label>
                  <input
                    type="text"
                    value={cropsGrown}
                    onChange={(e) => setCropsGrown(e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-green-600 focus:bg-white"
                    placeholder="e.g. Paddy, Wheat, Maize"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Approximate Farm Area (Acres)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={farmAreaAcres}
                    onChange={(e) => setFarmAreaAcres(e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-green-600 focus:bg-white"
                    placeholder="e.g. 3.5"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Estimated Monthly Requisition Volume (kg)
                </label>
                <input
                  type="number"
                  step="500"
                  value={recurringDemandKg}
                  onChange={(e) => setRecurringDemandKg(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-green-600 focus:bg-white"
                  placeholder="e.g. 5000"
                />
                <span className="text-[10px] text-stone-500 mt-1 block">Can be adjusted at any time when posting demands</span>
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-2"
            >
              <span>Next: Account Security</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 4: Account Security */}
      {currentStep === 4 && (
        <form onSubmit={handleNext} className="space-y-5 animate-in fade-in duration-200">
          <div>
            <h2 className="text-2xl font-black text-stone-900">Set Account Password</h2>
            <p className="text-xs text-stone-500 mt-1">
              Choose a secure password to protect your agreements and payment settlements.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Password (min 6 characters)
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-green-600 focus:bg-white"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-green-600 focus:bg-white"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-2"
            >
              <span>Review Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 5: Review & Confirm */}
      {currentStep === 5 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-2xl font-black text-stone-900">You are ready to join FarmUnity</h2>
            <p className="text-xs text-stone-500 mt-1">
              Please review your information before completing registration.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 text-xs">
            <div className="flex justify-between border-b border-stone-200/70 pb-2">
              <span className="text-stone-500">Account Type:</span>
              <span className="font-bold text-stone-900 uppercase">{role}</span>
            </div>
            <div className="flex justify-between border-b border-stone-200/70 pb-2">
              <span className="text-stone-500">Name:</span>
              <span className="font-bold text-stone-900">{name}</span>
            </div>
            <div className="flex justify-between border-b border-stone-200/70 pb-2">
              <span className="text-stone-500">Phone:</span>
              <span className="font-bold text-stone-900 font-mono">{phone}</span>
            </div>
            <div className="flex justify-between border-b border-stone-200/70 pb-2">
              <span className="text-stone-500">Location:</span>
              <span className="font-bold text-stone-900">{address || 'Bengaluru Rural'}</span>
            </div>
            {role === 'BUYER' && (
              <div className="flex justify-between pb-1">
                <span className="text-stone-500">Organization Category:</span>
                <span className="font-bold text-stone-900">{orgType}</span>
              </div>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-green-50/70 border border-green-200 text-xs text-green-900 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-green-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold text-green-950 block mb-0.5">Platform Guarantee</span>
              Your data is secured with JWT authentication and BCrypt password encryption. Physical quality inspections and cooperative matches are verified before dispatch.
            </div>
          </div>

          <div className="pt-2 flex justify-between items-center">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="text-xs text-stone-500 hover:text-stone-800 font-bold"
            >
              Start Over
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-3.5 bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl shadow transition flex items-center gap-2 text-sm"
            >
              {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete Registration</span>
            </button>
          </div>
        </div>
      )}

      {/* Footer link */}
      <div className="pt-4 border-t border-stone-100 text-center text-xs text-stone-500">
        Already have an account?{' '}
        <Link to="/login" className="text-green-700 font-bold hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
};
