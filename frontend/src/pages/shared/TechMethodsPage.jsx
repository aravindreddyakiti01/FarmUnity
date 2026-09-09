import React from 'react';
import { 
  Cpu, 
  ShieldCheck, 
  Scale, 
  Layers, 
  Lock, 
  RefreshCw, 
  CheckCircle2, 
  BookOpen,
  Code2,
  Binary
} from 'lucide-react';

export const TechMethodsPage = () => {
  return (
    <div className="max-w-4xl mx-auto my-6 space-y-10">
      {/* Title */}
      <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-xs space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-800 border border-stone-200">
          <BookOpen className="w-3.5 h-3.5 text-stone-700" />
          <span>System Architecture & Technical Methodology</span>
        </div>
        <h1 className="text-3xl font-black text-stone-900 tracking-tight">
          How FarmUnity Works: Algorithms & Integrity
        </h1>
        <p className="text-sm text-stone-600 leading-relaxed">
          FarmUnity avoids buzzwords and overclaiming. Here is an honest, mathematically grounded overview of our algorithms, state machines, and cryptographic guarantees.
        </p>
      </div>

      {/* 1. Honest Tech Classification */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-green-700" />
          <span>1. Honest System Boundary: What is AI vs What is Deterministic</span>
        </h2>
        <p className="text-xs text-stone-600 leading-relaxed">
          Critical agricultural workflows (escrow funds, contract formation, verified weights) must never rely on black-box probabilistic models that can hallucinate.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="p-4 rounded-2xl bg-green-50/60 border border-green-200/80 space-y-1.5">
            <span className="font-bold text-green-900 block text-sm">Deterministic Algorithms</span>
            <p className="text-green-800 leading-relaxed">
              <strong>Haversine Proximity:</strong> Filters lots within geographic radius.<br/>
              <strong>Greedy Knapsack Pooling:</strong> Accumulates volume to satisfy exact buyer quota.<br/>
              <strong>Moisture Band Gate:</strong> Strict 12.0%–14.0% numeric tolerance.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-1.5">
            <span className="font-bold text-blue-900 block text-sm">Predictive & Recommendation</span>
            <p className="text-blue-800 leading-relaxed">
              <strong>Price Overlap Range:</strong> Recommends optimal clearance price between farmer floor and buyer ceiling.<br/>
              <strong>Trust Tier Transitions:</strong> Dynamic multi-factor reliability scoring based on on-time delivery rate.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-1.5">
            <span className="font-bold text-amber-900 block text-sm">Human-in-the-Loop Sign-off</span>
            <p className="text-amber-800 leading-relaxed">
              <strong>Physical Inspection:</strong> Certified local coordinator verifies tare/gross scale weight & meter probe on-site.<br/>
              <strong>Dispute Arbitration:</strong> Joint physical recalibration at receiving gate.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Pooling & Matching Mathematics */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-700" />
          <span>2. Demand-Driven Cooperative Pooling Algorithm</span>
        </h2>
        <div className="space-y-3 text-xs text-stone-600 leading-relaxed">
          <p>
            When an institutional buyer creates a bulk demand (e.g., 5,000 kg Paddy at ₹26–₹30/kg in Bengaluru Rural), the matching engine executes a deterministic 5-stage filter:
          </p>
          <div className="p-4 bg-stone-50 rounded-2xl font-mono text-[11px] text-stone-800 space-y-1 border border-stone-200">
            <div>1. Filter: crop == requirement.crop &amp;&amp; status == 'VERIFIED_COMPATIBLE'</div>
            <div>2. Filter: listing.minPricePerKg &lt;= requirement.priceMax</div>
            <div>3. Filter: Haversine(listing.lat, listing.lng, buyer.lat, buyer.lng) &lt;= 50 km</div>
            <div>4. Sort: farmerReliabilityScore DESC, distance ASC, minPricePerKg ASC</div>
            <div>5. Greedy Allocation: allocate min(listing.verifiedQty, remainingDemandKg) until fulfilled</div>
          </div>
        </div>
      </section>

      {/* 3. Cryptographic Integrity & Optimistic Locking */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
          <Lock className="w-5 h-5 text-purple-700" />
          <span>3. Agreement Versioning & SHA-256 Tamper-Proofing</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-600">
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <span className="font-bold text-stone-900 block">JPA @Version Optimistic Locking</span>
            <p className="leading-relaxed">
              Every Agreement entity contains a database version number. If two farmers or a buyer submit concurrent signatures or terms, Spring Boot detects the race condition, rolls back the stale transaction, and forces a clean refresh without data corruption.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <span className="font-bold text-stone-900 block">Canonical SHA-256 Hash Chain</span>
            <p className="leading-relaxed">
              Upon final confirmation, the agreement terms (buyer ID, batch ID, member weights, agreed price) are serialized canonically into a SHA-256 hash. Any subsequent database alteration immediately invalidates the cryptographic proof.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Proportional Settlement Mathematics */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
          <Scale className="w-5 h-5 text-amber-700" />
          <span>4. Proportional Settlement Distribution Formula</span>
        </h2>
        <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-2xl text-xs text-amber-900 space-y-2">
          <p className="font-semibold">
            Rule: Declared quantity is NEVER used in financial payout calculations. Only verified gate delivered weight is eligible for disbursement.
          </p>
          <div className="p-3 bg-white rounded-xl font-mono text-[11px] text-amber-950 border border-amber-200">
            <div>Share_i = verifiedDeliveredQty_i / totalDeliveredBatchQty</div>
            <div>Gross_i = verifiedDeliveredQty_i * agreedPricePerKg</div>
            <div>Deductions_i = (transportCost * Share_i) + (grossTotal * 0.02 * Share_i)</div>
            <div>NetPayout_i = Gross_i - Deductions_i</div>
          </div>
        </div>
      </section>
    </div>
  );
};
