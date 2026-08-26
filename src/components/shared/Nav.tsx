export default function Nav() {
  return (
    <header className="sticky top-0 z-50 bg-page/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <a
            href="https://cense.beehiiv.com"
            className="flex items-center gap-2 rounded-lg hover:opacity-75 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
            aria-label="Cense newsletter home"
          >
            <div className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="font-bold text-slate-900">Cense</span>
          </a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-600 font-medium">Offer Lab</span>
        </div>
        <p className="hidden sm:block text-xs text-slate-400">
          No data stored. All calculations run locally.
        </p>
      </div>
    </header>
  );
}
