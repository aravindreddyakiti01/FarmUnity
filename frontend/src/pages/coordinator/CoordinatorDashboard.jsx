import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, UserCheck, Layers, MapPin, Factory, History, ArrowRight } from 'lucide-react';

export const CoordinatorDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Regional Coordinator Operations Hub</h1>
          <p className="text-xs text-gray-500 mt-1">
            Deterministic quality inspection, greedy cooperative batch formation, logistics coordination, and milling oversight.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold border border-purple-300">
          <ShieldCheck className="w-4 h-4 text-purple-600" /> Bengaluru Rural District
        </div>
      </div>

      {/* Operational Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/coordinator/verify"
          className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-green-300 transition group"
        >
          <div className="p-3 bg-green-100 text-green-700 rounded-xl w-fit mb-4 group-hover:bg-green-600 group-hover:text-white transition">
            <UserCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">1. Quality Inspection</h3>
          <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
            Record moisture percentage with deterministic band filter (12–14% for paddy). Mark compatible or route to drying.
          </p>
          <div className="mt-4 text-xs font-bold text-green-600 flex items-center gap-1">
            Open Inspection Terminal <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          to="/coordinator/batches/form"
          className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition group"
        >
          <div className="p-3 bg-blue-100 text-blue-700 rounded-xl w-fit mb-4 group-hover:bg-blue-600 group-hover:text-white transition">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">2. Cooperative Clustering</h3>
          <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
            Form dynamic cooperative batches from compatible verified farmers matching institutional bulk requirements.
          </p>
          <div className="mt-4 text-xs font-bold text-blue-600 flex items-center gap-1">
            Form Cooperative Pool <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          to="/coordinator/pickup/1"
          className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-amber-300 transition group"
        >
          <div className="p-3 bg-amber-100 text-amber-700 rounded-xl w-fit mb-4 group-hover:bg-amber-600 group-hover:text-white transition">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">3. Pickup & Logistics Route</h3>
          <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
            Nearest-neighbour pickup sequence on Leaflet OSM. Handle collection verification and absent-farmer recovery.
          </p>
          <div className="mt-4 text-xs font-bold text-amber-600 flex items-center gap-1">
            View Logistics Map <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          to="/coordinator/milling"
          className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-purple-300 transition group"
        >
          <div className="p-3 bg-purple-100 text-purple-700 rounded-xl w-fit mb-4 group-hover:bg-purple-600 group-hover:text-white transition">
            <Factory className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">4. Milling & Processing</h3>
          <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
            Issue work order to local rice mill. Track input vs output yield ratio and flag shortfalls automatically.
          </p>
          <div className="mt-4 text-xs font-bold text-purple-600 flex items-center gap-1">
            Processing Oversight <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          to="/audit/1"
          className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-400 transition group"
        >
          <div className="p-3 bg-gray-100 text-gray-700 rounded-xl w-fit mb-4 group-hover:bg-gray-800 group-hover:text-white transition">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">5. Cryptographic Audit Trail</h3>
          <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
            Inspect end-to-end state transitions, SHA-256 canonical integrity proofs, and human verification actions.
          </p>
          <div className="mt-4 text-xs font-bold text-gray-700 flex items-center gap-1">
            Inspect Audit Logs <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>
      </div>
    </div>
  );
};
