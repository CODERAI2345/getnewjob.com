import { Building2, Link as LinkIcon, Sparkles, BarChart3, Shield, Globe } from 'lucide-react';
import { PremiumCard } from '@/components/cards/PremiumCards';

const features = [
  {
    icon: Building2,
    title: 'Company Directory',
    description: 'Organize and track all your target companies with detailed profiles, notes, and application status.',
  },
  {
    icon: LinkIcon,
    title: 'Job Portals Hub',
    description: 'Keep all your job search portals in one place for quick, organized access.',
  },
  {
    icon: Sparkles,
    title: 'Smart Organization',
    description: 'Filter and search companies by industry, location, technologies, or application status.',
  },
  {
    icon: BarChart3,
    title: 'Track Progress',
    description: 'Monitor your application pipeline from initial interest through to offer stage.',
  },
  {
    icon: Shield,
    title: 'Private & Secure',
    description: 'Your data stays on your device. No tracking, no sharing, complete privacy.',
  },
  {
    icon: Globe,
    title: 'Import & Export',
    description: 'Import companies from CSV files or add them manually. Export anytime.',
  },
];

export function FeaturesGrid() {
  return (
    <section className="py-24">
      <div className="section-container">
        <div className="text-center mb-16">
          <p className="text-primary text-sm font-semibold uppercase tracking-[0.2em] mb-4">Features</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Why CareerHub?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Everything you need to organize your job search, in one place.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-animate">
          {features.map((feature, index) => (
            <PremiumCard key={index} className="group">
              <div className="icon-box icon-box-primary w-12 h-12 mb-5 transition-all duration-300 group-hover:scale-110">
                <feature.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </PremiumCard>
          ))}
        </div>
      </div>
    </section>
  );
}
