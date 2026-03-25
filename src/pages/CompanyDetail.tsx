import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Star, Pin, Building2, Calendar, MapPin, Users, Briefcase,
  ExternalLink, Linkedin, ArrowRight, Globe, Cpu, BarChart3, Shield,
  Cloud, Database, Brain, Server,
} from 'lucide-react';
import { useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCompanyById, useCompanies } from '@/hooks/useCompanies';
import { useVisitStatus, STATUS_CONFIG, ALL_STATUSES } from '@/hooks/useVisitStatus';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

function getInsightsForCompany(company: { technologies?: string[]; industry?: string }) {
  const focusAreas = company.technologies?.length
    ? company.technologies.slice(0, 6)
    : ['Cloud', 'AI', 'Data Analytics', 'Cybersecurity', 'SAP', 'Enterprise Solutions'];

  const strengths = [
    { label: 'Cloud Engineering', value: 80 },
    { label: 'Data Analytics', value: 60 },
    { label: 'AI & Machine Learning', value: 40 },
  ];

  const regions = ['USA', 'India', 'Europe'];

  return { focusAreas, strengths, regions };
}

export default function CompanyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { company, loading } = useCompanyById(id);
  const { toggleFavorite, togglePinned } = useCompanies();
  const { getStatus, setStatus, markVisited } = useVisitStatus();

  // Auto-mark as visited when detail page loads
  useEffect(() => {
    if (id) {
      markVisited(id, 'companies');
    }
  }, [id, markVisited]);

  if (loading) {
    return (
      <PageLayout>
        <div className="section-container py-8 space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      </PageLayout>
    );
  }

  if (!company) {
    return (
      <PageLayout>
        <div className="section-container py-8">
          <div className="text-center py-16">
            <h2 className="font-semibold text-lg text-foreground mb-2">Company not found</h2>
            <p className="text-muted-foreground mb-6">The company you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/companies')} className="btn-gradient">Back to Companies</Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  const location = [company.hqCity, company.hqCountry].filter(Boolean).join(', ');
  const insights = getInsightsForCompany(company);
  const currentStatus = getStatus(company.id, 'companies');
  const statusCfg = STATUS_CONFIG[currentStatus];

  return (
    <PageLayout>
      <div className="section-container py-8 space-y-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Header */}
        <div className="rounded-2xl bg-gradient-to-r from-secondary to-accent/10 border border-border p-7 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            {/* Left */}
            <div className="flex items-start gap-5">
              <div className="icon-box icon-box-primary w-16 h-16 text-2xl font-bold shrink-0">
                {company.name.charAt(0)}
              </div>
              <div className="space-y-3">
                <h1 className="font-display text-[34px] leading-tight font-bold text-foreground">
                  {company.name}
                </h1>
                <div className="flex flex-wrap items-center gap-2">
                  {company.industry && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                      <Briefcase className="w-3 h-3" /> {company.industry}
                    </span>
                  )}
                  {company.companySize && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent">
                      <Users className="w-3 h-3" /> {company.companySize}
                    </span>
                  )}
                  {company.foundedYear && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground">
                      <Calendar className="w-3 h-3" /> Est. {company.foundedYear}
                    </span>
                  )}
                  {location && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground">
                      <MapPin className="w-3 h-3" /> {location}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right actions */}
            <div className="flex flex-col gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline" size="icon"
                  onClick={() => toggleFavorite(company.id)}
                  className={cn('rounded-xl', company.isFavorite && 'text-amber-500 border-amber-500/50 bg-amber-500/10')}
                >
                  <Star className={cn('w-4 h-4', company.isFavorite && 'fill-current')} />
                </Button>
                <Button
                  variant="outline" size="icon"
                  onClick={() => togglePinned(company.id)}
                  className={cn('rounded-xl', company.isPinned && 'text-primary border-primary/50 bg-primary/10')}
                >
                  <Pin className={cn('w-4 h-4', company.isPinned && 'fill-current')} />
                </Button>
                {company.careerUrl && (
                  <a href={company.careerUrl} target="_blank" rel="noopener noreferrer">
                    <Button className="btn-gradient rounded-xl gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Visit Career Site
                    </Button>
                  </a>
                )}
              </div>

              {/* Application status selector */}
              <div className="flex flex-col gap-1.5">
                <p className="text-xs font-medium text-muted-foreground">Application Status</p>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_STATUSES.map(s => {
                    const cfg = STATUS_CONFIG[s];
                    const isActive = currentStatus === s;
                    return (
                      <button
                        key={s}
                        onClick={() => setStatus(company.id, s, 'companies')}
                        className={cn(
                          'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                          isActive
                            ? cn(cfg.badge, 'ring-2 ring-offset-1 ring-primary/40')
                            : 'text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
                        )}
                      >
                        <span className={cn('w-1.5 h-1.5 rounded-full', isActive ? cfg.dot : 'bg-muted-foreground')} />
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-2xl bg-secondary/30 border border-border p-7">
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" /> About
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed" style={{ lineHeight: 1.6 }}>
                  {company.description || company.about || 'No description provided.'}
                </p>
              </div>

              <div className="rounded-2xl bg-card border border-border p-7 shadow-sm">
                <h3 className="text-xl font-semibold text-foreground mb-5 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" /> Quick Facts
                </h3>
                <div className="space-y-5">
                  <QuickFact icon={<Calendar className="w-4 h-4" />} label="Founded" value={company.foundedYear ? String(company.foundedYear) : '—'} />
                  <QuickFact icon={<MapPin className="w-4 h-4" />} label="Headquarters" value={location || '—'} />
                  <QuickFact icon={<Briefcase className="w-4 h-4" />} label="Industry" value={company.industry || '—'} />
                  <QuickFact icon={<Users className="w-4 h-4" />} label="Company Size" value={company.companySize || '—'} />
                </div>
              </div>

              {company.technologies && company.technologies.length > 0 && (
                <div className="md:col-span-2 rounded-2xl bg-card border border-border p-7 shadow-sm">
                  <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-primary" /> Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {company.technologies.map(tech => (
                      <span key={tech} className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/15 transition-colors">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Links */}
          <TabsContent value="links">
            <div className="grid sm:grid-cols-2 gap-5 max-w-2xl">
              {company.careerUrl && (
                <LinkDetailCard title="Career Site" url={company.careerUrl} description="Explore open positions" icon={<ExternalLink className="w-5 h-5" />} />
              )}
              {company.linkedinUrl && (
                <LinkDetailCard title="LinkedIn" url={company.linkedinUrl} description="Company profile & network" icon={<Linkedin className="w-5 h-5" />} />
              )}
              {company.website && (
                <LinkDetailCard title="Website" url={company.website} description="Official company website" icon={<Globe className="w-5 h-5" />} />
              )}
            </div>
          </TabsContent>

          {/* Insights */}
          <TabsContent value="insights">
            <div className="space-y-8">
              <div className="rounded-2xl bg-card border border-border p-7 shadow-sm">
                <h3 className="text-xl font-semibold text-foreground mb-5 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" /> Hiring Focus
                </h3>
                <div className="flex flex-wrap gap-2">
                  {insights.focusAreas.map(area => (
                    <span key={area} className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary/8 text-primary border border-primary/15 hover:bg-primary/15 hover:border-primary/30 transition-all cursor-default">
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-card border border-border p-7 shadow-sm">
                <h3 className="text-xl font-semibold text-foreground mb-5 flex items-center gap-2">
                  <Server className="w-5 h-5 text-primary" /> Tech Strength
                </h3>
                <div className="space-y-5">
                  {insights.strengths.map(s => (
                    <div key={s.label} className="space-y-1.5">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium text-foreground">{s.label}</span>
                        <span className="text-muted-foreground">{s.value}%</span>
                      </div>
                      <Progress value={s.value} className="h-2.5 rounded-full bg-muted" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-card border border-border p-7 shadow-sm">
                <h3 className="text-xl font-semibold text-foreground mb-5 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" /> Global Presence
                </h3>
                <div className="flex flex-wrap gap-2">
                  {insights.regions.map(region => (
                    <span key={region} className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-accent/10 text-accent border border-accent/15">
                      {region}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}

function QuickFact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-muted-foreground">{icon}</div>
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
        <p className="text-base font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}

function LinkDetailCard({ title, url, description, icon }: { title: string; url: string; description: string; icon: React.ReactNode }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className="group flex items-center gap-4 p-5 rounded-2xl border border-border bg-card hover:border-accent/50 hover:shadow-md transition-all duration-300">
      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">{title}</h4>
        <p className="text-sm text-muted-foreground truncate">{description}</p>
      </div>
      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
    </a>
  );
}
