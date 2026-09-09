import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  Building2, 
  ShieldCheck, 
  Scale, 
  ArrowRight, 
  CheckCircle2, 
  Truck, 
  Coins, 
  RefreshCw, 
  AlertTriangle,
  BadgeCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const LandingPage = () => {
  const steps = [
    {
      num: '01',
      title: 'Farmers List Their Harvest',
      desc: 'Smallholders enter crop type, estimated quantity, and field location in 3 easy visual steps with clear photo assistance.',
      badge: 'Simple Mobile Flow',
      icon: Sprout,
      color: 'bg-green-100 text-green-700 border-green-200'
    },
    {
      num: '02',
      title: 'Local Physical Quality Check',
      desc: 'A verified local coordinator tests moisture, certifies grade, and records true weight on-site. No subjective deductions.',
      badge: 'Certified on Farm',
      icon: ShieldCheck,
      color: 'bg-amber-100 text-amber-800 border-amber-200'
    },
    {
      num: '03',
      title: 'Demand-Driven Pooling',
      desc: 'Nearby verified harvests are automatically pooled to fulfill verified wholesale demand from hospitals, hostels, and processors.',
      badge: 'Direct Bulk Volume',
      icon: Scale,
      color: 'bg-blue-100 text-blue-700 border-blue-200'
    },
    {
      num: '04',
      title: 'Direct Fulfilment & Fair Payout',
      desc: 'Produce is dispatched directly. Funds locked in secure escrow are released proportionally based strictly on delivered verified weight.',
      badge: 'Protected Escrow',
      icon: Coins,
      color: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    }
  ];

  const comparisons = [
    {
      factor: 'Farmer Net Payout',
      traditional: '30% - 45% lost to layers of commission agents & brokers',
      farmunity: 'Direct wholesale price. 100% of fair price goes to the farmer',
      winner: true
    },
    {
      factor: 'Quality Dispute & Grading',
      traditional: 'Subjective deductions at mandi gate when farmer has no leverage',
      farmunity: 'Physical moisture & grade check recorded upfront before dispatch',
      winner: true
    },
    {
      factor: 'Payment Timing & Risk',
      traditional: 'Unsecured credit terms, delayed 30-90 days, high default risk',
      farmunity: '100% escrow commitment locked before harvest is dispatched',
      winner: true
    },
    {
      factor: 'Transport & Logistics',
      traditional: 'Farmer pays individual tractor freight for small sub-ton loads',
      farmunity: 'Shared consolidated pickup route organized by local coordinator',
      winner: true
    }
  ];

  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-stone-100 via-amber-50/40 to-white border border-stone-200/80 p-8 sm:p-12 md:p-16 text-center shadow-sm">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-green-100/90 border border-green-300 text-green-800 mb-6 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-green-700" />
          <span>Transparent Agricultural Fulfilment Platform</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-stone-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight">
          Small farms. <span className="text-green-700 underline decoration-green-300 decoration-wavy decoration-2">One stronger supply.</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
          FarmUnity groups nearby smallholder harvests to satisfy large wholesale demand with certified on-farm quality, protected escrow settlements, and reliable field logistics.
        </p>

        {/* Hero Role Selectors */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/register"
            className="px-6 py-3.5 bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-2 text-sm sm:text-base"
          >
            <Sprout className="w-5 h-5" />
            <span>I am a Farmer — Sell Produce</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/register"
            className="px-6 py-3.5 bg-white hover:bg-stone-50 text-stone-800 font-bold rounded-xl border border-stone-300 shadow-sm hover:border-stone-400 transition flex items-center gap-2 text-sm sm:text-base"
          >
            <Building2 className="w-5 h-5 text-stone-600" />
            <span>I am a Bulk Buyer — Source Harvest</span>
          </Link>

          <Link
            to="/coordinator"
            className="px-5 py-3.5 text-stone-600 hover:text-stone-900 font-semibold text-sm flex items-center gap-1.5 transition"
          >
            <span>Operations Desk</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Live Trust Metrics */}
        <div className="mt-14 pt-10 border-t border-stone-200 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          <div className="bg-white/80 p-4 rounded-xl border border-stone-200/70">
            <div className="text-2xl font-black text-green-700">0%</div>
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wide mt-0.5">Middleman Cut</div>
            <p className="text-[11px] text-stone-500 mt-1">Direct wholesale value delivered to smallholder farmers</p>
          </div>
          <div className="bg-white/80 p-4 rounded-xl border border-stone-200/70">
            <div className="text-2xl font-black text-amber-700">100%</div>
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wide mt-0.5">Physical Quality Check</div>
            <p className="text-[11px] text-stone-500 mt-1">Moisture meter & grade recorded before loading</p>
          </div>
          <div className="bg-white/80 p-4 rounded-xl border border-stone-200/70">
            <div className="text-2xl font-black text-blue-700">Escrow</div>
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wide mt-0.5">Locked Commitment</div>
            <p className="text-[11px] text-stone-500 mt-1">Buyers deposit funds before produce leaves village</p>
          </div>
          <div className="bg-white/80 p-4 rounded-xl border border-stone-200/70">
            <div className="text-2xl font-black text-stone-800">Tamper-Proof</div>
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wide mt-0.5">Audit Integrity</div>
            <p className="text-[11px] text-stone-500 mt-1">Immutable SHA-256 ledger for every weight & transaction</p>
          </div>
        </div>
      </section>

      {/* 4-Step How It Works */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-green-700">Transparent Lifecycle</div>
          <h2 className="text-3xl font-black text-stone-900">How FarmUnity Delivers Fair Trade</h2>
          <p className="text-sm text-stone-600">
            From the farmer's field to the institutional receiving dock — clear, verified, and protected every step of the way.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.num}
                className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs hover:shadow-md transition relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-stone-300">{step.num}</span>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${step.color}`}>
                      {step.badge}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-800 mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-stone-900 mb-2">{step.title}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comparison: Traditional vs FarmUnity */}
      <section className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-xs space-y-6">
        <div className="max-w-3xl">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-700">Fair Economics</div>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
            Why Smallholders & Bulk Buyers Choose FarmUnity
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            Traditional mandi supply chains hurt both ends: farmers get squeezed by commission layers, while bulk buyers suffer from irregular grades and unreliable deliveries.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-xs font-bold uppercase text-stone-500">
                <th className="py-3 px-4 w-1/4">Feature</th>
                <th className="py-3 px-4 w-3/8 text-stone-400">Traditional Intermediaries</th>
                <th className="py-3 px-4 w-3/8 text-green-700 bg-green-50/50 rounded-t-lg">FarmUnity Cooperative Model</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {comparisons.map((row, idx) => (
                <tr key={idx} className="hover:bg-stone-50/50 transition">
                  <td className="py-4 px-4 font-bold text-stone-900 text-xs sm:text-sm">{row.factor}</td>
                  <td className="py-4 px-4 text-stone-500 text-xs leading-relaxed">{row.traditional}</td>
                  <td className="py-4 px-4 text-stone-900 font-medium text-xs leading-relaxed bg-green-50/30">
                    <div className="flex items-start gap-2 text-green-900">
                      <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                      <span>{row.farmunity}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Failure Recovery & Real-World Resilience Section */}
      <section className="rounded-3xl bg-stone-900 text-stone-100 p-8 sm:p-12 relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
            <span>Built for Real-World Farming</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            When harvest reality changes, FarmUnity adapts immediately.
          </h2>
          <p className="text-stone-300 text-sm leading-relaxed">
            Real agriculture faces unexpected weather, vehicle breakdowns, and quantity variances. Unlike rigid procurement systems, FarmUnity handles exceptions deterministically.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 relative z-10">
          <div className="bg-stone-800/80 p-5 rounded-2xl border border-stone-700">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-white">Farmer Shortage or Drop</h4>
            <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
              If a farmer reports a lower yield or cancels, our pooling engine instantly searches for nearby verified replacement listings to maintain the buyer contract.
            </p>
          </div>

          <div className="bg-stone-800/80 p-5 rounded-2xl border border-stone-700">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
              <Truck className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-white">Transit or Vehicle Breakdown</h4>
            <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
              Coordinators trigger immediate route re-dispatch or staging at certified local collection hubs without breaking agreement terms.
            </p>
          </div>

          <div className="bg-stone-800/80 p-5 rounded-2xl border border-stone-700">
            <div className="w-8 h-8 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center mb-3">
              <BadgeCheck className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-white">Verified Quantity Settlement</h4>
            <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
              Payouts are strictly proportional to physical verified weight confirmed at destination. Never paid on unverified estimates.
            </p>
          </div>
        </div>
      </section>

      {/* Role Interactive Switcher / Action Callout */}
      <section className="bg-stone-100 rounded-3xl p-8 sm:p-12 border border-stone-200 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-black text-stone-900">Ready to transform your agricultural trade?</h2>
        <p className="text-stone-600 text-sm max-w-xl mx-auto">
          Join thousands of farmers receiving fair floor prices and institutional buyers securing traceable staple grains.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            to="/register"
            className="px-8 py-3.5 bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl shadow-md transition text-sm flex items-center gap-2"
          >
            <span>Create Free Account</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="px-8 py-3.5 bg-white hover:bg-stone-50 text-stone-800 font-bold rounded-xl border border-stone-300 shadow-xs transition text-sm"
          >
            <span>Sign In</span>
          </Link>
        </div>
      </section>
    </div>
  );
};
