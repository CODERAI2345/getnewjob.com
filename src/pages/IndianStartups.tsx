import { useState, useMemo } from 'react';
import { Search, Bookmark, ArrowRight, Rocket, ExternalLink } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useVisitStatus } from '@/hooks/useVisitStatus';
import { StatusBadge } from '@/components/StatusBadge';

type Sector = 'all' | 'food' | 'health' | 'beauty' | 'fashion' | 'home' | 'others';

interface Startup {
  id: string;
  name: string;
  tagline: string;
  sector: Sector;
  sectorLabel: string;
  website: string;
}

const STARTUPS: Startup[] = [
  // Food & Beverage
  { id: 'master-chow', name: 'Master Chow', tagline: 'Authentic Asian Chinese sauces & ready meals', sector: 'food', sectorLabel: 'Food & Beverage', website: 'https://masterchow.in' },
  { id: 'eggoz-nutrition', name: 'Eggoz Nutrition', tagline: 'Premium farm-fresh eggs & nutrition', sector: 'food', sectorLabel: 'Food & Beverage', website: 'https://eggoz.in' },
  { id: 'wellbe', name: 'WellBe', tagline: 'Functional nutrition, part of NIMIDA Group', sector: 'food', sectorLabel: 'Food & Beverage', website: 'https://wellbe.in' },
  { id: 'anveshan', name: 'anveshan', tagline: 'Pure & natural farm-to-fork food products', sector: 'food', sectorLabel: 'Food & Beverage', website: 'https://anveshan.farm' },
  { id: 'blue-tea', name: 'Blue Tea', tagline: 'Exotic & herbal tea blends from India', sector: 'food', sectorLabel: 'Food & Beverage', website: 'https://blue-tea.in' },
  { id: 'somethings-brewing', name: "Something's Brewing", tagline: 'Specialty coffee roasters & subscriptions', sector: 'food', sectorLabel: 'Food & Beverage', website: 'https://somethingsbrewing.in' },
  { id: 'doodhvale-farms', name: 'Doodhvale Farms', tagline: 'Fresh A2 milk & dairy delivered daily', sector: 'food', sectorLabel: 'Food & Beverage', website: 'https://doodhvalefarms.com' },
  { id: 'desi-farms', name: 'Desi Farms', tagline: 'Pure desi cow milk & dairy products', sector: 'food', sectorLabel: 'Food & Beverage', website: 'https://desifarms.in' },
  { id: 'zed-the-baker', name: 'Zed The Baker', tagline: 'Artisan bakery, cafe & restaurant', sector: 'food', sectorLabel: 'Food & Beverage', website: 'https://zedthebaker.com' },

  // Health & Wellness
  { id: 'potful', name: 'PotFul', tagline: 'Freshly prepared healthy meals at home', sector: 'health', sectorLabel: 'Health & Wellness', website: 'https://potful.in' },
  { id: 'zinga-vita', name: 'Zinga Vita', tagline: 'Science-backed vitamins & supplements', sector: 'health', sectorLabel: 'Health & Wellness', website: 'https://zingavita.com' },
  { id: 'whats-up-wellness', name: "What's Up Wellness", tagline: 'Functional wellness & nutraceuticals', sector: 'health', sectorLabel: 'Health & Wellness', website: 'https://whatsupwellness.in' },
  { id: 'muse', name: 'Muse', tagline: 'Mental wellness & mindfulness platform', sector: 'health', sectorLabel: 'Health & Wellness', website: 'https://muse.in' },
  { id: 'nat-habit', name: 'Nat Habit', tagline: 'Fresh Ayurveda skincare & haircare', sector: 'health', sectorLabel: 'Health & Wellness', website: 'https://nathabit.in' },

  // Beauty & Personal Care
  { id: 'flicka-cosmetics', name: 'FLiCKA Cosmetics', tagline: 'Bold & expressive cosmetics for India', sector: 'beauty', sectorLabel: 'Beauty & Personal Care', website: 'https://flicka.in' },
  { id: 'house-of-em5', name: 'House of EM5', tagline: 'Premium inspired perfumes & fragrances', sector: 'beauty', sectorLabel: 'Beauty & Personal Care', website: 'https://houseofem5.com' },
  { id: 'setu', name: 'SETU', tagline: 'Personalised supplements & nutrition', sector: 'beauty', sectorLabel: 'Beauty & Personal Care', website: 'https://setu.in' },
  { id: 'adilqadri', name: 'ADILQADRI', tagline: 'Heritage fragrances & attar from India', sector: 'beauty', sectorLabel: 'Beauty & Personal Care', website: 'https://adilqadri.com' },
  { id: 'ras-luxury-skincare', name: 'RAS Luxury Skincare', tagline: 'Luxury plant-based skincare & oils', sector: 'beauty', sectorLabel: 'Beauty & Personal Care', website: 'https://ras.luxury' },
  { id: 'amethyst-store', name: 'The Amethyst Store', tagline: 'Crystals, wellness tools & spiritual care', sector: 'beauty', sectorLabel: 'Beauty & Personal Care', website: 'https://theamethyststore.in' },

  // Fashion & Apparel
  { id: 'pant-project', name: 'The[Pant]Pro.ject', tagline: 'Custom-fit trousers & bottomwear', sector: 'fashion', sectorLabel: 'Fashion & Apparel', website: 'https://thepantproject.com' },
  { id: 'knya', name: 'knya', tagline: 'Premium medical apparel for doctors', sector: 'fashion', sectorLabel: 'Fashion & Apparel', website: 'https://knya.in' },
  { id: 'berrylush', name: 'Berrylush', tagline: 'Trendy women\'s western & fusion wear', sector: 'fashion', sectorLabel: 'Fashion & Apparel', website: 'https://berrylush.com' },
  { id: 'freecultr', name: 'FreeCultr', tagline: 'Premium essentials & everyday basics', sector: 'fashion', sectorLabel: 'Fashion & Apparel', website: 'https://freecultr.com' },
  { id: 'nap-chief', name: 'Nap Chief', tagline: 'Comfortable loungewear & nightwear', sector: 'fashion', sectorLabel: 'Fashion & Apparel', website: 'https://napchief.com' },
  { id: 'miraggio', name: 'MIRAGGIO', tagline: 'Contemporary women\'s fashion & handbags', sector: 'fashion', sectorLabel: 'Fashion & Apparel', website: 'https://miraggio.in' },
  { id: 'bacca-bucci', name: 'BACCA BUCCI', tagline: 'Trendy footwear for men & women', sector: 'fashion', sectorLabel: 'Fashion & Apparel', website: 'https://baccabucci.com' },
  { id: 'bani-women', name: 'Bani Women', tagline: 'Handcrafted sustainable women\'s fashion', sector: 'fashion', sectorLabel: 'Fashion & Apparel', website: 'https://baniwomen.com' },
  { id: 'saadaa', name: 'SAADAA (साड़ा)', tagline: 'Minimalist sustainable everyday wear', sector: 'fashion', sectorLabel: 'Fashion & Apparel', website: 'https://saadaa.co' },
  { id: 'heelium', name: 'Heelium', tagline: 'Bamboo-based sustainable footwear', sector: 'fashion', sectorLabel: 'Fashion & Apparel', website: 'https://heelium.com' },

  // Home & Furnishing
  { id: 'om-bhakti', name: 'Om Bhakti', tagline: 'Spiritual home décor & pooja essentials', sector: 'home', sectorLabel: 'Home & Furnishing', website: 'https://ombhakti.com' },
  { id: 'homestrap', name: 'Homestrap', tagline: 'Smart home organisation & storage', sector: 'home', sectorLabel: 'Home & Furnishing', website: 'https://homestrap.com' },
  { id: 'ariment', name: 'ARIMENT', tagline: 'Artisan furniture & interior accents', sector: 'home', sectorLabel: 'Home & Furnishing', website: 'https://ariment.in' },
  { id: 'torque', name: 'TORQUE', tagline: 'Performance tools & home improvement', sector: 'home', sectorLabel: 'Home & Furnishing', website: 'https://torque.in' },
  { id: 'the-indus-valley', name: 'The Indus Valley', tagline: 'Toxin-free cookware & kitchen essentials', sector: 'home', sectorLabel: 'Home & Furnishing', website: 'https://theindusvalley.in' },
  { id: 'kyari', name: 'Kyari', tagline: 'Indoor plants & gardening for homes', sector: 'home', sectorLabel: 'Home & Furnishing', website: 'https://kyari.co' },
  { id: 'haus-kinder', name: 'Haus & Kinder', tagline: 'Modern nursery furniture & baby décor', sector: 'home', sectorLabel: 'Home & Furnishing', website: 'https://hauskinder.in' },
  { id: 'nirmalaya', name: 'Nirmalaya', tagline: 'Sacred fragrances & incense from flowers', sector: 'home', sectorLabel: 'Home & Furnishing', website: 'https://nirmalaya.com' },
  { id: 'flo', name: 'flo', tagline: 'Water management & smart plumbing tech', sector: 'home', sectorLabel: 'Home & Furnishing', website: 'https://flo.in' },
  { id: 'rabitat', name: 'Rabitat', tagline: 'Eco-friendly baby products & feeding', sector: 'home', sectorLabel: 'Home & Furnishing', website: 'https://rabitat.in' },
  { id: 'hammer', name: 'HAMMER', tagline: 'Rugged fitness trackers & smartwatches', sector: 'home', sectorLabel: 'Home & Furnishing', website: 'https://hammerlifestyle.com' },
  { id: 'drink-prime', name: 'Drink Prime', tagline: 'Smart water purifiers on subscription', sector: 'others', sectorLabel: 'Others', website: 'https://drinkprime.in' },
];

const SECTOR_TABS: { id: Sector; label: string; emoji: string }[] = [
  { id: 'all', label: 'All', emoji: '🚀' },
  { id: 'food', label: 'Food & Beverage', emoji: '🍜' },
  { id: 'health', label: 'Health & Wellness', emoji: '💊' },
  { id: 'beauty', label: 'Beauty & Care', emoji: '💄' },
  { id: 'fashion', label: 'Fashion & Apparel', emoji: '👗' },
  { id: 'home', label: 'Home & Furnishing', emoji: '🏠' },
  { id: 'others', label: 'Others', emoji: '✦' },
];

const SECTOR_COLORS: Record<Sector, string> = {
  all: '',
  food: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  health: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  beauty: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  fashion: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  home: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  others: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
};

export default function IndianStartups() {
  const [activeSector, setActiveSector] = useState<Sector>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarks, setBookmarks] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem('startup_bookmarks');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch { return new Set(); }
  });

  const { getStatus, setStatus, markVisited } = useVisitStatus();

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarks(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      try { localStorage.setItem('startup_bookmarks', JSON.stringify([...next])); } catch {}
      return next;
    });
  };

  const filtered = useMemo(() => {
    return STARTUPS.filter(s => {
      const matchesSector = activeSector === 'all' || s.sector === activeSector;
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || s.name.toLowerCase().includes(q) || s.sectorLabel.toLowerCase().includes(q) || s.tagline.toLowerCase().includes(q);
      return matchesSector && matchesSearch;
    });
  }, [activeSector, searchQuery]);

  // Stats
  const stats = useMemo(() => ({
    applied: STARTUPS.filter(s => getStatus(s.id, 'indian_startups') === 'applied').length,
    visited: STARTUPS.filter(s => getStatus(s.id, 'indian_startups') === 'visited').length,
    notVisited: STARTUPS.filter(s => getStatus(s.id, 'indian_startups') === 'not_visited').length,
  }), [getStatus]);

  const handleVisit = (startup: Startup) => {
    markVisited(startup.id, 'indian_startups');
    window.open(startup.website, '_blank', 'noopener,noreferrer');
  };

  return (
    <PageLayout>
      <div className="section-container py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">
                Indian D2C Startups
              </h1>
              <p className="text-muted-foreground text-sm">Fast42 2025 — India's fastest growing D2C brands</p>
            </div>
          </div>

          {/* Progress stats */}
          <div className="flex gap-3 mt-5 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              {stats.applied} Applied
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              {stats.visited} Visited
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-gray-400" />
              {stats.notVisited} Not Visited
            </div>
          </div>
        </div>

        {/* Sector tabs */}
        <div className="mb-6 overflow-x-auto">
          <div className="inline-flex items-center gap-1 p-1 rounded-xl border border-border/50 bg-muted/30">
            {SECTOR_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSector(tab.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
                  activeSector === tab.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                <span className="text-base">{tab.emoji}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search startups, sectors, or products..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 rounded-xl"
          />
        </div>

        {/* Count */}
        <p className="text-sm text-muted-foreground mb-5">
          Showing {filtered.length} of {STARTUPS.length} startups
        </p>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(startup => {
            const status = getStatus(startup.id, 'indian_startups');
            const isBookmarked = bookmarks.has(startup.id);
            return (
              <div
                key={startup.id}
                className="group relative flex flex-col justify-between bg-card border border-border rounded-2xl p-5 hover:border-primary/40 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-2 mb-4">
                  <span className={cn(
                    'text-xs font-semibold px-2.5 py-1 rounded-full',
                    SECTOR_COLORS[startup.sector]
                  )}>
                    {startup.sectorLabel}
                  </span>
                  <button
                    onClick={e => toggleBookmark(startup.id, e)}
                    className={cn(
                      'w-7 h-7 rounded-lg flex items-center justify-center transition-colors shrink-0',
                      isBookmarked
                        ? 'text-primary bg-primary/10'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                  >
                    <Bookmark className={cn('w-4 h-4', isBookmarked && 'fill-current')} />
                  </button>
                </div>

                {/* Company name */}
                <div className="mb-5">
                  <h3 className="font-display text-xl font-bold text-foreground leading-tight mb-1.5">
                    {startup.name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {startup.tagline}
                  </p>
                </div>

                {/* Bottom row */}
                <div className="flex items-center justify-between gap-2 pt-3 border-t border-border/50">
                  <StatusBadge
                    companyId={startup.id}
                    source="indian_startups"
                    status={status}
                    onStatusChange={s => setStatus(startup.id, s, 'indian_startups')}
                  />
                  <button
                    onClick={() => handleVisit(startup)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-foreground text-background text-xs font-semibold hover:opacity-80 transition-opacity shrink-0"
                  >
                    Visit
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg text-foreground mb-2">No startups found</h3>
            <p className="text-muted-foreground">Try adjusting your search or sector filter.</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
