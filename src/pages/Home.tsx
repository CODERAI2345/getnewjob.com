import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Link as LinkIcon, Sparkles, BarChart3, Shield, Globe } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { HeroSection } from '@/components/home/HeroSection';
import { TrustedByBar } from '@/components/home/TrustedByBar';
import { FeaturesGrid } from '@/components/home/FeaturesGrid';
import { HowItWorks } from '@/components/home/HowItWorks';
import { CTASection } from '@/components/home/CTASection';
import { Footer } from '@/components/home/Footer';

export default function Home() {
  return (
    <PageLayout>
      <HeroSection />
      <TrustedByBar />
      <FeaturesGrid />
      <HowItWorks />
      <CTASection />
      <Footer />
    </PageLayout>
  );
}
