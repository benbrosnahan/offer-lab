"use client";

import { useEffect, useRef, useState } from "react";
import OfferForm from "@/components/OfferForm";
import VerdictCard from "@/components/VerdictCard";
import Breakdown from "@/components/Breakdown";
import Comparison from "@/components/Comparison";
import ShareButton from "@/components/ShareButton";
import { AppView, Offer } from "@/types";
import { analyzeOffer } from "@/lib/calculator";
import { getCityById, RENT_AS_OF } from "@/data/cities";
import { TAX_YEAR } from "@/data/taxes";
import { decodeShareState, formatCurrency, parseShareState, ShareState, storage } from "@/lib/utils";

const STORAGE_KEY = "offer-lab-state";
const cityExists = (id: string) => Boolean(getCityById(id));

/** The offer to open with: a share link first, then this tab's saved state. */
function readInitialState(): { state: ShareState | null; badLink: boolean } {
  const q = new URLSearchParams(window.location.search).get("q");
  if (q) {
    const state = decodeShareState(q, cityExists);
    if (state) return { state, badLink: false };
  }
  let state: ShareState | null = null;
  const saved = storage.get(STORAGE_KEY);
  if (saved) {
    try {
      state = parseShareState(JSON.parse(saved), cityExists);
    } catch {
      state = null;
    }
  }
  return { state, badLink: Boolean(q) };
}

export default function OfferLab() {
  const [view, setView] = useState<AppView>("quiz");
  const [offerA, setOfferA] = useState<Offer | null>(null);
  const [offerB, setOfferB] = useState<Offer | null>(null);
  const [addingSecond, setAddingSecond] = useState(false);
  const [notice, setNotice] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const focusNext = useRef(false);

  // Restore once, after hydration, so the server-rendered form matches.
  useEffect(() => {
    const { state, badLink } = readInitialState();
    /* eslint-disable react-hooks/set-state-in-effect -- reading the URL and storage can only happen in the browser */
    if (state) {
      setOfferA(state.a);
      setOfferB(state.b ?? null);
      setView(state.b ? "comparison" : "results");
    }
    if (badLink) {
      setNotice("That link could not be opened. Enter the offer below.");
    }
    /* eslint-enable react-hooks/set-state-in-effect */
    document.documentElement.removeAttribute("data-restoring");
  }, []);

  useEffect(() => {
    if (offerA) storage.set(STORAGE_KEY, JSON.stringify(offerB ? { a: offerA, b: offerB } : { a: offerA }));
  }, [offerA, offerB]);

  // After a view change the person asked for, move focus to the new heading.
  useEffect(() => {
    if (focusNext.current) {
      focusNext.current = false;
      headingRef.current?.focus();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [view]);

  const go = (next: AppView) => {
    focusNext.current = true;
    setView(next);
  };

  const submitFirst = (offer: Offer) => {
    setOfferA(offer);
    setNotice("");
    go("results");
  };

  const submitSecond = (offer: Offer) => {
    setOfferB(offer);
    setAddingSecond(false);
    go("comparison");
  };

  const startOver = () => {
    setOfferA(null);
    setOfferB(null);
    setAddingSecond(false);
    storage.remove(STORAGE_KEY);
    if (window.location.search) window.history.replaceState(null, "", "/");
    go("quiz");
  };

  const removeB = () => {
    setOfferB(null);
    go("results");
  };

  const update = (setter: typeof setOfferA) => (updates: Partial<Offer>) =>
    setter((o) => (o ? { ...o, ...updates } : o));

  const a = offerA ? analyzeOffer(offerA) : null;
  const b = offerB ? analyzeOffer(offerB) : null;

  if (view === "results" && a) {
    return (
      <div className="mx-auto w-full max-w-2xl" data-view="results">
        <div className="flex items-start justify-between gap-3 pt-8 sm:pt-12">
          <div className="min-w-0">
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="font-display text-3xl font-bold leading-tight tracking-tight text-foreground focus:outline-none sm:text-[2.75rem]"
            >
              {formatCurrency(a.offer.salary)} in {a.city.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Single filer, {TAX_YEAR} tax rules, rent from {RENT_AS_OF}
            </p>
          </div>
          <ShareButton a={a.offer} />
        </div>

        <div className="mt-6 space-y-6">
          <VerdictCard analysis={a} />
          <Breakdown analysis={a} slot="a" onUpdate={update(setOfferA)} />

          {addingSecond ? (
            <section
              aria-labelledby="second-offer"
              className="rise rounded-3xl bg-card p-5 ring-1 ring-border card-soft sm:p-7"
            >
              <h2 id="second-offer" className="font-display text-xl font-bold text-foreground">
                Second offer
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Your loan, bills and roommates carry over from the first offer.
              </p>
              <div className="mt-5">
                <OfferForm
                  initial={{ loanPayment: a.offer.loanPayment, otherFixed: a.offer.otherFixed, roommates: a.offer.roommates }}
                  onSubmit={submitSecond}
                  submitLabel="Compare offers"
                  compact
                  onCancel={() => setAddingSecond(false)}
                />
              </div>
            </section>
          ) : (
            <div className="flex flex-col gap-3 rounded-3xl border border-dashed border-border-strong p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <p className="text-base text-soft">Weighing another offer? See which leaves more each month.</p>
              <button
                type="button"
                onClick={() => setAddingSecond(true)}
                className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full border border-border-strong bg-card px-5 text-base font-semibold text-foreground transition-colors hover:border-primary hover:bg-secondary"
              >
                Compare a second offer
              </button>
            </div>
          )}

          <StartOver onClick={startOver} />
        </div>
      </div>
    );
  }

  if (view === "comparison" && a && b) {
    const title =
      a.city.id === b.city.id
        ? `Two offers in ${a.city.name}`
        : `${a.city.name} or ${b.city.name}?`;
    return (
      <div className="mx-auto w-full max-w-5xl" data-view="comparison">
        <div className="mx-auto flex max-w-2xl items-start justify-between gap-3 pt-8 sm:pt-12 lg:max-w-none">
          <div className="min-w-0">
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="font-display text-3xl font-bold leading-tight tracking-tight text-foreground focus:outline-none sm:text-[2.75rem]"
            >
              {title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Single filer, {TAX_YEAR} tax rules, rent from {RENT_AS_OF}
            </p>
          </div>
          <ShareButton a={a.offer} b={b.offer} />
        </div>
        <div className="mx-auto mt-6 max-w-2xl lg:max-w-none">
          <Comparison a={a} b={b} onUpdateA={update(setOfferA)} onUpdateB={update(setOfferB)} onRemoveB={removeB} />
          <div className="mt-6">
            <StartOver onClick={startOver} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl" data-view="quiz">
      <div className="pt-8 sm:pt-14">
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="font-display text-[2.5rem] font-bold leading-[1.02] tracking-tight text-foreground focus:outline-none sm:text-6xl"
        >
          Is your offer enough to live on?
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-soft">
          Type the salary and the city. You get take-home pay after {TAX_YEAR} taxes, a typical rent,
          electricity and everyday costs there, and what is left each month.
        </p>
      </div>

      {notice && (
        <p role="alert" className="mt-6 rounded-2xl bg-mark px-4 py-3 text-base text-foreground">
          {notice}
        </p>
      )}

      <div className="mt-7 rounded-3xl bg-card p-5 ring-1 ring-border card-soft sm:p-7">
        <OfferForm onSubmit={submitFirst} />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        No sign-up. Nothing you type leaves this browser tab.
      </p>
    </div>
  );
}

function StartOver({ onClick }: { onClick: () => void }) {
  return (
    <div className="text-center">
      <button
        type="button"
        onClick={onClick}
        className="inline-flex min-h-12 items-center rounded-full px-5 text-base font-semibold text-foreground hover:bg-secondary"
      >
        Start over
      </button>
    </div>
  );
}
