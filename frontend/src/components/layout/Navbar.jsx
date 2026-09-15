import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import {
  Sprout,
  LogOut,
  User,
  PlusCircle,
  Menu,
  X,
  AlertCircle,
  Layers,
  FileText,
  Truck,
  CheckCircle2,
  Cpu,
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItemClass = (path) =>
    `px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
      isActive(path)
        ? 'bg-green-100 text-green-900 border border-green-200'
        : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
    }`;

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="p-2 bg-green-800 rounded-lg text-white">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-stone-900">
                  Farm<span className="text-green-800">Unity</span>
                </span>
                <span className="hidden sm:block text-[10px] text-stone-500 font-medium tracking-tight">
                  {t('brand_tagline')}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            {isAuthenticated && (
              <nav className="hidden md:flex items-center gap-1.5 ml-4">
                {user?.role === 'FARMER' && (
                  <>
                    <Link to="/farmer" className={navItemClass('/farmer')}>
                      {t('home')}
                    </Link>
                    <Link to="/farmer/listings" className={navItemClass('/farmer/listings')}>
                      {t('my_produce')}
                    </Link>
                    <Link to="/farmer/opportunities" className={navItemClass('/farmer/opportunities')}>
                      {t('opportunities')}
                    </Link>
                    <Link to="/farmer/orders" className={navItemClass('/farmer/orders')}>
                      {t('my_orders')}
                    </Link>
                    <Link to="/farmer/payments" className={navItemClass('/farmer/payments')}>
                      {t('payouts')}
                    </Link>
                  </>
                )}

                {user?.role === 'BUYER' && (
                  <>
                    <Link to="/buyer" className={navItemClass('/buyer')}>
                      Procurement
                    </Link>
                    <Link to="/buyer/requirements" className={navItemClass('/buyer/requirements')}>
                      Demands
                    </Link>
                    <Link to="/buyer/cooperatives" className={navItemClass('/buyer/cooperatives')}>
                      Cooperatives
                    </Link>
                    <Link to="/buyer/orders" className={navItemClass('/buyer/orders')}>
                      Fulfillments
                    </Link>
                  </>
                )}

                {user?.role === 'COORDINATOR' && (
                  <>
                    <Link to="/coordinator" className={navItemClass('/coordinator')}>
                      Operations Desk
                    </Link>
                    <Link to="/coordinator/verify" className={navItemClass('/coordinator/verify')}>
                      Quality Checks
                    </Link>
                    <Link to="/coordinator/batches" className={navItemClass('/coordinator/batches')}>
                      Batches
                    </Link>
                    <Link to="/coordinator/exceptions" className={navItemClass('/coordinator/exceptions')}>
                      <span className="inline-flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        Exceptions
                      </span>
                    </Link>
                  </>
                )}

                <Link to="/methods" className={navItemClass('/methods')}>
                  Architecture & Methods
                </Link>
              </nav>
            )}
          </div>

          {/* Right Action Area */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* Primary Action Button */}
                {user?.role === 'FARMER' && (
                  <Link
                    to="/farmer/listings/new"
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-800 hover:bg-green-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                  >
                    <PlusCircle className="w-4 h-4" />
                    {t('sell_produce')}
                  </Link>
                )}

                {user?.role === 'BUYER' && (
                  <Link
                    to="/buyer/requirements/new"
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-800 hover:bg-green-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Post Demand
                  </Link>
                )}

                {/* User Identity Chip */}
                <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-stone-900 leading-tight">
                      {user?.name || user?.sub}
                    </p>
                    <p className="text-[10px] text-stone-500 font-medium">
                      {user?.role}
                    </p>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
                    title={t('sign_out')}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-md transition-colors"
                >
                  {t('sign_in')}
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 text-xs font-semibold bg-green-800 hover:bg-green-900 text-white rounded-md transition-colors shadow-xs"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-md text-stone-600 hover:bg-stone-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-stone-200 space-y-1 text-sm font-medium">
            {isAuthenticated ? (
              <>
                {user?.role === 'FARMER' && (
                  <>
                    <Link
                      to="/farmer"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-md hover:bg-stone-100"
                    >
                      {t('home')}
                    </Link>
                    <Link
                      to="/farmer/listings"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-md hover:bg-stone-100"
                    >
                      {t('my_produce')}
                    </Link>
                    <Link
                      to="/farmer/opportunities"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-md hover:bg-stone-100"
                    >
                      {t('opportunities')}
                    </Link>
                    <Link
                      to="/farmer/listings/new"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 text-green-800 font-bold hover:bg-stone-100"
                    >
                      + {t('sell_produce')}
                    </Link>
                  </>
                )}

                {user?.role === 'BUYER' && (
                  <>
                    <Link
                      to="/buyer"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-md hover:bg-stone-100"
                    >
                      Procurement Overview
                    </Link>
                    <Link
                      to="/buyer/requirements/new"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 text-green-800 font-bold hover:bg-stone-100"
                    >
                      + Post Demand
                    </Link>
                  </>
                )}

                {user?.role === 'COORDINATOR' && (
                  <>
                    <Link
                      to="/coordinator"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-md hover:bg-stone-100"
                    >
                      Operations Desk
                    </Link>
                    <Link
                      to="/coordinator/verify"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-md hover:bg-stone-100"
                    >
                      Quality Checks
                    </Link>
                  </>
                )}

                <Link
                  to="/methods"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-stone-600 hover:bg-stone-100"
                >
                  Architecture & Methods
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-red-700 hover:bg-red-50 rounded-md"
                >
                  {t('sign_out')}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md hover:bg-stone-100"
                >
                  {t('sign_in')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-green-800 font-bold hover:bg-stone-100"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
