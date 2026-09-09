import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  UserCheck, 
  Layers, 
  MapPin, 
  Factory, 
  History, 
  ArrowRight, 
  AlertTriangle,
  RefreshCw,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { FailureSimulationModal } from '../../components/operations/FailureSimulationModal';

export const CoordinatorDashboard = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-8">
      {/* Failure Simulation Modal */}
      <FailureSimulationModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
      />

      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-800 border border-stone-200">
            <ShieldCheck className="w-3.5 h-3.5 text-stone-700" />
            <span>Regional Operations Desk · Bengaluru Rural</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Fulfilment & Quality Coordination
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl leading-relaxed">
            Certify physical farm lots, run demand-driven cooperative pooling, coordinate waypoint pickups, and oversee processing.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-stone-900 hover:bg-black text-white text-xs sm:text-sm font-bold rounded-2xl shadow-sm hover:shadow transition shrink-0"
        >
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Simulate Failure & Recovery</span>
        </button>
      </div>

      {/* Resilience Highlight Card */}
      <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-100 text-amber-800 rounded-xl shrink-0 mt-0.5">
            <RefreshCw className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
              First-Class Failure Recovery Engine Active
            </h4>
            <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
              When a farmer cancels or a vehicle breaks down, the platform triggers automated pro-rata replacement from standby verified lots within 35 km.
            </p>
          </div>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold rounded-xl transition shrink-0 shadow-xs"
        >
          Test Self-Healing Scenarios
        </button>
      </div>

      {/* Operational Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/coordinator/verify"
          className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs hover:shadow-md hover:border-green-300 transition group flex flex-col justify-between"
        >
          <div>
            <div className="p-3 bg-green-100 text-green-700 rounded-2xl w-fit mb-4 group-hover:bg-green-700 group-hover:text-white transition">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900">1. Physical Quality Verification</h3>
            <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
              Test moisture percentage on-site (12–14% target band for paddy), certify grade, and weigh sample bags.
            </p>
          </div>
          <div className="mt-5 text-xs font-bold text-green-700 flex items-center gap-1.5 pt-4 border-t border-stone-100">
            <span>Open Inspection Terminal</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </div>
        </Link>

        <Link
          to="/coordinator/batches/form"
          className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs hover:shadow-md hover:border-blue-300 transition group flex flex-col justify-between"
        >
          <div>
            <div className="p-3 bg-blue-100 text-blue-700 rounded-2xl w-fit mb-4 group-hover:bg-blue-700 group-hover:text-white transition">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900">2. Demand-Driven Pooling</h3>
            <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
              Group nearby verified smallholder harvests to satisfy bulk orders from hospitals, canteens, and processors.
            </p>
          </div>
          <div className="mt-5 text-xs font-bold text-blue-700 flex items-center gap-1.5 pt-4 border-t border-stone-100">
            <span>Form Cooperative Pool</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </div>
        </Link>

        <Link
          to="/coordinator/pickup/1"
          className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs hover:shadow-md hover:border-amber-300 transition group flex flex-col justify-between"
        >
          <div>
            <div className="p-3 bg-amber-100 text-amber-800 rounded-2xl w-fit mb-4 group-hover:bg-amber-700 group-hover:text-white transition">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900">3. Sequenced Pickup Logistics</h3>
            <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
              Optimized farm-gate collection route on OpenStreetMap. Record loading weighments and absent-farmer exceptions.
            </p>
          </div>
          <div className="mt-5 text-xs font-bold text-amber-800 flex items-center gap-1.5 pt-4 border-t border-stone-100">
            <span>View Logistics Route</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </div>
        </Link>

        <Link
          to="/coordinator/milling"
          className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs hover:shadow-md hover:border-purple-300 transition group flex flex-col justify-between"
        >
          <div>
            <div className="p-3 bg-purple-100 text-purple-700 rounded-2xl w-fit mb-4 group-hover:bg-purple-700 group-hover:text-white transition">
              <Factory className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900">4. Processing & Milling Oversight</h3>
            <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
              Issue work orders to partner mills. Track raw intake vs output yield ratio and manage processor fee ledger.
            </p>
          </div>
          <div className="mt-5 text-xs font-bold text-purple-700 flex items-center gap-1.5 pt-4 border-t border-stone-100">
            <span>Milling Operations</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </div>
        </Link>

        <Link
          to="/audit/1"
          className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs hover:shadow-md hover:border-stone-400 transition group flex flex-col justify-between"
        >
          <div>
            <div className="p-3 bg-stone-100 text-stone-700 rounded-2xl w-fit mb-4 group-hover:bg-stone-800 group-hover:text-white transition">
              <History className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900">5. Audit & Integrity Timeline</h3>
            <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
              Trace chronological state transitions, SHA-256 hash chains, and coordinator physical sign-offs.
            </p>
          </div>
          <div className="mt-5 text-xs font-bold text-stone-700 flex items-center gap-1.5 pt-4 border-t border-stone-100">
            <span>Inspect Audit Ledger</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </div>
        </Link>
      </div>
    </div>
  );
};
