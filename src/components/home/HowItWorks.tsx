const steps = [
  {
    number: '01',
    title: 'Add Your Sources',
    description: 'Import companies from CSV or add them manually with all the details you need.',
  },
  {
    number: '02',
    title: 'Organize & Track',
    description: 'Filter by industry, pin important ones, and track your application progress.',
  },
  {
    number: '03',
    title: 'Stay On Top',
    description: 'Access everything from one dashboard. Never lose track of an opportunity.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-section-tint border-y border-border/30">
      <div className="section-container">
        <div className="text-center mb-16">
          <p className="text-primary text-sm font-semibold uppercase tracking-[0.2em] mb-4">Process</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Get started in minutes with a simple three-step process.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group text-center md:text-left">
              <div className="text-7xl font-bold gradient-text opacity-20 mb-4 transition-all duration-500 group-hover:opacity-40">
                {step.number}
              </div>
              <h3 className="font-display font-semibold text-xl text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 right-0 w-1/3 border-t border-dashed border-border/50" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
