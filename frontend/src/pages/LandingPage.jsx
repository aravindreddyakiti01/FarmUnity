import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  Building2, 
  ShieldCheck, 
  Scale, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  Activity, 
  Globe2, 
  Layers, 
  ChevronRight,
  TrendingUp,
  Cpu
} from 'lucide-react';

export const LandingPage = () => {
  const [activePillar, setActivePillar] = useState(0);

  const pillars = [
    {
      id: 'clustering',
      title: 'Decentralized Pooling',
      subtitle: 'Greedy Haversine Clustering',
      icon: Layers,
      color: 'emerald',
      borderColor: 'border-emerald-500',
      bgColor: 'bg-emerald-500/10',
      textColor: 'text-emerald-400',
      description: 'Aggregates smallholder farmers within a geographic radius into cohesive single bulk delivery batches, eliminating predatory intermediaries.',
      metric: '100% Floor Protection',
      stat: '0 Intermediary Cuts'
    },
    {
      id: 'verification',
      title: 'Deterministic Quality',
      subtitle: 'Strict Moisture & Grade Verification',
      icon: ShieldCheck,
      color: 'cyan',
      borderColor: 'border-cyan-500',
      bgColor: 'bg-cyan-500/10',
      textColor: 'text-cyan-400',
      description: 'Physical inspection enforcing strict crop parameter bands (e.g. 12-14% moisture for Paddy) before batch allocation can commence.',
      metric: 'Physical Gate Verification',
      stat: 'SHA-256 Audit Trail'
    },
    {
      id: 'escrow',
      title: 'Protected Commitments',
      subtitle: 'Automated Settlement Protocol',
      icon: Lock,
      color: 'amber',
      borderColor: 'border-amber-500',
      bgColor: 'bg-amber-500/10',
      textColor: 'text-amber-400',
      description: 'Guarantees payment through locked commitment deposits. Capital is held secure and released exclusively upon verified physical delivery.',
      metric: '100% Escrow Protection',
      stat: 'Verified Qty Payout'
    },
    {
      id: 'direct-demand',
      title: 'Direct Institutional Demand',
      subtitle: 'Traceable Commercial Procurement',
      icon: Building2,
      color: 'blue',
      borderColor: 'border-blue-500',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-400',
      description: 'Direct procurement channel for hospitals, hostels, canteens, and bulk processors, bypassing multiple middleman commissions.',
      metric: 'Direct Wholesale Volume',
      stat: 'Zero Broker Margin'
    }
  ];

  // Auto-rotate active pillar every 4 seconds if user doesn't hover
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePillar((prev) => (prev + 1) % pillars.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [pillars.length]);

  return (
    <div className="bg-slate-950 text-slate-100 -mx-4 sm:-mx-6 lg:-mx-8 -my-8 px-4 sm:px-6 lg:px-8 py-8 space-y-24 min-h-screen">
      {/* Hero Section with Farmsent-inspired Central Rotating Orbit */}
      <section className="relative overflow-hidden pt-8 pb-16">
        {/* Glow ambient backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/15 blur-[140px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-cyan-500/10 blur-[130px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-emerald-950/80 border border-emerald-700/60 text-emerald-400 backdrop-blur-md shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Global Direct Agriculture Protocol
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
              Decentralized Global Trade for <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Agricultural Producers</span>
            </h1>
            
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
              Connecting smallholders directly to institutional buyers through verifiable physical quality gates, automated batch pooling, and cryptographically settled contracts.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to="/register"
                className="px-7 py-3.5 text-sm font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 rounded-xl shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                Launch Protocol <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="px-7 py-3.5 text-sm font-bold text-slate-200 bg-slate-900/80 hover:bg-slate-800 rounded-xl border border-slate-700/80 backdrop-blur-md transition flex items-center gap-2"
              >
                Sign In to Platform
              </Link>
            </div>
          </div>

          {/* FARMSENT-STYLE DYNAMIC ROTATING CIRCLE LOGO WITH 4 HIGHLIGHTED PILLARS */}
          <div className="mt-20 relative max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Interactive Pillar 0 and 1 */}
              <div className="lg:col-span-3 space-y-4 order-2 lg:order-1">
                {[0, 1].map((idx) => {
                  const p = pillars[idx];
                  const Icon = p.icon;
                  const isActive = activePillar === idx;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setActivePillar(idx)}
                      className={`cursor-pointer p-4 rounded-2xl border transition-all duration-300 ${
                        isActive
                          ? 'bg-slate-900/90 border-emerald-500/80 shadow-lg shadow-emerald-500/10 scale-102'
                          : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${p.bgColor} ${p.textColor}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">0{idx + 1} // Step</span>
                          <h4 className="text-sm font-bold text-white">{p.title}</h4>
                        </div>
                      </div>
                      {isActive && (
                        <p className="text-xs text-slate-400 mt-2.5 leading-relaxed pl-1">
                          {p.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Center: Dynamic Animated Circle with Rotating Orbit & FarmUnity Core */}
              <div className="lg:col-span-6 flex justify-center items-center py-6 order-1 lg:order-2">
                <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center">
                  
                  {/* Outer Orbit Ring with dashed border */}
                  <div className="absolute inset-0 rounded-full border border-dashed border-emerald-500/30 animate-spin-slow" />
                  
                  {/* Reverse Rotating Counter Ring */}
                  <div className="absolute inset-6 rounded-full border border-slate-800 animate-spin-reverse" />
                  
                  {/* Ambient Core Glow */}
                  <div className="absolute w-56 h-56 rounded-full bg-emerald-500/20 blur-2xl animate-pulse-glow" />
                  
                  {/* Central Hub Disc */}
                  <div className="relative z-20 w-44 h-44 rounded-full bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 border-emerald-500/60 shadow-2xl flex flex-col items-center justify-center p-4 text-center">
                    <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl mb-1.5 border border-emerald-500/40">
                      <Sprout className="w-8 h-8 animate-pulse" />
                    </div>
                    <span className="text-lg font-black text-white tracking-wider">
                      FARM<span className="text-emerald-400">UNITY</span>
                    </span>
                    <span className="text-[9px] uppercase tracking-widest text-emerald-400/80 font-bold mt-0.5">
                      DIRECT PROTOCOL
                    </span>
                  </div>

                  {/* 4 Satellite Nodes along Orbit */}
                  {/* Top Node: Point 1 (Decentralized Pooling) */}
                  <div 
                    onClick={() => setActivePillar(0)}
                    className={`absolute -top-3 left-1/2 -translate-x-1/2 z-30 cursor-pointer transition-all duration-300 ${
                      activePillar === 0 ? 'scale-125' : 'scale-95 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className={`p-3 rounded-full bg-slate-900 border-2 ${activePillar === 0 ? 'border-emerald-400 bg-emerald-950 text-emerald-300 shadow-lg shadow-emerald-500/50' : 'border-slate-700 text-slate-400'}`}>
                      <Layers className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Right Node: Point 2 (Deterministic Quality) */}
                  <div 
                    onClick={() => setActivePillar(1)}
                    className={`absolute -right-3 top-1/2 -translate-y-1/2 z-30 cursor-pointer transition-all duration-300 ${
                      activePillar === 1 ? 'scale-125' : 'scale-95 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className={`p-3 rounded-full bg-slate-900 border-2 ${activePillar === 1 ? 'border-cyan-400 bg-cyan-950 text-cyan-300 shadow-lg shadow-cyan-500/50' : 'border-slate-700 text-slate-400'}`}>
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Bottom Node: Point 3 (Protected Commitments) */}
                  <div 
                    onClick={() => setActivePillar(2)}
                    className={`absolute -bottom-3 left-1/2 -translate-x-1/2 z-30 cursor-pointer transition-all duration-300 ${
                      activePillar === 2 ? 'scale-125' : 'scale-95 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className={`p-3 rounded-full bg-slate-900 border-2 ${activePillar === 2 ? 'border-amber-400 bg-amber-950 text-amber-300 shadow-lg shadow-amber-500/50' : 'border-slate-700 text-slate-400'}`}>
                      <Lock className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Left Node: Point 4 (Direct Institutional Demand) */}
                  <div 
                    onClick={() => setActivePillar(3)}
                    className={`absolute -left-3 top-1/2 -translate-y-1/2 z-30 cursor-pointer transition-all duration-300 ${
                      activePillar === 3 ? 'scale-125' : 'scale-95 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className={`p-3 rounded-full bg-slate-900 border-2 ${activePillar === 3 ? 'border-blue-400 bg-blue-950 text-blue-300 shadow-lg shadow-blue-500/50' : 'border-slate-700 text-slate-400'}`}>
                      <Building2 className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Pillar 2 and 3 */}
              <div className="lg:col-span-3 space-y-4 order-3">
                {[2, 3].map((idx) => {
                  const p = pillars[idx];
                  const Icon = p.icon;
                  const isActive = activePillar === idx;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setActivePillar(idx)}
                      className={`cursor-pointer p-4 rounded-2xl border transition-all duration-300 ${
                        isActive
                          ? 'bg-slate-900/90 border-emerald-500/80 shadow-lg shadow-emerald-500/10 scale-102'
                          : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${p.bgColor} ${p.textColor}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">0{idx + 1} // Step</span>
                          <h4 className="text-sm font-bold text-white">{p.title}</h4>
                        </div>
                      </div>
                      {isActive && (
                        <p className="text-xs text-slate-400 mt-2.5 leading-relaxed pl-1">
                          {p.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Protocol Metrics Bar */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
          <div className="text-center p-3">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">100%</div>
            <div className="text-xs text-slate-400 uppercase font-semibold mt-1">Direct Settlement</div>
          </div>
          <div className="text-center p-3 border-l border-slate-800">
            <div className="text-2xl sm:text-3xl font-black text-cyan-400">0%</div>
            <div className="text-xs text-slate-400 uppercase font-semibold mt-1">Broker Commissions</div>
          </div>
          <div className="text-center p-3 border-l border-slate-800">
            <div className="text-2xl sm:text-3xl font-black text-teal-400">SHA-256</div>
            <div className="text-xs text-slate-400 uppercase font-semibold mt-1">Audit Trail Integrity</div>
          </div>
          <div className="text-center p-3 border-l border-slate-800">
            <div className="text-2xl sm:text-3xl font-black text-amber-400">Instant</div>
            <div className="text-xs text-slate-400 uppercase font-semibold mt-1">Escrow Delivery Release</div>
          </div>
        </div>
      </section>

      {/* Ecosystem Participants Section */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-white">Three Unified Market Roles</h2>
          <p className="text-sm text-slate-400 mt-2">Every participant interacts with transparent deterministic rules.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/50 transition duration-300">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
              <Sprout className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Producers & Smallholders</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Create listings with guaranteed minimum floor prices. Aggregate with nearby growers to fulfill high-volume institutional demand contracts without middlemen margin leaks.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 transition duration-300">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Institutional Procurement</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Procure verified, sorted staple grains directly. Transparent pricing with moisture-grade certification and protected commitment release upon physical arrival.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-purple-500/50 transition duration-300">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Quality & Batch Coordinators</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Perform physical quality inspection, verify weight calibration, coordinate milling, and validate waypoint delivery to finalize cryptographic ledger payouts.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

