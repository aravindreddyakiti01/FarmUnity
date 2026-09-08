import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ErrorAlert } from '../../components/ui/ErrorAlert';
import { Sprout, Lock, Phone } from 'lucide-react';

export const LoginPage = () => {
  const [phone, setPhone] = useState('9876543210');
  const [password, setPassword] = useState('password123');
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

  const fillQuickLogin = (demoPhone) => {
    setPhone(demoPhone);
    setPassword('password123');
  };

  return (
    <div className="max-w-md mx-auto my-8 bg-white p-8 rounded-2xl border border-gray-200 shadow-md text-gray-900">
      <div className="text-center mb-8">
        <div className="p-3 bg-green-100 text-green-600 rounded-2xl w-fit mx-auto mb-3">
          <Sprout className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-gray-900">Sign in to FarmUnity</h2>
        <p className="text-xs text-gray-500 mt-1">Agricultural Fulfilment Platform</p>
      </div>

      <ErrorAlert message={error} onClose={() => setError('')} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
            Registered Phone Number
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ color: '#0f172a', backgroundColor: '#ffffff' }}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g. 9876543210"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ color: '#0f172a', backgroundColor: '#ffffff' }}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow transition flex items-center justify-center gap-2"
        >
          {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
          Sign In
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 text-center">Quick Role Switch:</div>
        <div className="flex justify-center gap-2">
          <button
            type="button"
            onClick={() => fillQuickLogin('9876543210')}
            className="px-2.5 py-1 text-xs bg-gray-100 hover:bg-green-50 hover:text-green-700 rounded border border-gray-200"
          >
            Farmer (Ramesh)
          </button>
          <button
            type="button"
            onClick={() => fillQuickLogin('9876543220')}
            className="px-2.5 py-1 text-xs bg-gray-100 hover:bg-blue-50 hover:text-blue-700 rounded border border-gray-200"
          >
            Buyer (Hostel)
          </button>
          <button
            type="button"
            onClick={() => fillQuickLogin('9876543230')}
            className="px-2.5 py-1 text-xs bg-gray-100 hover:bg-purple-50 hover:text-purple-700 rounded border border-gray-200"
          >
            Coordinator
          </button>
        </div>
      </div>

      <div className="mt-4 text-center text-xs text-gray-500">
        Don't have an account?{' '}
        <Link to="/register" className="text-green-600 font-bold hover:underline">
          Register here
        </Link>
      </div>
    </div>
  );
};
