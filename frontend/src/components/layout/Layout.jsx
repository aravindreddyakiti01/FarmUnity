import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { OfflineIndicator } from '../offline/OfflineIndicator';

export const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <OfflineIndicator />
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-400">
        <p>FarmUnity &copy; {new Date().getFullYear()} — Decentralized Agricultural Fulfilment &amp; Direct Trade Network</p>
        <p className="mt-1">Transparent Cooperative Batching · Certified Physical Verification · Protected Settlement Guarantee</p>
      </footer>
    </div>
  );
};
