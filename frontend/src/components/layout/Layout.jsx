import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { OfflineIndicator } from '../offline/OfflineIndicator';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import { Home, Sprout, PlusCircle, Compass, Coins } from 'lucide-react';

export const Layout = () => {
  const { user, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();

  const isFarmer = isAuthenticated && user?.role === 'FARMER';

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans text-stone-900 pb-20 md:pb-0">
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
            className={`flex flex-col items-center text-[10px] font-semibold ${
              location.pathname === '/farmer' ? 'text-green-800' : 'text-stone-500'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span>{t('home')}</span>
          </Link>

          <Link
            to="/farmer/listings"
            className={`flex flex-col items-center text-[10px] font-semibold ${
              location.pathname === '/farmer/listings' ? 'text-green-800' : 'text-stone-500'
            }`}
          >
            <Sprout className="w-5 h-5 mb-0.5" />
            <span>{t('my_produce')}</span>
          </Link>

          {/* Prominent Action Button: Sell Produce */}
          <Link
            to="/farmer/listings/new"
            className="flex flex-col items-center -mt-5 bg-green-800 hover:bg-green-900 text-white p-3 rounded-full shadow-md border-2 border-white transition-transform active:scale-95"
            title={t('sell_produce')}
          >
            <PlusCircle className="w-6 h-6" />
          </Link>

          <Link
            to="/farmer/opportunities"
            className={`flex flex-col items-center text-[10px] font-semibold ${
              location.pathname === '/farmer/opportunities' ? 'text-green-800' : 'text-stone-500'
            }`}
          >
            <Compass className="w-5 h-5 mb-0.5" />
            <span>{t('opportunities')}</span>
          </Link>

          <Link
            to="/farmer/payments"
            className={`flex flex-col items-center text-[10px] font-semibold ${
              location.pathname === '/farmer/payments' ? 'text-green-800' : 'text-stone-500'
            }`}
          >
            <Coins className="w-5 h-5 mb-0.5" />
            <span>{t('payouts')}</span>
          </Link>
        </nav>
      )}

      {/* Clean, calm professional footer */}
      <footer className="bg-white border-t border-stone-200 py-8 text-center text-xs text-stone-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-stone-600">
            <Link to="/" className="hover:text-stone-900">Home</Link>
            <span>&middot;</span>
            <Link to="/methods" className="hover:text-stone-900">System Architecture & Methods</Link>
            <span>&middot;</span>
            <Link to="/coordinator" className="hover:text-stone-900">Operations Desk</Link>
            <span>&middot;</span>
            <Link to="/login" className="hover:text-stone-900">Sign In</Link>
          </div>
          <p className="text-stone-400 text-[11px] pt-1">
            FarmUnity &copy; {new Date().getFullYear()} &mdash; Many small farms. One stronger supply.
          </p>
          <p className="text-[10px] text-stone-400">
            Certified On-Farm Moisture Check &middot; Demand-Driven Cooperative Pooling &middot; Tamper-Evident SHA-256 Audit Trail
          </p>
        </div>
      </footer>
    </div>
  );
};
