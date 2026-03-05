export function TrustedByBar() {
  const brands = ['LinkedIn', 'Indeed', 'Glassdoor', 'AngelList', 'Wellfound', 'Handshake'];

  return (
    <section className="py-12 bg-section-tint border-y border-border/30">
      <div className="section-container">
        <div className="trusted-bar flex flex-col sm:flex-row items-center gap-6 sm:gap-12">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">
            Integrates with
          </span>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 w-full">
            {brands.map((brand) => (
              <span
                key={brand}
                className="text-muted-foreground/40 font-display font-bold text-lg tracking-wide hover:text-muted-foreground/70 transition-colors duration-300 cursor-default"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
