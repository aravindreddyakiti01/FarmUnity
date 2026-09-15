import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Sprout, Building2, User, Phone, MapPin, AlertCircle } from 'lucide-react';

export const RegisterPage = () => {
  const [role, setRole] = useState(null); // 'FARMER' | 'BUYER'
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    address: '',
    orgType: 'HOSTEL',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSelectRole = (selectedRole) => {
    setRole(selectedRole);
    setStep(2);
    setError('');
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (role === 'FARMER') {
        await register({
          name: formData.name,
          phone: formData.phone,
          password: formData.password,
          address: formData.address || 'Village Hoskote, Bengaluru Rural',
          latitude: 12.9716,
          longitude: 77.5946,
        }, 'FARMER');
        navigate('/farmer');
      } else {
        await register({
          name: formData.name,
          phone: formData.phone,
          password: formData.password,
          orgType: formData.orgType,
          address: formData.address || 'Bengaluru Urban',
          latitude: 12.9352,
          longitude: 77.6245,
        }, 'BUYER');
        navigate('/buyer');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-6">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm max-w-xl w-full p-8 md:p-10">
        <div className="text-center mb-6">
          <div className="inline-flex p-2 bg-green-800 rounded-lg text-white mb-3">
            <Sprout className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900 tracking-tight">Join FarmUnity</h2>
          <p className="text-xs text-stone-500 mt-1">
            {step === 1 ? 'Select your primary role to get started' : `Completing onboarding for ${role === 'FARMER' ? 'Farmer Producer' : 'Institutional Buyer'}`}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => handleSelectRole('FARMER')}
              className="w-full text-left p-5 rounded-xl border border-stone-200 hover:border-green-800 hover:bg-green-50/50 transition-all flex items-start gap-4 group"
            >
              <div className="p-3 rounded-lg bg-stone-100 text-stone-700 group-hover:bg-green-800 group-hover:text-white transition-colors">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900 mb-1">Sell Produce (Farmer)</h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  List harvest lots, participate in verified local cooperatives, and supply bulk institutional buyers at guaranteed floor rates.
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleSelectRole('BUYER')}
              className="w-full text-left p-5 rounded-xl border border-stone-200 hover:border-blue-800 hover:bg-blue-50/50 transition-all flex items-start gap-4 group"
            >
              <div className="p-3 rounded-lg bg-stone-100 text-stone-700 group-hover:bg-blue-800 group-hover:text-white transition-colors">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900 mb-1">Source in Bulk (Institutional Buyer)</h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Procure verified grain batches for hostels, canteens, hospitals, or food processing facilities directly from producer clusters.
                </p>
              </div>
            </button>

            <div className="mt-6 text-center text-xs text-stone-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-green-800 hover:underline">
                Sign In
              </Link>
            </div>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {role === 'FARMER' ? 'Full Name' : 'Organization Name'}
              </label>
              <input
                type="text"
                required
                placeholder={role === 'FARMER' ? 'e.g. Ramesh Kumar' : 'e.g. Bangalore Central Hostels'}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-green-800 focus:border-green-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                required
                placeholder="10-digit mobile number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-green-800 focus:border-green-800"
              />
            </div>

            {role === 'BUYER' && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Institution Type
                </label>
                <select
                  value={formData.orgType}
                  onChange={(e) => setFormData({ ...formData, orgType: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-green-800 focus:border-green-800"
                >
                  <option value="HOSTEL">University / College Hostel</option>
                  <option value="HOSPITAL">Hospital Facility</option>
                  <option value="CANTEEN">Industrial Kitchen / Canteen</option>
                  <option value="PROCESSOR">Food Processor / Mill</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {role === 'FARMER' ? 'Village / Farm Address' : 'Delivery Facility Address'}
              </label>
              <input
                type="text"
                required
                placeholder="Village / Town / District"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-green-800 focus:border-green-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Set Password
              </label>
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-green-800 focus:border-green-800"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Creating Account...' : 'Complete Registration'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
