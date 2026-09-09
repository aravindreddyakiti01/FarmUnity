import React, { useState } from 'react';
import { 
  AlertTriangle, 
  RefreshCw, 
  CheckCircle2, 
  Truck, 
  Droplet, 
  Users, 
  X, 
  ArrowRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export const FailureSimulationModal = ({ isOpen, onClose, onRecoveryComplete }) => {
  const [selectedScenario, setSelectedScenario] = useState('farmer_shortage');
  const [simulationState, setSimulationState] = useState('idle'); // idle | running | resolved
  const [logs, setLogs] = useState([]);

  if (!isOpen) return null;

  const scenarios = [
    {
      id: 'farmer_shortage',
      title: 'Farmer Supply Shortfall / Drop',
      icon: Users,
      badge: 'Allocation Failure',
      color: 'amber',
      problem: 'Allocated farmer reports a 200 kg deficit due to storage damage right before collection dispatch.',
      steps: [
        'Flagging membership status as SHORTAGE_DETECTED',
        'Scanning local pool for verified compatible standby listings within 35 km...',
        'Found matching reserve: Farmer Anand Gowda (200 kg Paddy, Verified 13.1% moisture)',
        'Executing auto-rebalance & updating cooperative batch allocation matrix',
        'Buyer requirement satisfied 100% without order cancellation'
      ]
    },
    {
      id: 'transit_breakdown',
      title: 'Vehicle Breakdown in Transit',
      icon: Truck,
      badge: 'Logistics Failure',
      color: 'blue',
      problem: 'Collection truck KA-04-E-8921 experienced mechanical failure at Waypoint #2.',
      steps: [
        'Receiving telemetry alert: Vehicle stopped > 45 mins off schedule',
        'Staging produce at certified Hoskote Rural Collection godown',
        'Rerouting secondary transport vehicle KA-53-M-4412 from regional depot',
        'Recalculating nearest-neighbour pickup sequence with +40 min ETA adjustment',
        'Pushing real-time route update & revised delivery waypoint to buyer portal'
      ]
    },
    {
      id: 'quality_mismatch',
      title: 'Destination Moisture Discrepancy',
      icon: Droplet,
      badge: 'Quality Dispute',
      color: 'red',
      problem: 'Buyer receiving dock meter reports 14.7% moisture vs 13.4% certified farm-gate reading.',
      steps: [
        'Buyer flags discrepancy: Escrow payout auto-paused in HOLD status',
        'Coordinator dispatches digital calibration comparison log with SHA-256 farm proof',
        'Algorithm computes standardized sun-drying moisture deduction allowance: ₹0.45/kg',
        'Farmer and buyer counter-parties review deterministic adjustment terms',
        'Both parties accept adjusted settlement: Escrow released with zero broker litigation'
      ]
    }
  ];

  const currentScenario = scenarios.find(s => s.id === selectedScenario);

  const runSimulation = () => {
    setSimulationState('running');
    setLogs([]);

    currentScenario.steps.forEach((step, idx) => {
      setTimeout(() => {
        setLogs(prev => [...prev, step]);
        if (idx === currentScenario.steps.length - 1) {
          setSimulationState('resolved');
          if (onRecoveryComplete) {
            onRecoveryComplete(currentScenario.id);
          }
        }
      }, (idx + 1) * 700);
    });
  };

  const handleReset = () => {
    setSimulationState('idle');
    setLogs([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-2xl rounded-3xl border border-stone-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">Failure Simulation & Recovery Engine</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Interactive Demo
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Demonstrating deterministic resilience when real agricultural conditions fail.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Scenario Selector Tabs */}
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
              Select Real-World Failure Scenario:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {scenarios.map((s) => {
                const Icon = s.icon;
                const isSelected = selectedScenario === s.id;
                return (
                  <button
                    key={s.id}
                    disabled={simulationState === 'running'}
                    onClick={() => {
                      setSelectedScenario(s.id);
                      handleReset();
                    }}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                      isSelected
                        ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-stone-500'}`} />
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        isSelected ? 'bg-stone-800 text-stone-300' : 'bg-stone-200 text-stone-600'
                      }`}>
                        {s.badge}
                      </span>
                    </div>
                    <span className="text-xs font-bold leading-snug">{s.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Problem Statement Box */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-900 block">Simulated Event:</span>
                <p className="text-amber-800 mt-0.5 leading-relaxed">{currentScenario.problem}</p>
              </div>
            </div>
          </div>

          {/* Execution Terminal / Steps */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-stone-700 uppercase tracking-wide">
                Deterministic Recovery Trace
              </span>
              {simulationState === 'running' && (
                <span className="text-green-700 font-bold flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin" /> Resolving...
                </span>
              )}
              {simulationState === 'resolved' && (
                <span className="text-green-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Recovery Successful
                </span>
              )}
            </div>

            <div className="bg-stone-950 rounded-2xl p-4 font-mono text-xs text-stone-300 min-h-[140px] max-h-[180px] overflow-y-auto space-y-2 border border-stone-800">
              {logs.length === 0 && (
                <div className="text-stone-500 italic flex items-center justify-center h-24">
                  Click "Execute Recovery Protocol" to observe deterministic system self-healing.
                </div>
              )}
              {logs.map((log, i) => (
                <div key={i} className="flex items-start gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                  <span className="text-amber-400 shrink-0">[{i + 1}]</span>
                  <span className={i === logs.length - 1 && simulationState === 'resolved' ? 'text-green-400 font-bold' : 'text-stone-200'}>
                    {log}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className="pt-2 flex items-center justify-between gap-4 border-t border-stone-100">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-stone-500 hover:text-stone-800 transition"
            >
              Close
            </button>

            <div className="flex items-center gap-2">
              {simulationState === 'resolved' && (
                <button
                  onClick={handleReset}
                  className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition"
                >
                  Reset
                </button>
              )}
              <button
                onClick={runSimulation}
                disabled={simulationState === 'running'}
                className="px-6 py-2.5 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2"
              >
                {simulationState === 'running' ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                    <span>Executing Protocol...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Execute Recovery Protocol</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
