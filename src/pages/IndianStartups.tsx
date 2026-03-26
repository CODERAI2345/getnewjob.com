import { useState, useMemo } from 'react';
import {
  Search, Bookmark, ArrowRight, Rocket, MapPin, Users,
  ExternalLink, Star, Briefcase, ChevronDown,
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
    try { return new Set(JSON.parse(localStorage.getItem('startup_bookmarks') || '[]')); } catch { return new Set(); }
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
        s.rolesHiring?.some(r => r.toLowerCase().includes(q));
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
              placeholder="Search startups, roles, sectors..."
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

        <p cl
