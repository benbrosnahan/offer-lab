"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Nav from "@/components/shared/Nav";
import OfferForm from "@/components/quiz/OfferForm";
import VerdictHero from "@/components/results/VerdictHero";
import BudgetBreakdown from "@/components/results/BudgetBreakdown";
import ComparisonView from "@/components/results/ComparisonView";
import ShareButton from "@/components/results/ShareButton";
import { Offer, AppView } from "@/types";
import { analyzeOffer } from "@/lib/calculator";
import { decodeShareState, storage } from "@/lib/utils";

function OfferLabContent() {
  const searchParams = useSearchParams();
  const [view, setView] = useState<AppView>("quiz");
  const [offerA, setOfferA] = useState<Offer | null>(null);
  const [offerB, setOfferB] = useState<Offer | null>(null);
  const [showAddSecond, setShowAddSecond] = useState(false);

  // Load from URL or storage on mount
  useEffect(() => {
    const encoded = searchParams.get("q");
    if (encoded) {
      const state = decodeShareState(encoded);
      if (state) {
        setOfferA(state.a);
        if (state.b) {
          setOfferB(state.b);
          setView("comparison");
        } else {
          setView("results");
        }
        return;
      }
    }

    // Fall back to sessionStorage
    const saved = storage.get("offer-lab-state");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.a) {
          setOfferA(parsed.a);
          if (parsed.b) {
            setOfferB(parsed.b);
            setView("comparison");
          } else {
            setView("results");
          }
        }
      } catch {
        // ignore
      }
    }
  }, [searchParams]);

  // Persist on change
  useEffect(() => {
    if (offerA) {
      storage.set(
        "offer-lab-state",
        JSON.stringify({ a: offerA, b: offerB })
      );
    }
  }, [offerA, offerB]);

  const handleFirstSubmit = (offer: Offer) => {
    setOfferA(offer);
    setView("results");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSecondSubmit = (offer: Offer) => {
    setOfferB(offer);
    setView("comparison");
    setShowAddSecond(false);
  };

  const handleReset = () => {
    setOfferA(null);
    setOfferB(null);
    setView("quiz");
    setShowAddSecond(false);
    storage.remove("offer-lab-state");
  };

  const handleClearB = () => {
    setOfferB(null);
    setView("results");
    setShowAddSecond(false);
  };

  // Editable offer field updates (re-renders results live)
  const updateOfferA = (updates: Partial<Offer>) => {
    if (!offerA) return;
    setOfferA({ ...offerA, ...updates });
  };

  const updateOfferB = (updates: Partial<Offer>) => {
    if (!offerB) return;
    setOfferB({ ...offerB, ...updates });
  };

  // Analysis
  const analysisA = offerA ? analyzeOffer(offerA) : null;
  const analysisB = offerB ? analyzeOffer(offerB) : null;

  return (
    <>
      <Nav />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-20">
        <AnimatePresence mode="wait">
          {view === "quiz" && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                    What does your offer actually mean?
                  </h1>
                  <p className="mt-3 text-slate-500 leading-relaxed">
                    See what your salary really gets you after taxes, rent, and
                    cost of living. Compare two offers side by side.
                  </p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
                  <OfferForm onSubmit={handleFirstSubmit} />
                </div>
                <p className="text-xs text-slate-400 text-center mt-4">
                  No signup. No data stored. Calculations use 2025 tax brackets.
                </p>
              </div>
            </motion.div>
          )}

          {view === "results" && analysisA && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    {analysisA.offer.salary > 0 && (
                      <>${analysisA.offer.salary.toLocaleString()}</>
                    )}{" "}
                    in {analysisA.city.name}
                  </h1>
                  <p className="text-sm text-slate-500 mt-1">
                    Single filer, 2025 tax year.
                  </p>
                </div>
                <ShareButton a={analysisA.offer} />
              </div>

              <VerdictHero analysis={analysisA} />

              <div className="mt-6">
                <BudgetBreakdown
                  analysis={analysisA}
                  onUpdateRent={(v) => updateOfferA({ rentOverride: v })}
                  onResetRent={() =>
                    updateOfferA({ rentOverride: undefined })
                  }
                  onUpdateNecessities={(v) =>
                    updateOfferA({ necessitiesOverride: v })
                  }
                  onResetNecessities={() =>
                    updateOfferA({ necessitiesOverride: undefined })
                  }
                  onUpdateLoan={(v) => updateOfferA({ loanPayment: v })}
                  onUpdateOther={(v) => updateOfferA({ otherFixed: v })}
                />
              </div>

              {/* Add comparison CTA / form */}
              <div className="mt-8">
                {!showAddSecond ? (
                  <button
                    onClick={() => setShowAddSecond(true)}
                    className="w-full p-5 rounded-2xl border-2 border-dashed border-slate-300 hover:border-navy hover:bg-white transition-all group text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-navy/10 flex items-center justify-center transition-colors">
                        <svg
                          className="w-5 h-5 text-slate-500 group-hover:text-navy transition-colors"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900 group-hover:text-navy transition-colors">
                          Compare a second offer
                        </p>
                        <p className="text-sm text-slate-500 mt-0.5">
                          See which job actually leaves you with more money.
                        </p>
                      </div>
                    </div>
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-slate-900">
                          Second offer
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          We&apos;ll use the same monthly debts you entered.
                        </p>
                      </div>
                      <button
                        onClick={() => setShowAddSecond(false)}
                        className="text-slate-300 hover:text-slate-600 transition-colors"
                        aria-label="Cancel"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                    <OfferForm
                      initial={{
                        loanPayment: analysisA.offer.loanPayment,
                        otherFixed: analysisA.offer.otherFixed,
                      }}
                      onSubmit={handleSecondSubmit}
                      submitLabel="Compare offers"
                      compact
                    />
                  </motion.div>
                )}
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={handleReset}
                  className="text-sm text-slate-400 hover:text-navy transition-colors"
                >
                  ← Start over
                </button>
              </div>
            </motion.div>
          )}

          {view === "comparison" && analysisA && analysisB && (
            <motion.div
              key="comparison"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    Your offer comparison
                  </h1>
                  <p className="text-sm text-slate-500 mt-1">
                    {analysisA.city.name} vs. {analysisB.city.name}, 2025 tax
                    year.
                  </p>
                </div>
                <ShareButton a={analysisA.offer} b={analysisB.offer} />
              </div>

              <ComparisonView
                a={analysisA}
                b={analysisB}
                onUpdateA={updateOfferA}
                onUpdateB={updateOfferB}
                onClearB={handleClearB}
              />

              <div className="mt-8 text-center">
                <button
                  onClick={handleReset}
                  className="text-sm text-slate-400 hover:text-navy transition-colors"
                >
                  ← Start over
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Methodology footer (always visible) */}
        <footer className="mt-16 pt-8 border-t border-slate-200">
          <details className="group">
            <summary className="cursor-pointer text-xs text-slate-400 hover:text-slate-600 font-medium select-none">
              How we calculate this →
            </summary>
            <div className="mt-3 text-xs text-slate-500 leading-relaxed space-y-2 max-w-2xl">
              <p>
                <strong className="text-slate-700">Take-home pay</strong> uses
                2025 federal tax brackets (single filer), the $15,750 standard
                deduction, 2025 FICA rates (6.2% Social Security up to $176,100,
                1.45% Medicare uncapped), and state effective income tax rates
                from the Tax Foundation. Local income taxes are included for
                NYC, Philadelphia, Detroit, Cleveland, Cincinnati, Columbus, and
                other applicable cities.
              </p>
              <p>
                <strong className="text-slate-700">Rent</strong> uses median
                1-bedroom rents from the Zumper National Rent Report (November
                2025) and Apartment List metro-level data (2025).
              </p>
              <p>
                <strong className="text-slate-700">Essentials</strong>{" "}
                (food, utilities, transit, phone, personal care, healthcare
                premiums) uses a $1,200/month national baseline scaled by city
                cost-of-living index. Sources: MIT Living Wage Calculator and
                BEA Regional Price Parities.
              </p>
              <p>
                These are estimates for educational purposes. Your actual
                take-home and expenses will vary based on benefits, deductions,
                lifestyle, and personal choices.
              </p>
            </div>
          </details>
        </footer>
      </main>
    </>
  );
}

export default function OfferLab() {
  return (
    <Suspense>
      <OfferLabContent />
    </Suspense>
  );
}
