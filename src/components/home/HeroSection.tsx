import { Link } from 'react-router-dom';
import { ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative gradient-bg-hero min-h-[90vh] flex items-center">
      {/* Decorative grid overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      <div className="section-container py-24 lg:py-32 relative z-10 w-full">
        <div className="max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8">
            <Zap className="w-4 h-4" />
            Your Career Command Center
          </div>

          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] mb-6 tracking-tight">
            All Your Career Links.{' '}
            <span className="gradient-text">One Dashboard.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl leading-relaxed">
            Stop juggling bookmarks. Organize job portals, company career pages, and LinkedIn profiles
            all in one powerful, searchable workspace.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link to="/companies">
              <Button className="btn-gradient h-13 px-8 text-base rounded-xl">
                Explore Companies
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/portals">
              <Button variant="outline" className="h-13 px-8 text-base rounded-xl border-border hover:bg-secondary hover:border-primary/30 transition-all duration-300">
                Browse Portals
              </Button>
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex gap-12 mt-16 pt-8 border-t border-border/50">
            {[
              { value: '100%', label: 'Private & Local' },
              { value: 'Unlimited', label: 'Companies' },
              { value: 'Free', label: 'Forever' },
            ].map((stat) => (
              <div key={stat.label} className="group">
                <p className="text-3xl font-bold gradient-text transition-transform duration-300 group-hover:scale-105">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
