export default function Nav() {
  return (
    <header className="w-full px-4 pt-5 sm:px-6 sm:pt-7">
      <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-x-3 gap-y-1">
      <p className="flex items-baseline gap-1.5 whitespace-nowrap font-display text-lg font-bold sm:text-xl">
        <a
          href="https://cense.beehiiv.com"
          className="inline-flex min-h-10 items-center rounded-md text-brand-orange hover:underline"
        >
          Cense
        </a>
        <span className="text-foreground">Offer Lab</span>
      </p>
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground">
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          className="h-3.5 w-3.5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="7" width="10" height="7" rx="1.5" />
          <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
        </svg>
        Runs in your browser
      </span>
      </div>
    </header>
  );
}
