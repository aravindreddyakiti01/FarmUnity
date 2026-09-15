import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { Button } from '../components/ui/Button';
import {
  Sprout,
  Building2,
  CheckCircle2,
  Scale,
  ShieldCheck,
  Truck,
  RotateCcw,
  Layers,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';

export const LandingPage = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto pt-6 pb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-900 text-xs font-semibold mb-6">
          <Sprout className="w-4 h-4 text-green-700" />
          <span>Demand-Driven Agricultural Fulfillment Protocol</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-tight mb-6">
          Many small farms.<br />
          <span className="text-green-800">One stronger supply.</span>
        </h1>

        <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed mb-8">
          FarmUnity aggregates verified smallholder produce into dependable, bulk cooperative fulfillment units for universities, hospitals, and institutional buyers.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/register">
            <Button variant="primary" size="lg">
              {t('sell_produce')}
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="secondary" size="lg">
              {t('source_bulk')}
            </Button>
          </Link>
        </div>
      </section>

      {/* The Fundamental Contrast: Traditional vs FarmUnity */}
      <section className="bg-white rounded-2xl border border-stone-200 p-8 sm:p-10 shadow-xs">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl font-bold text-stone-900 tracking-tight">The Structural Problem in Agriculture</h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-2">
            Traditional fragmented supply forces small farmers to sell at distress rates while institutions struggle with unreliable middlemen.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Traditional Supply */}
          <div className="p-6 rounded-xl border border-red-200 bg-red-50/40">
            <div className="flex items-center gap-2 text-red-900 font-bold text-sm mb-4">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              Traditional Fragmented Procurement
            </div>
            <ul className="space-y-3 text-xs text-stone-700">
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">&times;</span>
                <span>Farmers sell distress quantities (400-800 kg) individually to local brokers at arbitrary discounts.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">&times;</span>
                <span>Institutional buyers handle dozens of disparate phone calls with uncertified moisture and adulteration risk.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">&times;</span>
                <span>Opaque deductions and 60-day payment delays threaten smallholder livelihood.</span>
              </li>
            </ul>
          </div>

          {/* FarmUnity Platform */}
          <div className="p-6 rounded-xl border border-green-300 bg-green-50/40">
            <div className="flex items-center gap-2 text-green-950 font-bold text-sm mb-4">
              <span className="w-2 h-2 rounded-full bg-green-700" />
              FarmUnity Cooperative Network
            </div>
            <ul className="space-y-3 text-xs text-stone-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-800 shrink-0" />
                <span><strong>Dynamic Pooling:</strong> Small farms within micro-radii combine into a single certified bulk delivery.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-800 shrink-0" />
                <span><strong>Certified Physical Verification:</strong> Deterministic moisture check enforces crop bounds before allocation.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-800 shrink-0" />
                <span><strong>Protected Escrow:</strong> 100% buyer commitment locked upfront; transparent formula settlement on weighbridge arrival.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Differentiator: Real Failure Recovery Engine */}
      <section className="bg-stone-900 text-white rounded-2xl p-8 sm:p-10 shadow-sm">
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-500/30">
            <RotateCcw className="w-3.5 h-3.5" />
            Core Innovation: Resilient Operations
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            Real transactions experience real failures. FarmUnity recovers.
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
            Agricultural fulfillment is inherently unpredictable. When a producer's harvest falls short or a vehicle breaks down, the platform does not collapse—it isolates the gap, discovers compatible inventory, and recalculates the fulfillment path.
          </p>
        </div>

        <div className="grid sm:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-stone-800 border border-stone-700">
            <div className="text-amber-400 font-bold mb-1">1. Shortfall Detected</div>
            <p className="text-stone-400">Producer unavailable or 200 kg deficit recorded at pickup weighbridge.</p>
          </div>
          <div className="p-4 rounded-xl bg-stone-800 border border-stone-700">
            <div className="text-blue-400 font-bold mb-1">2. Dynamic Search</div>
            <p className="text-stone-400">Algorithm identifies compatible verified lots within nearby pickup radius.</p>
          </div>
          <div className="p-4 rounded-xl bg-stone-800 border border-stone-700">
            <div className="text-green-400 font-bold mb-1">3. Route Re-optimized</div>
            <p className="text-stone-400">Substitute lot slotted in. Agreement re-locks at Version N+1 with updated SHA-256 hash.</p>
          </div>
          <div className="p-4 rounded-xl bg-stone-800 border border-stone-700">
            <div className="text-stone-200 font-bold mb-1">4. Contract Intact</div>
            <p className="text-stone-400">Institutional buyer receives complete verified bulk delivery without stockout.</p>
          </div>
        </div>
      </section>

      {/* 10-Step Workflow Lifecycle */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-stone-900 tracking-tight">The 10-Step Transaction Lifecycle</h2>
          <p className="text-xs text-stone-600 mt-1">From farmgate registration to final bank settlement</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { step: '01', title: 'List Produce', desc: 'Farmers record crop, harvest dates, and floor price.' },
            { step: '02', title: 'Quality Check', desc: 'Field coordinator measures certified moisture on-farm.' },
            { step: '03', title: 'Cooperative Pooling', desc: 'Greedy allocation groups compatible producers.' },
            { step: '04', title: 'Price Consensus', desc: 'Deterministic range intersection finds feasible contract price.' },
            { step: '05', title: 'Agreement Lock', desc: 'Tamper-evident SHA-256 hash seals versioned terms.' },
            { step: '06', title: 'Buyer Commitment', desc: 'Deposit held securely in commitment ledger.' },
            { step: '07', title: 'Coordinated Pickup', desc: 'Optimized multi-stop vehicle route collections.' },
            { step: '08', title: 'Milling & Processing', desc: 'Transparent transformation (paddy to rice) with yield tracking.' },
            { step: '09', title: 'Weighbridge Delivery', desc: 'Buyer confirms physical destination weight.' },
            { step: '10', title: 'Proportional Settlement', desc: 'Instant payouts calculated strictly on verified quantities.' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs hover:border-green-800 transition-colors">
              <span className="text-[10px] font-bold text-green-800 block mb-1">STEP {item.step}</span>
              <h3 className="text-sm font-bold text-stone-900 mb-1">{item.title}</h3>
              <p className="text-[11px] text-stone-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
