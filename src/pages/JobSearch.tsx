import { useState } from 'react';
import { Search, ExternalLink, Globe, MapPin, Briefcase, Sparkles } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface JobPortal {
  name: string;
  icon: string;
  buildUrl: (query: string, location: string) => string;
  color: string;
  region: 'global' | 'europe' | 'india' | 'remote';
}

const jobPortals: JobPortal[] = [
  // Global
  { name: 'LinkedIn Jobs', icon: '💼', buildUrl: (q, l) => `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(q)}&location=${encodeURIComponent(l)}`, color: '#0A66C2', region: 'global' },
  { name: 'Indeed', icon: '🔍', buildUrl: (q, l) => `https://www.indeed.com/jobs?q=${encodeURIComponent(q)}&l=${encodeURIComponent(l)}`, color: '#2164F3', region: 'global' },
  { name: 'Glassdoor', icon: '🏢', buildUrl: (q, l) => `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${encodeURIComponent(q)}&locT=C&locKeyword=${encodeURIComponent(l)}`, color: '#0CAA41', region: 'global' },
  { name: 'Google Jobs', icon: '🌐', buildUrl: (q, l) => `https://www.google.com/search?q=${encodeURIComponent(q + ' jobs ' + l)}&ibp=htl;jobs`, color: '#4285F4', region: 'global' },
  { name: 'AngelList', icon: '😇', buildUrl: (q, l) => `https://wellfound.com/jobs?query=${encodeURIComponent(q)}&location=${encodeURIComponent(l)}`, color: '#000000', region: 'global' },
  // Europe
  { name: 'EURES (EU)', icon: '🇪🇺', buildUrl: (q, l) => `https://eures.europa.eu/eures-services/eures-targeted-mobility-scheme/search-job_en?keyword=${encodeURIComponent(q)}`, color: '#003399', region: 'europe' },
  { name: 'StepStone', icon: '🪨', buildUrl: (q, l) => `https://www.stepstone.de/jobs/${encodeURIComponent(q)}/in-${encodeURIComponent(l)}`, color: '#164194', region: 'europe' },
  { name: 'XING', icon: '✖️', buildUrl: (q, l) => `https://www.xing.com/jobs/search?keywords=${encodeURIComponent(q)}&location=${encodeURIComponent(l)}`, color: '#006567', region: 'europe' },
  { name: 'Arbetsförmedlingen (SE)', icon: '🇸🇪', buildUrl: (q, l) => `https://arbetsformedlingen.se/platsbanken/annonser?q=${encodeURIComponent(q)}`, color: '#005293', region: 'europe' },
  { name: 'TE-palvelut (FI)', icon: '🇫🇮', buildUrl: (q, l) => `https://paikat.te-palvelut.fi/tpt/?searchPhrase=${encodeURIComponent(q)}&lang=en`, color: '#003580', region: 'europe' },
  { name: 'NAV (NO)', icon: '🇳🇴', buildUrl: (q, l) => `https://arbeidsplassen.nav.no/stillinger?q=${encodeURIComponent(q)}`, color: '#C30000', region: 'europe' },
  // India
  { name: 'Naukri', icon: '🇮🇳', buildUrl: (q, l) => `https://www.naukri.com/${encodeURIComponent(q.replace(/\s+/g, '-'))}-jobs-in-${encodeURIComponent(l.replace(/\s+/g, '-'))}`, color: '#4A90D9', region: 'india' },
  { name: 'Internshala', icon: '🎓', buildUrl: (q, l) => `https://internshala.com/internships/${encodeURIComponent(q.replace(/\s+/g, '-'))}-internship-in-${encodeURIComponent(l.replace(/\s+/g, '-'))}`, color: '#00A5EC', region: 'india' },
  { name: 'Foundit (Monster IN)', icon: '👹', buildUrl: (q, l) => `https://www.foundit.in/srp/results?query=${encodeURIComponent(q)}&locations=${encodeURIComponent(l)}`, color: '#6E45E2', region: 'india' },
  // Remote
  { name: 'Remote OK', icon: '🌍', buildUrl: (q) => `https://remoteok.com/remote-${encodeURIComponent(q.replace(/\s+/g, '-'))}-jobs`, color: '#FD4539', region: 'remote' },
  { name: 'We Work Remotely', icon: '💻', buildUrl: (q) => `https://weworkremotely.com/remote-jobs/search?term=${encodeURIComponent(q)}`, color: '#1b6c8a', region: 'remote' },
  { name: 'FlexJobs', icon: '🧘', buildUrl: (q) => `https://www.flexjobs.com/search?search=${encodeURIComponent(q)}`, color: '#01B0A8', region: 'remote' },
  { name: 'Himalayas', icon: '🏔️', buildUrl: (q) => `https://himalayas.app/jobs?q=${encodeURIComponent(q)}`, color: '#6366F1', region: 'remote' },
];

type RegionFilter = 'all' | 'global' | 'europe' | 'india' | 'remote';

const regionTabs: { id: RegionFilter; label: string; icon: React.ElementType }[] = [
  { id: 'all', label: 'All Portals', icon: Globe },
  { id: 'global', label: 'Global', icon: Briefcase },
  { id: 'europe', label: 'Europe', icon: MapPin },
  { id: 'india', label: 'India', icon: MapPin },
  { id: 'remote', label: 'Remote', icon: Sparkles },
];

export default function JobSearch() {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [activeRegion, setActiveRegion] = useState<RegionFilter>('all');
  const [hasSearched, setHasSearched] = useState(false);

  const filteredPortals = activeRegion === 'all'
    ? jobPortals
    : jobPortals.filter(p => p.region === activeRegion);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) setHasSearched(true);
  };

  const openPortal = (portal: JobPortal) => {
    const url = portal.buildUrl(query || 'software engineer', location || '');
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <PageLayout>
      <div className="section-container py-8">
        {/* Hero */}
        <div className="mb-10 animate-fade-in text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Globe className="w-4 h-4" />
            Global Job Search
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground mb-3">
            Search Jobs Worldwide
          </h1>
          <p className="text-muted-foreground text-lg">
            Enter your desired role and location, then search across 18+ job portals with one click.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-10">
          <div className="flex flex-col sm:flex-row gap-3 p-3 rounded-2xl bg-card border border-border/50 shadow-lg">
            <div className="relative flex-1">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Job title, keyword, or company..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 border-0 bg-muted/50 rounded-xl h-12 text-base"
              />
            </div>
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="City, country, or 'Remote'..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-9 border-0 bg-muted/50 rounded-xl h-12 text-base"
              />
            </div>
            <Button type="submit" size="lg" className="rounded-xl h-12 px-8 font-semibold">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </form>

        {/* Region Tabs */}
        <div className="mb-8 overflow-x-auto">
          <div className="inline-flex items-center gap-1 p-1 rounded-xl border border-border/50 bg-muted/30 mx-auto">
            {regionTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveRegion(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
                  activeRegion === tab.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Portal Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-animate">
          {filteredPortals.map((portal) => (
            <button
              key={portal.name}
              onClick={() => openPortal(portal)}
              className="group relative flex items-center gap-4 p-5 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 text-left"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${portal.color}15` }}
              >
                {portal.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground text-sm truncate">{portal.name}</h3>
                <p className="text-xs text-muted-foreground capitalize">{portal.region}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />

              {/* Hover accent bar */}
              <div
                className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: portal.color }}
              />
            </button>
          ))}
        </div>

        {/* Tip */}
        {hasSearched && (
          <div className="mt-10 text-center animate-fade-in">
            <p className="text-sm text-muted-foreground">
              💡 Click any portal above to open your search for <span className="font-medium text-foreground">"{query}"</span>
              {location && <> in <span className="font-medium text-foreground">"{location}"</span></>}
            </p>
          </div>
        )}

        <div className="mt-8 text-center text-sm text-muted-foreground">
          {filteredPortals.length} portals available
        </div>
      </div>
    </PageLayout>
  );
}
