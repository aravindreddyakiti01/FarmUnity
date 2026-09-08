import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ErrorAlert } from '../../components/ui/ErrorAlert';
import { Sprout, Building2, User } from 'lucide-react';

export const RegisterPage = () => {
  const [role, setRole] = useState('FARMER');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [orgType, setOrgType] = useState('HOSTEL');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { registerFarmer, registerBuyer } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const cleanPhone = phone ? phone.trim().replace(/\s+/g, '').replace(/^[+]91/, '') : '';
      const cleanPassword = password ? password.trim() : '';
      const cleanEmail = email && email.trim() ? email.trim() : null;
      const cleanName = name ? name.trim() : '';
      const cleanAddress = address ? address.trim() : '';

      if (role === 'FARMER') {
        await registerFarmer({ name: cleanName, phone: cleanPhone, email: cleanEmail, password: cleanPassword, address: cleanAddress });
        navigate('/farmer');
      } else {
        await registerBuyer({ name: cleanName, phone: cleanPhone, email: cleanEmail, password: cleanPassword, address: cleanAddress, orgType });
        navigate('/buyer');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Registration failed';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto my-8 bg-white p-8 rounded-2xl border border-gray-200 shadow-md text-gray-900">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-gray-900">Create FarmUnity Account</h2>
        <p className="text-xs text-gray-500 mt-1">Direct Agricultural Fulfilment Network</p>
      </div>

      {/* Role Selection Tabs */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          type="button"
          onClick={() => setRole('FARMER')}
          className={`py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border transition ${
            role === 'FARMER'
              ? 'bg-green-50 border-green-600 text-green-700 shadow-xs'
              : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
          }`}
        >
          <Sprout className="w-4 h-4" /> Farmer Account
        </button>
        <button
          type="button"
          onClick={() => setRole('BUYER')}
          className={`py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border transition ${
            role === 'BUYER'
              ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs'
              : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
          }`}
        >
          <Building2 className="w-4 h-4" /> Institutional Buyer
        </button>
      </div>

      <ErrorAlert message={error} onClose={() => setError('')} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
            {role === 'FARMER' ? 'Farmer Full Name' : 'Institution / Organization Name'}
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 font-semibold focus:ring-2 focus:ring-green-500 focus:bg-white"
            placeholder={role === 'FARMER' ? 'e.g. Ramesh Kumar' : 'e.g. Apollo Hospital Kitchen'}
          />
        </div>

        {role === 'BUYER' && (
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Organization Type
            </label>
            <select
              value={orgType}
              onChange={(e) => setOrgType(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 font-semibold focus:ring-2 focus:ring-green-500 focus:bg-white font-semibold"
            >
              <option value="HOSPITAL">Hospital</option>
              <option value="HOTEL">Hotel</option>
              <option value="HOSTEL">Hostel</option>
              <option value="CANTEEN">Canteen / Mess</option>
              <option value="RESTAURANT">Restaurant</option>
              <option value="RETAILER">Retailer</option>
              <option value="DISTRIBUTOR">Food Service Distributor</option>
            </select>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Phone Number
            </label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 font-semibold focus:ring-2 focus:ring-green-500 focus:bg-white"
              placeholder="e.g. 9876543299"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Email (Optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 font-semibold focus:ring-2 focus:ring-green-500 focus:bg-white"
              placeholder="user@domain.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 font-semibold focus:ring-2 focus:ring-green-500 focus:bg-white"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
            Location Address
          </label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 font-semibold focus:ring-2 focus:ring-green-500 focus:bg-white"
            placeholder="e.g. Village Nelamangala, Bengaluru Rural"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow transition flex items-center justify-center gap-2"
        >
          {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
          Complete Registration
        </button>
      </form>

      <div className="mt-4 text-center text-xs text-gray-500">
        Already have an account?{' '}
        <Link to="/login" className="text-green-600 font-bold hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
};
