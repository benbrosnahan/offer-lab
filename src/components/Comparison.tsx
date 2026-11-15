"use client";

import { Offer, OfferAnalysis } from "@/types";
import Breakdown from "@/components/Breakdown";
import PaycheckBar, { paycheckExtent, paycheckSegments } from "@/components/PaycheckBar";
import { cn, formatCurrency } from "@/lib/utils";

interface Props {
  a: OfferAnalysis;
  b: OfferAnalysis;
  onUpdateA: (updates: Partial<Offer>) => void;
  onUpdateB: (updates: Partial<Offer>) => void;
  onRemoveB: () => void;
}

/** Within this many dollars a month the two offers are called even. */
const EVEN = 25;
/** Differences smaller than this are left out of the one-line reason. */
const NOTABLE = 50;

const joinWords = (xs: string[]) =>
  xs.length <= 1 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`;

/** Why the winner comes out ahead, in one sentence. */
function why(w: OfferAnalysis, l: OfferAnalysis): string {
  const fav: string[] = [];
  const against: string[] = [];
  const add = (diff: number, better: string, worse: string) => {
    if (diff >= NOTABLE) fav.push(better.replace("$", formatCurrency(diff)));
    else if (diff <= -NOTABLE) against.push(worse.replace("$", formatCurrency(-diff)));
  };
  add(w.tax.takeHomeMonthly - l.tax.takeHomeMonthly, "take-home is $ higher", "$ less take-home");
  add(l.rent + l.utilities - (w.rent + w.utilities), "rent and electricity are $ lower", "$ more in rent and electricity");
  add(l.necessities - w.necessities, "everyday costs are $ lower", "$ more in everyday costs");
  add(
    l.loanPayment + l.otherFixed - (w.loanPayment + w.otherFixed),
    "bills are $ lower",
    "$ more in bills"
  );
  if (!fav.length) return "";
  const s = joinWords(fav);
  const lead = s.charAt(0).toUpperCase() + s.slice(1);
  return against.length ? `${lead}, which more than covers ${joinWords(against)}.` : `${lead}.`;
}

export default function Comparison({ a, b, onUpdateA, onUpdateB, onRemoveB }: Props) {
  const sameCity = a.city.id === b.city.id;
  const name = (x: OfferAnalysis) => (sameCity ? (x === a ? "Offer A" : "Offer B") : x.city.name);
  const delta = a.discretionary - b.discretionary;
  const even = Math.abs(delta) < EVEN;
  const winner = delta >= 0 ? a : b;
  const loser = winner === a ? b : a;
  const scale = Math.max(paycheckExtent(a), paycheckExtent(b));
  // One legend for both bars: every kind of segment that appears in either.
  const kinds = new Map<string, { label: string; className: string }>();
  for (const seg of [...paycheckSegments(a), ...paycheckSegments(b)]) {
    if (!kinds.has(seg.key)) kinds.set(seg.key, { label: seg.label, className: seg.className });
  }
  if (a.discretionary < 0 || b.discretionary < 0) {
    kinds.set("short", { label: "Short, past the end of the pay", className: "seg-short" });
  }
  const order = ["tax", "rent", "essentials", "bills", "left", "short"];
  const legend = order.filter((k) => kinds.has(k)).map((k) => ({ key: k, ...kinds.get(k)! }));

  return (
    <div className="space-y-6">
      <section
        aria-labelledby="answer"
        className="rise rounded-3xl bg-card p-5 ring-1 ring-border card-soft sm:p-7"
      >
        <p className="text-sm text-muted-foreground">After rent, electricity, everyday costs and bills</p>
        <h2
          id="answer"
          className="mt-1 font-display text-[2rem] font-bold leading-[1.1] tracking-tight text-foreground sm:text-[2.5rem]"
        >
          {even
            ? "The two offers come out about even"
            : winner.discretionary < 0
              ? `${name(winner)} comes out about ${formatCurrency(Math.abs(delta))} a month ahead`
              : `${name(winner)} leaves about ${formatCurrency(Math.abs(delta))} more each month`}
        </h2>
        {!even && (
          <p className="mt-3 max-w-prose text-base leading-relaxed text-soft">
            {[
              why(winner, loser),
              `That is about ${formatCurrency(Math.abs(delta) * 12)} a year${
                winner.tax.gross < loser.tax.gross ? ", even with the smaller salary" : ""
              }.`,
            ]
              .filter(Boolean)
              .join(" ")}
          </p>
        )}
        {a.discretionary < 0 && b.discretionary < 0 && (
          <p className="mt-2 max-w-prose text-base leading-relaxed text-soft">
            Both come up short at these rents. Try roommates or the rent you would really pay in each.
          </p>
        )}

        <div className="mt-7 space-y-7">
          <PaycheckBar
            analysis={a}
            scale={scale}
            title={`${sameCity ? "Offer A" : a.city.name}, ${formatCurrency(a.tax.gross)}`}
            compactLegend
          />
          <PaycheckBar
            analysis={b}
            scale={scale}
            title={`${sameCity ? "Offer B" : b.city.name}, ${formatCurrency(b.tax.gross)}`}
            compactLegend
          />
        </div>
        <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-soft">
          {legend.map((s) => (
            <li key={s.key} className="flex items-center gap-2">
              <span aria-hidden className={cn("inline-block h-3 w-3 rounded-[4px]", s.className)} />
              {s.label}
            </li>
          ))}
        </ul>
      </section>

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <Breakdown
          analysis={a}
          slot="a"
          heading={`Offer A: ${formatCurrency(a.tax.gross)} in ${a.city.name}`}
          onUpdate={onUpdateA}
        />
        <Breakdown
          analysis={b}
          slot="b"
          heading={`Offer B: ${formatCurrency(b.tax.gross)} in ${b.city.name}`}
          onUpdate={onUpdateB}
          onRemove={onRemoveB}
        />
      </div>
    </div>
  );
}
