import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  Sprout, 
  LogOut, 
  User, 
  Building2, 
  ShieldCheck, 
  Layers, 
  Truck, 
  Factory, 
  History, 
  Coins, 
  BookOpen, 
  PlusCircle,
  Menu,
  X
} from 'lucide-react';
import { TrustBadge } from '../ui/TrustBadge';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="p-2 bg-green-700 rounded-xl text-white group-hover:bg-green-800 transition">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-black text-stone-900 tracking-tight">Farm<span className="text-green-700">Unity</span></span>
                <span className="block text-[9px] uppercase font-bold text-stone-600 tracking-wider">Many Farms · One Stronger Supply</span>
              </div>
            </Link>

            {/* Role-Specific Desktop Links */}
            {isAuthenticated && (
              <div className="hidden lg:flex items-center gap-1 ml-4 text-xs font-bold text-stone-600">
                {user?.role === 'FARMER' && (
                  <>
                    <Link 
                      to="/farmer" 
                      className={`px-3 py-1.5 rounded-lg transition ${isActive('/farmer') ? 'text-green-800 bg-green-50' : 'hover:text-stone-900 hover:bg-stone-50'}`}
                    >
                      My Produce Lots
                    </Link>
                    <Link 
                      to="/farmer/listings/new" 
                      className={`px-3 py-1.5 rounded-lg text-green-700 bg-green-50/80 hover:bg-green-100 transition flex items-center gap-1`}
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> Sell Produce
                    </Link>
                    <Link 
                      to="/agreements/1" 
                      className="px-3 py-1.5 rounded-lg hover:text-stone-900 hover:bg-stone-50 transition"
                    >
                      Agreements
                    </Link>
                    <Link 
                      to="/settlements/1" 
                      className="px-3 py-1.5 rounded-lg hover:text-stone-900 hover:bg-stone-50 transition"
                    >
                      Earnings & Payouts
                    </Link>
                  </>
                )}

                {user?.role === 'BUYER' && (
                  <>
                    <Link 
                      to="/buyer" 
                      className={`px-3 py-1.5 rounded-lg transition ${isActive('/buyer') ? 'text-blue-800 bg-blue-50' : 'hover:text-stone-900 hover:bg-stone-50'}`}
                    >
                      Procurement Demands
                    </Link>
                    <Link 
                      to="/buyer/requirements/new" 
                      className="px-3 py-1.5 rounded-lg text-blue-700 bg-blue-50/80 hover:bg-blue-100 transition flex items-center gap-1"
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> Post Bulk Demand
                    </Link>
                    <Link 
                      to="/buyer/batches/1" 
                      className="px-3 py-1.5 rounded-lg hover:text-stone-900 hover:bg-stone-50 transition"
                    >
                      Cooperative Batches
                    </Link>
                    <Link 
                      to="/agreements/1" 
                      className="px-3 py-1.5 rounded-lg hover:text-stone-900 hover:bg-stone-50 transition"
                    >
                      Contracts
                    </Link>
                  </>
                )}

                {user?.role === 'COORDINATOR' && (
                  <>
                    <Link 
                      to="/coordinator" 
                      className={`px-3 py-1.5 rounded-lg transition ${isActive('/coordinator') ? 'text-stone-900 bg-stone-100' : 'hover:text-stone-900 hover:bg-stone-50'}`}
                    >
                      Operations Desk
                    </Link>
                    <Link 
                      to="/coordinator/verify" 
                      className="px-3 py-1.5 rounded-lg hover:text-green-700 hover:bg-stone-50 transition"
                    >
                      Quality Inspection
                    </Link>
                    <Link 
                      to="/coordinator/batches/form" 
                      className="px-3 py-1.5 rounded-lg hover:text-blue-700 hover:bg-stone-50 transition"
                    >
                      Form Cooperative
                    </Link>
                    <Link 
                      to="/coordinator/pickup/1" 
                      className="px-3 py-1.5 rounded-lg hover:text-amber-800 hover:bg-stone-50 transition"
                    >
                      Pickup Route
                    </Link>
                    <Link 
                      to="/coordinator/milling" 
                      className="px-3 py-1.5 rounded-lg hover:text-purple-700 hover:bg-stone-50 transition"
                    >
                      Milling
                    </Link>
                    <Link 
                      to="/audit/1" 
                      className="px-3 py-1.5 rounded-lg hover:text-stone-900 hover:bg-stone-50 transition"
                    >
                      Audit Trail
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right Action Items */}
          <div className="flex items-center gap-3">
            <Link 
              to="/methods" 
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-stone-600 hover:text-stone-900 hover:bg-stone-50 border border-stone-200/80 transition"
            >
              <BookOpen className="w-3.5 h-3.5 text-stone-500" />
              <span>Methods & Architecture</span>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <span>{user?.name}</span>
                    <TrustBadge tier={user?.trustTier} />
                  </div>
                  <div className="text-[10px] text-stone-600 font-semibold uppercase">{user?.role}</div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 text-stone-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-bold text-stone-700 hover:text-stone-900 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-bold text-white bg-green-700 hover:bg-green-800 rounded-xl shadow-xs transition"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile hamburger button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-600 hover:text-stone-900 rounded-lg lg:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-5 space-y-2 text-sm font-semibold">
          <Link 
            to="/methods" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-stone-600 hover:text-green-700"
          >
            Methods & Architecture
          </Link>

          {isAuthenticated ? (
            <>
              {user?.role === 'FARMER' && (
                <>
                  <Link to="/farmer" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-stone-800">My Produce Lots</Link>
                  <Link to="/farmer/listings/new" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-green-700 font-bold">+ Sell Produce</Link>
                  <Link to="/agreements/1" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-stone-800">Agreements</Link>
                  <Link to="/settlements/1" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-stone-800">Earnings & Payouts</Link>
                </>
              )}
              {user?.role === 'BUYER' && (
                <>
                  <Link to="/buyer" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-stone-800">Procurement Demands</Link>
                  <Link to="/buyer/requirements/new" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-blue-700 font-bold">+ Post Bulk Demand</Link>
                  <Link to="/buyer/batches/1" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-stone-800">Cooperative Batches</Link>
                </>
              )}
              {user?.role === 'COORDINATOR' && (
                <>
                  <Link to="/coordinator" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-stone-800">Operations Desk</Link>
                  <Link to="/coordinator/verify" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-stone-800">Quality Inspection</Link>
                  <Link to="/coordinator/batches/form" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-stone-800">Cooperative Formation</Link>
                  <Link to="/coordinator/pickup/1" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-stone-800">Pickup Route</Link>
                  <Link to="/coordinator/milling" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-stone-800">Milling</Link>
                  <Link to="/audit/1" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-stone-800">Audit Trail</Link>
                </>
              )}
              <button
                onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                className="w-full text-left py-2 text-red-600 font-bold"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 border-t border-stone-100 flex gap-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 bg-stone-100 text-stone-800 rounded-lg text-xs font-bold text-center flex-1">Sign In</Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 bg-green-700 text-white rounded-lg text-xs font-bold text-center flex-1">Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
