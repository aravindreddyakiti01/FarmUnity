import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ErrorAlert } from '../../components/ui/ErrorAlert';
import { 
  Sprout, 
  Lock, 
  Phone, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Scale, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const LoginPage = () => {
  const [phone, setPhone] = useState('9876543210');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const cleanPhone = phone ? phone.trim().replace(/\s+/g, '').replace(/^[+]91/, '') : '';
      const cleanPassword = password ? password.trim() : '';
      const user = await login(cleanPhone, cleanPassword);
      if (user.role === 'FARMER') navigate('/farmer');
      else if (user.role === 'BUYER') navigate('/buyer');
      else if (user.role === 'COORDINATOR') navigate('/coordinator');
      else navigate('/');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Login failed';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoPhone) => {
    setPhone(demoPhone);
    setPassword('password123');
  };

  return (
    <div className="max-w-4xl mx-auto my-6 bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
      {/* Left Column: Agricultural Trust & Mission (Desktop) */}
      <div className="hidden md:flex md:col-span-5 bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 text-stone-100 p-8 flex-col justify-between relative overflow-hidden">
        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-green-600/30 text-green-400 rounded-xl border border-green-500/30">
              <Sprout className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">FarmUnity</span>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-extrabold text-white leading-snug">
              Many small farms. <br />
              <span className="text-green-400">One stronger supply.</span>
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              An offline-capable cooperative fulfilment platform connecting verified smallholder harvests with institutional buyers.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-2.5 text-xs text-stone-300">
              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
              <span>Physical on-farm moisture & grade inspection</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-stone-300">
              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
              <span>Demand-driven pooling across nearby villages</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-stone-300">
              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
              <span>Transparent settlement strictly on verified weight</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-stone-300">
              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
              <span>Deterministic failure recovery for shortages</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-stone-800 text-[11px] text-stone-500 relative z-10">
          Deterministic coordination &middot; Tamper-evident audit trail
        </div>
      </div>

      {/* Right Column: Clean Login Form */}
      <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-between space-y-6">
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-black text-stone-900">Welcome back</h2>
            <p className="text-xs text-stone-500 mt-1">
              Sign in to continue managing your farm produce, bulk procurement, or field operations.
            </p>
          </div>

          <ErrorAlert message={error} onClose={() => setError('')} />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Registered Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ color: '#0f172a', backgroundColor: '#ffffff' }}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition"
                  placeholder="e.g. 9876543210"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('Password reset: Contact your local coordinator or call helpline')}
                  className="text-[11px] text-stone-500 hover:text-green-700 font-medium transition"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ color: '#0f172a', backgroundColor: '#ffffff' }}
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-stone-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl shadow-sm hover:shadow transition flex items-center justify-center gap-2 text-sm"
            >
              {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-4 text-center text-xs text-stone-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-green-700 font-bold hover:underline">
              Register here
            </Link>
          </div>
        </div>

        {/* Clearly Labeled Demo Access Section */}
        <div className="pt-4 border-t border-stone-100 bg-stone-50/70 p-4 rounded-2xl border border-stone-200/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
              Demo Access for Reviewers
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
              Demo Mode
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount('9876543210')}
              className="px-2.5 py-1.5 text-xs font-semibold bg-white hover:bg-stone-100 text-stone-700 rounded-lg border border-stone-300 transition text-center truncate"
              title="Farmer (Ramesh Kumar)"
            >
              Demo Farmer
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('9876543220')}
              className="px-2.5 py-1.5 text-xs font-semibold bg-white hover:bg-stone-100 text-stone-700 rounded-lg border border-stone-300 transition text-center truncate"
              title="Buyer (Hostel Network)"
            >
              Demo Buyer
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('9876543230')}
              className="px-2.5 py-1.5 text-xs font-semibold bg-white hover:bg-stone-100 text-stone-700 rounded-lg border border-stone-300 transition text-center truncate"
              title="Regional Operations Coordinator"
            >
              Demo Coordinator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
