import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { OfflineIndicator } from '../offline/OfflineIndicator';
import { useAuth } from '../../hooks/useAuth';
import { Sprout, PlusCircle, Scale, Coins, Home, Building2, ShieldCheck } from 'lucide-react';

export const Layout = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  const isFarmer = isAuthenticated && user?.role === 'FARMER';

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans text-stone-900 pb-16 md:pb-0">
      <OfflineIndicator />
      <Navbar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Outlet />
      </main>

      {/* Mobile Farmer Bottom Navigation Bar */}
      {isFarmer && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200 py-2 px-3 flex items-center justify-around shadow-lg">
          <Link
            to="/farmer"
            className={`flex flex-col items-center text-[10px] font-bold ${
              location.pathname === '/farmer' ? 'text-green-700' : 'text-stone-500'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span>Lots</span>
          </Link>

          <Link
            to="/agreements/1"
            className={`flex flex-col items-center text-[10px] font-bold ${
              location.pathname.startsWith('/agreements') ? 'text-green-700' : 'text-stone-500'
            }`}
          >
            <Scale className="w-5 h-5 mb-0.5" />
            <span>Contracts</span>
          </Link>

          {/* Prominent Action Button: Sell Produce */}
          <Link
            to="/farmer/listings/new"
            className="flex flex-col items-center -mt-5 bg-green-700 hover:bg-green-800 text-white p-2.5 rounded-full shadow-lg border-2 border-white"
            title="List Produce"
          >
            <PlusCircle className="w-6 h-6" />
          </Link>

          <Link
            to="/settlements/1"
            className={`flex flex-col items-center text-[10px] font-bold ${
              location.pathname.startsWith('/settlements') ? 'text-green-700' : 'text-stone-500'
            }`}
          >
            <Coins className="w-5 h-5 mb-0.5" />
            <span>Payouts</span>
          </Link>

          <Link
            to="/methods"
            className={`flex flex-col items-center text-[10px] font-bold ${
              location.pathname === '/methods' ? 'text-green-700' : 'text-stone-500'
            }`}
          >
            <ShieldCheck className="w-5 h-5 mb-0.5" />
            <span>Methods</span>
          </Link>
        </nav>
      )}

      <footer className="bg-white border-t border-stone-200 py-8 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-stone-600">
            <Link to="/" className="hover:text-stone-900">Home</Link>
            <span>&middot;</span>
            <Link to="/methods" className="hover:text-stone-900">Technical Architecture</Link>
            <span>&middot;</span>
            <Link to="/coordinator" className="hover:text-stone-900">Operations Desk</Link>
            <span>&middot;</span>
            <Link to="/login" className="hover:text-stone-900">Sign In</Link>
          </div>
          <p className="text-stone-400 text-[11px] pt-2">
            FarmUnity &copy; {new Date().getFullYear()} — Many small farms. One stronger supply.
          </p>
          <p className="text-[10px] text-stone-400">
            Certified On-Farm Moisture Check &middot; Demand-Driven Cooperative Pooling &middot; Proportional Verified-Weight Settlement
          </p>
        </div>
      </footer>
    </div>
  );
};
