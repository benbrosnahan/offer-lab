import { OfferAnalysis } from "@/types";
import PaycheckBar from "@/components/PaycheckBar";
import { cn } from "@/lib/utils";

export default function VerdictCard({ analysis }: { analysis: OfferAnalysis }) {
  const { verdict } = analysis;
  return (
    <section
      aria-labelledby="verdict"
      className="rise rounded-3xl bg-card p-5 ring-1 ring-border card-soft sm:p-7"
    >
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
        <span
          className={cn(
            "inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold text-foreground",
            verdict.tier === "tight" ? "bg-mark" : "bg-secondary"
          )}
        >
          {verdict.label}
        </span>
        After rent, electricity, everyday costs and bills
      </p>
      <h2
        id="verdict"
        className="mt-1 font-display text-[2rem] font-bold leading-[1.1] tracking-tight text-foreground sm:text-[2.5rem]"
      >
        {verdict.headline}
      </h2>
      <p className="mt-3 max-w-prose text-base leading-relaxed text-soft">{verdict.description}</p>
      <div className="mt-7">
        <PaycheckBar analysis={analysis} />
      </div>
    </section>
  );
}
