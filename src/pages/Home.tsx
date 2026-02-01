import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Link as LinkIcon, Zap, Shield, Sparkles } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { PremiumCard } from '@/components/cards/PremiumCards';
import heroImage from '@/assets/hero-workplace.jpg';

const features = [
  {
    icon: Building2,
    title: 'Company Directory',
    description: 'Organize and track all your target companies with detailed profiles and notes.',
  },
  {
    icon: LinkIcon,
    title: 'Job Portals Hub',
    description: 'Keep all your job search portals in one place for quick access.',
  },
  {
    icon: Sparkles,
    title: 'Smart Organization',
    description: 'Filter and search companies by industry, location, or technologies.',
  },
];

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

export default function Home() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-bg-hero">
        <div className="section-container py-20 lg:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left content */}
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-6 animate-pulse-glow">
                <Zap className="w-4 h-4" />
                Your Career Command Center
              </div>
              
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                All Your Career Links.{' '}
                <span className="gradient-text">One Dashboard.</span>
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Stop juggling bookmarks. Organize job portals, company career pages, and LinkedIn profiles 
                all in one beautiful, searchable workspace.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/companies">
                  <Button className="btn-gradient h-12 px-6 text-base">
                    Explore Companies
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/portals">
                  <Button variant="outline" className="h-12 px-6 text-base border-glow-border hover:bg-secondary transition-all duration-300">
                    Browse Portals
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-12 pt-8 border-t border-border/50">
                <div className="group">
                  <p className="text-3xl font-bold gradient-text transition-transform duration-300 group-hover:scale-110">100%</p>
                  <p className="text-sm text-muted-foreground">Private & Local</p>
                </div>
                <div className="group">
                  <p className="text-3xl font-bold gradient-text transition-transform duration-300 group-hover:scale-110">Unlimited</p>
                  <p className="text-sm text-muted-foreground">Companies</p>
                </div>
                <div className="group">
                  <p className="text-3xl font-bold gradient-text transition-transform duration-300 group-hover:scale-110">Free</p>
                  <p className="text-sm text-muted-foreground">Forever</p>
                </div>
              </div>
            </div>

            {/* Right image */}
            <div className="relative animate-fade-in-up hidden lg:block">
              <div className="relative rounded-2xl overflow-hidden shadow-card-hover">
                <img
                  src={heroImage}
                  alt="Modern workplace"
                  className="w-full h-auto object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
              </div>
              
              {/* Floating cards */}
              <div className="absolute -left-8 top-1/4 glass rounded-xl p-4 shadow-lg animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">500+ Companies</p>
                    <p className="text-xs text-muted-foreground">Organized</p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 bottom-1/4 glass rounded-xl p-4 shadow-lg animate-float" style={{ animationDelay: '1.5s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">Your Data</p>
                    <p className="text-xs text-muted-foreground">Stays Local</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-section-tint">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why CareerHub?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to organize your job search in one place.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 stagger-animate">
            {features.map((feature, index) => (
              <PremiumCard key={index} className="text-center group">
                <div className="icon-box icon-box-primary w-14 h-14 mx-auto mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </PremiumCard>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes with a simple three-step process.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                <div className="text-6xl font-bold gradient-text opacity-25 mb-4 transition-all duration-300 group-hover:opacity-40 group-hover:scale-110">
                  {step.number}
                </div>
                <h3 className="font-semibold text-xl text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 right-0 w-1/2 border-t-2 border-dashed border-glow-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg">
        <div className="section-container text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Organize Your Job Search?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Start adding companies and portals. Your data stays on your device, forever.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/companies">
              <Button className="btn-gradient h-12 px-8 text-base">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/portals">
              <Button variant="outline" className="h-12 px-8 text-base border-glow-border hover:bg-secondary transition-all duration-300">
                View Portals
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="section-container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center transition-transform duration-300 group-hover:rotate-12">
                <span className="text-primary-foreground font-bold text-sm">CH</span>
              </div>
              <span className="font-display font-bold gradient-text">CareerHub</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 CareerHub. Your data, your control.
            </p>
          </div>
        </div>
      </footer>
    </PageLayout>
  );
}