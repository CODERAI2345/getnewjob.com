import { useState, useMemo } from 'react';
import { Search, Bookmark, ArrowRight, Rocket, MapPin, Users, ExternalLink, Star } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useVisitStatus } from '@/hooks/useVisitStatus';
import { useIndianStartups } from '@/hooks/useIndianStartups';
import { StatusBadge } from '@/components/StatusBadge';

type Sector = 'all' | string;

const SECTOR_LABELS: Record<string, string> = {
  food: 'Food & Beverage', health: 'Health & Wellness', beauty: 'Beauty & Personal Care',
  fashion: 'Fashion & Apparel', home: 'Home & Furnishing', fintech: 'Fintech',
  edtech: 'Edtech', saas: 'SaaS', others: 'Others',
};

const SECTOR_EMOJI: Record<string, string> = {
  food: '🍜', health: '💊', beauty: '💄', fashion: '👗',
  home: '🏠', fintech: '💳', edtech: '📚', saas: '⚡', others: '✦',
};

const SECTOR_GRADIENT: Record<string, string> = {
  food: 'from-orange-500 to-amber-400',
  health: 'from-green-500 to-emerald-400',
  beauty: 'from-pink-500 to-rose-400',
  fashion: 'from-purple-500 to-violet-400',
  home: 'from-amber-500 to-yellow-400',
  fintech: 'from-blue-500 to-cyan-400',
  edtech: 'from-indigo-500 to-blue-400',
  saas: 'from-teal-500 to-cyan-400',
  others: 'from-gray-500 to-slate-400',
};

export default function IndianStartups() {
  const { startups, loading } = useIndianStartups();
  const [activeSector, setActiveSector] = useState<Sector>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarks, setBookmarks] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('startup_bookmarks') || '[]')); } catch { return new Set(); }
  });
  const { getStatus, setStatus, markVisited } = useVisitStatus();

  const sectors = useMemo(() => {
    const found = [...new Set(startups.map(s => s.sector))];
    return ['all', ...found];
  }, [startups]);

  const filtered = useMemo(() => {
    return startups.filter(s => {
      const matchesSector = activeSector === 'all' || s.sector === activeSector;
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q ||
        s.name.toLowerCase().includes(q) ||
        (SECTOR_LABELS[s.sector] || s.sector).toLowerCase().includes(q) ||
        s.tagline?.toLowerCase().includes(q);
      return matchesSector && matchesSearch;
    });
  }, [startups, activeSector, searchQuery]);

  const stats = useMemo(() => ({
    applied: startups.filter(s => getStatus(s.id, 'indian_startups') === 'applied').length,
    visited: startups.filter(s => getStatus(s.id, 'indian_startups') === 'visited').length,
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

  const handleVisit = (startup: { id: string; website?: string; careerUrl?: string }) => {
    markVisited(startup.id, 'indian_startups');
    const url = startup.careerUrl || startup.website;
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <PageLayout>
      <div className="section-container py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center shadow-lg">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">Indian Startups</h1>
              <p className="text-muted-foreground text-sm mt-0.5">Fast42 2025 — India's fastest growing D2C brands</p>
            </div>
          </div>

          {/* Progress pills */}
          <div className="flex gap-2 flex-wrap">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/40 border border-green-200 dark:border-green-800">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm font-semibold text-green-700 dark:text-green-300">{stats.applied} Applied</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">{stats.visited} Visited</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border">
              <span className="w-2 h-2 rounded-full bg-gray-400" />
              <span className="text-sm font-semibold text-muted-foreground">{stats.notVisited} Not Visited</span>
            </div>
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
                {s === 'all' ? '🚀' : SECTOR_EMOJI[s] || '✦'} {s === 'all' ? 'All' : SECTOR_LABELS[s] || s}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search startups, sectors, or products..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 rounded-xl"
          />
        </div>

        <p className="text-sm text-muted-foreground mb-5">Showing {filtered.length} of {startups.length} startups</p>

        {/* Cards */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-32 bg-muted/40 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map(startup => {
              const status = getStatus(startup.id, 'indian_startups');
              const isBookmarked = bookmarks.has(startup.id);
              const gradient = SECTOR_GRADIENT[startup.sector] || SECTOR_GRADIENT.others;
              const sectorLabel = SECTOR_LABELS[startup.sector] || startup.sector;

              return (
                <div
                  key={startup.id}
                  className="group flex bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                >
                  {/* Left colored panel */}
                  <div
                    className={cn(
                      'w-36 sm:w-44 flex-shrink-0 flex flex-col items-center justify-center gap-2 relative overflow-hidden',
                      !startup.brandColor && `bg-gradient-to-br ${gradient}`
                    )}
                    style={startup.brandColor ? { backgroundColor: startup.brandColor } : undefined}
                  >
                    {startup.logoUrl ? (
                      <img src={startup.logoUrl} alt={startup.name} className="w-16 h-16 object-contain rounded-xl" />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-3xl font-bold text-white">{startup.name.charAt(0)}</span>
                      </div>
                    )}
                    <span className="text-[10px] font-semibold text-white/80 text-center px-2 leading-tight">
                      {sectorLabel}
                    </span>
                    <div className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full bg-white/10" />
                    <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-white/10" />
                  </div>

                  {/* Right content */}
                  <div className="flex-1 flex flex-col justify-between p-4 min-w-0">
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-display text-lg font-bold text-foreground leading-tight">
                            {startup.name}
                          </h3>
                          {startup.isFeatured && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                              <Star className="w-3 h-3 fill-current" /> Featured
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                          {startup.tagline || startup.description || 'Indian D2C startup'}
                        </p>
                      </div>
                      <button
                        onClick={e => toggleBookmark(startup.id, e)}
                        className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0',
                          isBookmarked ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        )}
                      >
                        <Bookmark className={cn('w-4 h-4', isBookmarked && 'fill-current')} />
                      </button>
                    </div>

                    {/* Meta chips */}
                    <div className="flex flex-wrap gap-1.5 my-2">
                      {startup.hqCity && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" /> {startup.hqCity}
                        </span>
                      )}
                      {startup.companySize && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Users className="w-3 h-3" /> {startup.companySize}
                        </span>
                      )}
                      {startup.foundedYear && (
                        <span className="text-xs text-muted-foreground">Est. {startup.foundedYear}</span>
                      )}
                      {startup.technologies && startup.technologies.slice(0, 3).map(t => (
                        <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{t}</span>
                      ))}
                    </div>

                    {/* Bottom row */}
                    <div className="flex items-center justify-between gap-3 pt-2 border-t border-border/50">
                      <StatusBadge
                        companyId={startup.id}
                        source="indian_startups"
                        status={status}
                        onStatusChange={s => setStatus(startup.id, s, 'indian_startups')}
                      />
                      <div className="flex items-center gap-2">
                        {startup.website && (
                          <a
                            href={startup.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => { e.stopPropagation(); markVisited(startup.id, 'indian_startups'); }}
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" /> Website
                          </a>
                        )}
                        <button
                          onClick={() => handleVisit(startup)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                          style={{
                            background: startup.brandColor
                              ? startup.brandColor
                              : 'linear-gradient(135deg, #f97316, #ec4899)',
                          }}
                        >
                          Visit <ArrowRight className="w-3.5 h-3.5" />
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
            <p className="text-muted-foreground">Try a different search or sector.</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
