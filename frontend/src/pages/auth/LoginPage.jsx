import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import { Button } from '../../components/ui/Button';
import { Sprout, Lock, Phone, Eye, EyeOff, AlertCircle } from 'lucide-react';

export const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e?.preventDefault();
    if (!identifier || !password) {
      setError('Please enter both your phone number and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = await login(identifier, password);
      if (user.role === 'FARMER') {
        navigate('/farmer');
      } else if (user.role === 'BUYER') {
        navigate('/buyer');
      } else {
        navigate('/coordinator');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please check your phone number and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (phone, role) => {
    setIdentifier(phone);
    setPassword('password123');
    setError('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-6">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm max-w-4xl w-full grid md:grid-cols-2 overflow-hidden">
        {/* Left: Agricultural Visual & Narrative */}
        <div className="bg-stone-900 text-white p-8 md:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-8">
              <div className="p-2 bg-green-700 rounded-lg text-white">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">FarmUnity</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold leading-snug tracking-tight mb-4 text-stone-100">
              Many small farms.<br />
              <span className="text-green-400">One stronger supply.</span>
            </h2>

            <p className="text-stone-300 text-sm leading-relaxed mb-6">
              Connect directly with institutional bulk procurement networks. Verified produce, fair price discovery, and transparent settlements.
            </p>
          </div>

          <div className="relative z-10 pt-6 border-t border-stone-800 text-xs text-stone-400">
            Certified moisture testing &middot; Tamper-evident agreements &middot; Proportional payouts
          </div>
        </div>

        {/* Right: Login Form */}
        <div className="p-8 md:p-10 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-stone-900 mb-1">{t('welcome')}</h3>
            <p className="text-xs text-stone-500 mb-6">
              Sign in to your FarmUnity account to manage produce, orders, or procurement.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Registered Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9876543210"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-green-800 focus:border-green-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2 text-sm border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-green-800 focus:border-green-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Signing in...' : t('sign_in')}
              </Button>
            </form>

            <div className="mt-4 text-center text-xs text-stone-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-green-800 hover:underline">
                Create an account
              </Link>
            </div>
          </div>

          {/* Discreet Demo Account Helper */}
          <div className="mt-8 pt-4 border-t border-stone-200">
            <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-2">
              Quick Demo Access
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoFill('9876543210', 'FARMER')}
                className="px-2 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded text-xs font-medium text-center"
              >
                Farmer
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('9876543220', 'BUYER')}
                className="px-2 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded text-xs font-medium text-center"
              >
                Institutional Buyer
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('9876543230', 'COORDINATOR')}
                className="px-2 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded text-xs font-medium text-center"
              >
                Coordinator
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
