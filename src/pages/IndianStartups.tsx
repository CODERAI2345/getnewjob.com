import { useState, useMemo } from 'react';
import {
  Search, Bookmark, ArrowRight, Rocket, MapPin, Users,
  ExternalLink, Star, Briefcase, ChevronDown, Calendar,
  TrendingUp,
} from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useVisitStatus } from '@/hooks/useVisitStatus';
import { useIndianStartups } from '@/hooks/useIndianStartups';
import { StatusBadge } from '@/components/StatusBadge';

const SECTOR_LABELS: Record<string, string> = {
  food: 'Food & Beverage', health: 'Health & Wellness', beauty: 'Beauty & Personal Care',
  fashion: 'Fashion & Apparel', home: 'Home & Furnishing', fintech: 'Fintech',
  edtech: 'Edtech', saas: 'SaaS', others: 'Others',
};

const SECTOR_EMOJI: Record<string, string> = {
  food: '🍜', health: '💊', beauty: '💄', fashion: '👗',
  home: '🏠', fintech: '💳', edtech: '📚', saas: '⚡', others: '✦',
};

const SECTOR_BG: Record<string, string> = {
  food:    'linear-gradient(160deg,#f97316,#ef4444)',
  health:  'linear-gradient(160deg,#22c55e,#10b981)',
  beauty:  'linear-gradient(160deg,#ec4899,#f472b6)',
  fashion: 'linear-gradient(160deg,#8b5cf6,#a78bfa)',
  home:    'linear-gradient(160deg,#f59e0b,#fbbf24)',
  fintech: 'linear-gradient(160deg,#3b82f6,#06b6d4)',
  edtech:  'linear-gradient(160deg,#6366f1,#818cf8)',
  saas:    'linear-gradient(160deg,#14b8a6,#06b6d4)',
  others:  'linear-gradient(160deg,#6b7280,#9ca3af)',
};

export default function IndianStartups() {
  const { startups, loading } = useIndianStartups();
  const [activeSector, setActiveSector] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('startup_bookmarks') || '[]')); }
    catch { return new Set(); }
  });
  const { getStatus, setStatus, markVisited } = useVisitStatus();

  const sectors = useMemo(() => {
    const found = [...new Set(startups.map(s => s.sector))].filter(Boolean);
    return ['all', ...found];
  }, [startups]);

  const cities = useMemo(() => {
    const found = [...new Set(startups.map(s => s.hqCity).filter(Boolean))] as string[];
    return ['all', ...found.sort()];
  }, [startups]);

  const filtered = useMemo(() => {
    return startups.filter(s => {
      const matchesSector = activeSector === 'all' || s.sector === activeSector;
      const matchesCity = selectedCity === 'all' || s.hqCity === selectedCity;
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q ||
        s.name.toLowerCase().includes(q) ||
        s.tagline?.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q) ||
        (SECTOR_LABELS[s.sector] || s.sector).toLowerCase().includes(q) ||
        s.rolesHiring?.some(r => r.toLowerCase().includes(q)) ||
        s.technologies?.some(t => t.toLowerCase().includes(q)) ||
        s.funding?.toLowerCase().includes(q);
      return matchesSector && matchesCity && matchesSearch;
    });
  }, [startups, activeSector, selectedCity, searchQuery]);

  const stats = useMemo(() => ({
    applied:    startups.filter(s => getStatus(s.id, 'indian_startups') === 'applied').length,
    visited:    startups.filter(s => getStatus(s.id, 'indian_startups') === 'visited').length,
    notVisited: startups.filter(s => getStatus(s.id, 'indian_startups') === 'not_visited').length,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [startups, getStatus]);

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarks(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      try { localStorage.setItem('startup_bookmarks', JSON.stringify([...next])); } catch {}
      return next;
    });
  };

  const handleVisit = (s: { id: string; website?: string; careerUrl?: string }) => {
    markVisited(s.id, 'indian_startups');
    const url = s.careerUrl || s.website;
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <PageLayout>
      <div className="section-container py-8">

        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center shadow-lg shrink-0">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">Indian Startups</h1>
              <p className="text-muted-foreground text-sm mt-0.5">Fast42 2025 — India's fastest growing D2C brands</p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 dark:bg-green-900/40 border border-green-200 dark:border-green-800 text-sm font-semibold text-green-700 dark:text-green-300">
              <span className="w-2 h-2 rounded-full bg-green-500" />{stats.applied} Applied
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800 text-sm font-semibold text-blue-700 dark:text-blue-300">
              <span className="w-2 h-2 rounded-full bg-blue-500" />{stats.visited} Visited
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted border border-border text-sm font-semibold text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-gray-400" />{stats.notVisited} Not Visited
            </span>
          </div>
        </div>

        {/* Sector tabs */}
        <div className="mb-5 overflow-x-auto">
          <div className="inline-flex items-center gap-1 p-1 rounded-xl border border-border/50 bg-muted/30">
            {sectors.map(s => (
              <button
                key={s}
                onClick={() => setActiveSector(s)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
                  activeSector === s
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                <span>{s === 'all' ? '🚀' : SECTOR_EMOJI[s] || '✦'}</span>
                {s === 'all' ? 'All' : SECTOR_LABELS[s] || s}
              </button>
            ))}
          </div>
        </div>

        {/* Search + City filter */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name, role, tech, funding..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 rounded-xl"
            />
          </div>
          {cities.length > 2 && (
            <div className="relative">
              <button
                onClick={() => setCityDropdownOpen(p => !p)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all',
                  selectedCity !== 'all'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/40'
                )}
              >
                <MapPin className="w-4 h-4" />
                {selectedCity === 'all' ? 'All Cities' : selectedCity}
                <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', cityDropdownOpen && 'rotate-180')} />
              </button>
              {cityDropdownOpen && (
                <div className="absolute top-full mt-1 left-0 z-50 bg-card border border-border rounded-xl shadow-lg min-w-[160px] overflow-hidden">
                  {cities.map(city => (
                    <button
                      key={city}
                      onClick={() => { setSelectedCity(city); setCityDropdownOpen(false); }}
                      className={cn(
                        'w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted',
                        selectedCity === city ? 'text-primary bg-primary/5' : 'text-foreground'
                      )}
                    >
                      {city === 'all' ? '🌍 All Cities' : `📍 ${city}`}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <p className="text-sm text-muted-foreground mb-5">
          Showing <span className="font-semibold text-foreground">{filtered.length}</span> of {startups.length} startups
          {selectedCity !== 'all' && <span> in <span className="font-semibold text-foreground">{selectedCity}</span></span>}
        </p>

        {/* Hotel-style cards */}
        {loading ? (
          <div className="space-y-4">
            {[1,2,3,4,5].map(i => <div key={i} className="h-48 bg-muted/40 rounded-2xl animate-pulse" />)}
          </div>
        ) : filtered.length > 0 ? (
          <div className="space-y-4">
            {filtered.map(startup => {
              const status = getStatus(startup.id, 'indian_startups');
              const isBookmarked = bookmarks.has(startup.id);
              const bg = startup.brandColor ? startup.brandColor : SECTOR_BG[startup.sector] || SECTOR_BG.others;

              return (
                <div key={startup.id} className="group flex bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-xl transition-all duration-300">

                  {/* Left color panel */}
                  <div
                    className="relative w-36 sm:w-48 flex-shrink-0 flex flex-col items-center justify-center gap-2 overflow-hidden"
                    style={{ background: bg }}
                  >
                    {startup.logoUrl ? (
                      <img src={startup.logoUrl} alt={startup.name} className="w-20 h-20 object-contain rounded-xl" onError={e => { e.currentTarget.style.display = 'none'; }} />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-4xl font-black text-white">{startup.name.charAt(0)}</span>
                      </div>
                    )}
                    {startup.isFeatured && (
                      <span className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/90 text-amber-900 text-[10px] font-bold">
                        <Star className="w-2.5 h-2.5 fill-current" /> Featured
                      </span>
                    )}
                    {/* Funding badge on left panel */}
                    {startup.funding && (
                      <div className="absolute bottom-8 left-0 right-0 px-2 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm text-white text-[10px] font-semibold">
                          <TrendingUp className="w-2.5 h-2.5" />
                          {startup.funding}
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-sm py-1.5 px-2 text-center">
                      <span className="text-[10px] font-semibold text-white/90 leading-none">
                        {SECTOR_EMOJI[startup.sector] || '✦'} {SECTOR_LABELS[startup.sector] || startup.sector}
                      </span>
                    </div>
                    <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-white/10" />
                    <div className="absolute -top-6 -left-6 w-16 h-16 rounded-full bg-white/10" />
                  </div>

                  {/* Right content */}
                  <div className="flex-1 flex flex-col p-4 sm:p-5 min-w-0">

                    {/* Name + bookmark */}
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-display text-xl font-bold text-foreground leading-tight">{startup.name}</h3>
                      <button
                        onClick={e => toggleBookmark(startup.id, e)}
                        className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0 mt-0.5',
                          isBookmarked ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        )}
                      >
                        <Bookmark className={cn('w-4 h-4', isBookmarked && 'fill-current')} />
                      </button>
                    </div>

                    {/* Tagline */}
                    {(startup.tagline || startup.description) && (
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-3">
                        {startup.tagline || startup.description}
                      </p>
                    )}

                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-3 mb-3 text-xs text-muted-foreground">
                      {startup.hqCity && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />{startup.hqCity}
                        </span>
                      )}
                      {startup.companySize && (
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />{startup.companySize}
                        </span>
                      )}
                      {startup.foundedYear && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />Est. {startup.foundedYear}
                        </span>
                      )}
                      {startup.funding && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-medium border border-amber-200 dark:border-amber-800">
                          <TrendingUp className="w-3 h-3" />{startup.funding}
                        </span>
                      )}
                    </div>

                    {/* Roles hiring */}
                    {startup.rolesHiring && startup.rolesHiring.length > 0 && (
                      <div className="mb-3">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                          <span className="text-xs font-semibold text-green-700 dark:text-green-400">Actively Hiring</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {startup.rolesHiring.slice(0, 4).map((role, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800">
                              {role}
                            </span>
                          ))}
                          {startup.rolesHiring.length > 4 && (
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                              +{startup.rolesHiring.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Tech stack */}
                    {startup.technologies && startup.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {startup.technologies.slice(0, 5).map((t, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/50">{t}</span>
                        ))}
                        {startup.technologies.length > 5 && (
                          <span className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground">+{startup.technologies.length - 5}</span>
                        )}
                      </div>
                    )}

                    {/* Description if no tagline shown */}
                    {!startup.tagline && startup.description && startup.description.length > 80 && (
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3 italic">
                        {startup.description}
                      </p>
                    )}

                    {/* Bottom row: status + Visit */}
                    <div className="flex items-center justify-between gap-3 pt-3 border-t border-border/50 mt-auto">
                      <StatusBadge
                        companyId={startup.id}
                        source="indian_startups"
                        status={status}
                        onStatusChange={s => setStatus(startup.id, s, 'indian_startups')}
                      />
                      <div className="flex items-center gap-2 shrink-0">
                        {startup.website && (
                          <a
                            href={startup.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => { e.stopPropagation(); markVisited(startup.id, 'indian_startups'); }}
                            className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> Website
                          </a>
                        )}
                        <button
                          onClick={() => handleVisit(startup)}
                          className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold text-white shadow-md hover:opacity-90 active:scale-95 transition-all"
                          style={{
                            background: startup.brandColor
                              ? startup.brandColor
                              : bg.startsWith('linear') ? bg : 'linear-gradient(135deg,#f97316,#ec4899)',
                          }}
                        >
                          Visit <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg text-foreground mb-2">No startups found</h3>
            <p className="text-muted-foreground">Try a different search, sector, or city.</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
