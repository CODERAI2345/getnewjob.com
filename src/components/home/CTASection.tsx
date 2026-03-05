import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="section-container text-center relative z-10">
        <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
          Ready to Organize Your Job Search?
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-10 text-lg">
          Start adding companies and portals. Your data stays on your device, forever.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/companies">
            <Button className="btn-gradient h-13 px-10 text-base rounded-xl">
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to="/portals">
            <Button variant="outline" className="h-13 px-10 text-base rounded-xl border-border hover:bg-secondary hover:border-primary/30 transition-all duration-300">
              View Portals
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
