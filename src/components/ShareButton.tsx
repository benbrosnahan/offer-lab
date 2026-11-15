"use client";

import { useState } from "react";
import { Offer } from "@/types";
import { buildShareUrl } from "@/lib/utils";

interface Props {
  a: Offer;
  b?: Offer;
}

export default function ShareButton({ a, b }: Props) {
  const [status, setStatus] = useState("");

  const copy = async () => {
    const url = buildShareUrl(b ? { a, b } : { a });
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setStatus("Link copied");
    } catch {
      setStatus("Copy blocked. The link is in the address bar.");
      window.history.replaceState(null, "", url);
    }
    window.setTimeout(() => setStatus(""), 4000);
  };

  return (
    <div className="flex flex-col items-end">
      <button
        type="button"
        onClick={copy}
        className="inline-flex min-h-10 items-center gap-1.5 whitespace-nowrap rounded-full border border-border-strong bg-card px-4 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:bg-secondary"
      >
        <svg aria-hidden className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
        Copy link
      </button>
      <p role="status" className="mt-1 min-h-5 max-w-40 text-right text-sm text-muted-foreground">
        {status}
      </p>
    </div>
  );
}
