import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Sprout, LogOut, User, ShieldCheck } from 'lucide-react';
import { TrustBadge } from '../ui/TrustBadge';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-green-600 rounded-lg text-white group-hover:bg-green-700 transition">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-black text-gray-900 tracking-tight">Farm<span className="text-green-600">Unity</span></span>
                <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">Direct Agricultural Trade Network</span>
              </div>
            </Link>

            {isAuthenticated && (
              <div className="hidden md:flex items-center gap-4 ml-8 text-sm font-medium">
                {user?.role === 'FARMER' && (
                  <>
                    <Link to="/farmer" className="text-gray-600 hover:text-green-600">My Listings</Link>
                    <Link to="/farmer/listings/new" className="text-gray-600 hover:text-green-600">+ New Produce</Link>
                  </>
                )}
                {user?.role === 'BUYER' && (
                  <>
                    <Link to="/buyer" className="text-gray-600 hover:text-green-600">My Requirements</Link>
                    <Link to="/buyer/requirements/new" className="text-gray-600 hover:text-green-600">+ Bulk Demand</Link>
                  </>
                )}
                {user?.role === 'COORDINATOR' && (
                  <>
                    <Link to="/coordinator" className="text-gray-600 hover:text-green-600">Coordinator Hub</Link>
                    <Link to="/coordinator/verify" className="text-gray-600 hover:text-green-600">Quality Inspection</Link>
                    <Link to="/coordinator/milling" className="text-gray-600 hover:text-green-600">Milling</Link>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-bold text-gray-800 flex items-center gap-2">
                    <span>{user?.name}</span>
                    <TrustBadge tier={user?.trustTier} />
                  </div>
                  <div className="text-xs text-gray-400 uppercase font-semibold">{user?.role}</div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
