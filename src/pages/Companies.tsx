import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ArrowUpDown, Pin, Building2, Rocket, MapPin, Globe, BookOpen, Star, BarChart3 } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Input } from '@/components/ui/input';
import { useCompanies } from '@/hooks/useCompanies';
import { useVisitStatus, STATUS_CONFIG, VisitStatus } from '@/hooks/useVisitStatus';
import { StatusBadge } from '@/components/StatusBadge';
import { Company, SortOption } from '@/types';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const industries = [
  'All', 'Technology', 'Finance', 'Healthcare', 'E-commerce', 'Education',
  'Manufacturing', 'Consulting', 'Media', 'Telecom', 'Automotive',
  'Energy', 'Real Estate', 'Other',
];

const companySizes = ['All', '1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5000+'];

const sectors = [
  'All', 'Fintech', 'Healthtech', 'Edtech', 'SaaS', 'D2C', 'E-commerce',
  'Logistics', 'AI/ML', 'Cybersecurity', 'Gaming', 'HR Tech', 'LegalTech',
  'Proptech', 'CleanTech', 'Deeptech', 'Media & Entertainment', 'Other',
];

type CategoryTab =
  | 'all' | 'startups' | 'indian' | 'unicorns'
  | 'midlevel' | 'mnc' | 'product' | 'funded'
  | 'abroad' | 'learning' | 'important' | 'progress';

const categoryTabs: { id: CategoryTab; label: string; icon: React.ElementType }[] = [
  { id: 'all',       label: 'All Companies',      icon: Building2 },
  { id: 'unicorns',  label: 'Indian Unicorns 🦄',  icon: Rocket },
  { id: 'indian',    label: 'Indian Companies',    icon: MapPin },
  { id: 'midlevel',  label: 'Mid-level',           icon: Building2 },
  { id: 'mnc',       label: 'MNCs',                icon: Globe },
  { id: 'product',   label: 'Product-based',       icon: Star },
  { id: 'funded',    label: 'Well Funded',         icon: BookOpen },
  { id: 'startups',  label: 'Startups (Global)',   icon: Rocket },
  { id: 'abroad',    label: 'Abroad Portals',      icon: Globe },
  { id: 'learning',  label: 'Learning Portals',    icon: BookOpen },
  { id: 'important', label: 'Important Info',      icon: Star },
  { id: 'progress',  label: 'My Progress',         icon: BarChart3 },
];

const INDIAN_CITIES = [
  'bangalore', 'mumbai', 'delhi', 'hyderabad', 'chennai', 'pune',
  'kolkata', 'ahmedabad', 'noida', 'gurugram', 'gurgaon',
];

const KNOWN_UNICORNS = [
  'byju', 'oyo', 'paytm', 'ola', 'swiggy', 'zomato', 'razorpay', 'cred', 'meesho',
  'nykaa', 'zepto', 'groww', 'physicswallah', 'physics wallah', 'delhivery', 'mamaearth',
  'vedantu', 'unacademy', 'cars24', 'udaan', 'lenskart', 'moglix', 'infra.market',
  'cleartax', 'browserstack', 'postman', 'freshworks', 'innovaccer', 'darwinbox',
  'zenoti', 'chargebee', 'hasura', 'leadsquared', 'spinny', 'slice', 'stashfin',
  'open', 'rapido', 'rebel foods', 'boat', 'blackbuck', 'shiprocket', 'mfine',
];

const KNOWN_MNCS = [
  'microsoft', 'google', 'amazon', 'apple', 'meta', 'ibm', 'oracle', 'sap',
  'accenture', 'deloitte', 'capgemini', 'infosys', 'wipro', 'tcs', 'hcl',
  'cognizant', 'tech mahindra', 'adobe', 'salesforce', 'servicenow', 'vmware',
  'cisco', 'intel', 'qualcomm', 'nvidia', 'samsung', 'lg', 'sony', 'philips',
  'siemens', 'bosch', 'honeywell', 'ge', 'jpmorgan', 'goldman sachs', 'morgan stanley',
  'deutsche bank', 'hsbc', 'ubs', 'pwc', 'kpmg', 'ernst', 'mckinsey', 'bcg', 'bain',
];

function isIndianCompany(c: Company): boolean {
  const country = c.hqCountry?.toLowerCase() || '';
  const city = c.hqCity?.toLowerCase() || '';
  return country.includes('india') || INDIAN_CITIES.some(ci => city.includes(ci));
}

function filterByCategory(companies: Company[], category: CategoryTab): Company[] {
  const nameLower = (c: Company) => c.name.toLowerCase();
  switch (category) {
    case 'unicorns':
      return companies.filter(c =>
        c.isUnicorn === true || c.companyType === 'unicorn' ||
        (isIndianCompany(c) && (
          KNOWN_UNICORNS.some(u => nameLower(c).includes(u)) ||
          c.fundingStage === 'series-d+' || c.fundingStage === 'ipo' ||
          c.stage?.toLowerCase().includes('unicorn')
        ))
      );
    case 'midlevel':
      return companies.filter(c =>
        c.companyType === 'service' ||
        ['201-500', '501-1000', '1001-5000'].includes(c.companySize || '') ||
        (isIndianCompany(c) && !KNOWN_MNCS.some(m => nameLower(c).includes(m)) && !KNOWN_UNICORNS.some(u => nameLower(c).includes(u)))
      );
    case 'mnc':
      return companies.filter(c =>
        c.companyType === 'mnc' ||
        KNOWN_MNCS.some(m => nameLower(c).includes(m)) ||
        (c.companySize === '5000+' && !isIndianCompany(c))
      );
    case 'product':
      return companies.filter(c =>
        c.companyType === 'product' ||
        c.revenueModel === 'b2b' || c.revenueModel === 'b2c' ||
        c.description?.toLowerCase().includes('product') ||
        c.industry?.toLowerCase().includes('saas') ||
        c.industry?.toLowerCase().includes('software') ||
        c.notableProducts != null
      );
    case 'funded':
      return companies.filter(c =>
        c.fundingAmount != null ||
        ['series-b', 'series-c', 'series-d+', 'ipo'].includes(c.fundingStage || '') ||
        c.stage?.toLowerCase().includes('series b') ||
        c.stage?.toLowerCase().includes('series c') ||
        c.stage?.toLowerCase().includes('ipo')
      );
    case 'startups':
      return companies.filter(c =>
        c.companyType === 'startup' ||
        c.stage?.toLowerCase().includes('series') ||
        c.stage?.toLowerCase().includes('seed') ||
        c.companySize === '1-10' || c.companySize === '11-50' || c.companySize === '51-200'
      );
    case 'indian':
      return companies.filter(isIndianCompany);
    case 'abroad':
      return companies.filter(c => c.hqCountry && !c.hqCountry.toLowerCase().includes('india'));
    case 'learning':
      return companies.filter(c =>
        c.industry?.toLowerCase().includes('education') ||
        c.industry?.toLowerCase().includes('edtech') ||
        c.description?.toLowerCase().includes('learning') ||
        c.description?.toLowerCase().includes('training')
      );
    case 'important':
      return companies.filter(c => c.isFavorite || c.isPinned);
    case 'progress':
      return companies; // all companies, filtered by status in the memo
    default:
      return companies;
  }
}

export default function Companies() {
  const navigate = useNavigate();
  const { companies, togglePinned } = useCompanies();
  const { statuses, getStatus, setStatus, markVisited } = useVisitStatus();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');
  const [selectedSector, setSelectedSector] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [activeCategory, setActiveCategory] = useState<CategoryTab>('all');
  const [progressFilter, setProgressFilter] = useState<VisitStatus | 'all'>('all');

  // Progress stats (reactive to statuses)
  const progressStats = useMemo(() => {
    return {
      applied:     companies.filter(c => getStatus(c.id) === 'applied').length,
      visited:     companies.filter(c => getStatus(c.id) === 'visited').length,
      notApplied:  companies.filter(c => getStatus(c.id) === 'not_applied').length,
      notVisited:  companies.filter(c => getStatus(c.id) === 'not_visited').length,
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companies, statuses]);

  const filteredAndSortedCompanies = useMemo(() => {
    let result = filterByCategory(companies, activeCategory);

    // Status sub-filter for My Progress tab
    if (activeCategory === 'progress' && progressFilter !== 'all') {
      result = result.filter(c => getStatus(c.id) === progressFilter);
    }

    result = result.filter((company) => {
      const matchesSearch =
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.industry?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.sector?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.technologies?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesIndustry = selectedIndustry === 'All' || company.industry === selectedIndustry;
      const matchesSize = selectedSize === 'All' || company.companySize === selectedSize;
      const matchesSector = selectedSector === 'All' || company.sector === selectedSector;
      return matchesSearch && matchesIndustry && matchesSize && matchesSector;
    });

    result.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      switch (sortBy) {
        case 'a-z': return a.name.localeCompare(b.name);
        case 'z-a': return b.name.localeCompare(a.name);
        case 'newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'size': {
          const sizeOrder = ['5000+', '1001-5000', '501-1000', '201-500', '51-200', '11-50', '1-10'];
          return sizeOrder.indexOf(a.companySize || '') - sizeOrder.indexOf(b.companySize || '');
        }
        case 'funding': {
          const fundOrder = ['ipo', 'acquired', 'series-d+', 'series-c', 'series-b', 'series-a', 'seed', 'bootstrapped'];
          return fundOrder.indexOf(a.fundingStage || '') - fundOrder.indexOf(b.fundingStage || '');
        }
        default: return 0;
      }
    });

    return result;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companies, searchQuery, selectedIndustry, selectedSize, selectedSector, sortBy, activeCategory, progressFilter, statuses]);

  const handleCardClick = (company: Company) => {
    markVisited(company.id, 'companies');
    navigate(`/company/${company.id}`);
  };

  return (
    <PageLayout>
      <div className="section-container py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Companies Directory
          </h1>
          <p className="text-muted-foreground">
            Browse and discover companies in your saved directory.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mb-6 overflow-x-auto">
          <div className="inline-flex items-center gap-1 p-1 rounded-xl border border-border/50 bg-muted/30">
            {categoryTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
                  activeCategory === tab.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.id === 'progress' && progressStats.applied > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full bg-green-500 text-white text-xs font-bold leading-none">
                    {progressStats.applied}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* My Progress Panel */}
        {activeCategory === 'progress' && (
          <div className="mb-6 space-y-4 animate-fade-in">
            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { status: 'applied' as VisitStatus, count: progressStats.applied, label: 'Applied', color: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800' },
                { status: 'visited' as VisitStatus, count: progressStats.visited, label: 'Visited', color: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
                { status: 'not_applied' as VisitStatus, count: progressStats.notApplied, label: 'Not Applied', color: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800' },
                { status: 'not_visited' as VisitStatus, count: progressStats.notVisited, label: 'Not Visited', color: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700' },
              ].map(({ status, count, label, color }) => (
                <button
                  key={status}
                  onClick={() => setProgressFilter(progressFilter === status ? 'all' : status)}
                  className={cn(
                    'flex flex-col items-center justify-center p-4 rounded-xl border font-medium transition-all hover:scale-105',
                    color,
                    progressFilter === status && 'ring-2 ring-offset-2 ring-primary'
                  )}
                >
                  <span className="text-2xl font-bold">{count}</span>
                  <span className="text-xs mt-1">{label}</span>
                </button>
              ))}
            </div>
            {/* Sub-filter pills */}
            <div className="flex flex-wrap gap-2">
              {(['all', 'applied', 'visited', 'not_applied', 'not_visited'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setProgressFilter(f)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-sm font-medium transition-all border',
                    progressFilter === f
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
                  )}
                >
                  {f === 'all' ? 'Show All' : STATUS_CONFIG[f].label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Filter bar */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search companies, industries, or technologies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-xl"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger className="w-[160px] rounded-xl">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map(ind => <SelectItem key={ind} value={ind}>{ind}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger className="w-[160px] rounded-xl">
                <SelectValue placeholder="Sector" />
              </SelectTrigger>
              <SelectContent>
                {sectors.map(s => <SelectItem key={s} value={s}>{s === 'All' ? 'All Sectors' : s}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger className="w-[140px] rounded-xl">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                {companySizes.map(size => (
                  <SelectItem key={size} value={size}>{size === 'All' ? 'All Sizes' : `${size} employees`}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-[140px] rounded-xl">
                <ArrowUpDown className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="a-z">A-Z</SelectItem>
                <SelectItem value="z-a">Z-A</SelectItem>
                <SelectItem value="size">By Size</SelectItem>
                <SelectItem value="funding">By Funding</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Companies grid */}
        {filteredAndSortedCompanies.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-animate">
            {filteredAndSortedCompanies.map((company) => {
              const visitStatus = getStatus(company.id);
              return (
                <div
                  key={company.id}
                  onClick={() => handleCardClick(company)}
                  className="group relative cursor-pointer rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-2 bg-card"
                  style={{ minHeight: '420px' }}
                >
                  {/* Full card image */}
                  <div className="absolute inset-0">
                    {company.logoUrl ? (
                      <img
                        src={company.logoUrl}
                        alt={company.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const fallback = e.currentTarget.parentElement?.querySelector('.logo-fallback') as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={cn(
                      'logo-fallback absolute inset-0 bg-gradient-to-br from-primary/40 via-accent/30 to-primary/20 items-center justify-center',
                      company.logoUrl ? 'hidden' : 'flex'
                    )}>
                      <span className="text-8xl font-bold text-white/30 font-display">{company.name.charAt(0)}</span>
                    </div>
                  </div>

                  {/* Gradient overlay */}
                  <div className="absolute inset-0" style={{
                    background: company.gradientColor1 && company.gradientColor2
                      ? `linear-gradient(${company.gradientAngle || 180}deg, ${company.gradientColor1}ee, ${company.gradientColor2}cc, transparent)`
                      : company.brandColor
                        ? `linear-gradient(to top, ${company.brandColor}ee, ${company.brandColor}66, transparent)`
                        : 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.4), transparent)',
                  }} />

                  {/* Status badge — top left */}
                  <div className="absolute top-4 left-4 z-10">
                    <StatusBadge
                      companyId={company.id}
                      source="companies"
                      status={visitStatus}
                      onStatusChange={s => setStatus(company.id, s, 'companies')}
                      variant="card"
                    />
                  </div>

                  {/* Pinned badge — top right */}
                  {company.isPinned && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                        <Pin className="w-4 h-4 text-white fill-current" />
                      </div>
                    </div>
                  )}

                  {/* Content at the bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-3">
                    {company.brandTitleHtml ? (
                      <h3
                        className="font-display font-bold text-xl text-white drop-shadow-lg"
                        dangerouslySetInnerHTML={{ __html: company.brandTitleHtml }}
                      />
                    ) : (
                      <h3 className="font-display font-bold text-xl text-white drop-shadow-lg">
                        {company.name}
                      </h3>
                    )}

                    <p className="text-sm text-white/70 line-clamp-2 leading-relaxed">
                      {company.description || company.about || (
                        [company.hqCity, company.hqCountry].filter(Boolean).length > 0
                          ? `Located in ${[company.hqCity, company.hqCountry].filter(Boolean).join(', ')}.`
                          : `Explore career opportunities at ${company.name}.`
                      )}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {(company.isUnicorn || company.companyType === 'unicorn') && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/30 text-purple-200 backdrop-blur-sm border border-purple-400/30">
                          🦄 Unicorn
                        </span>
                      )}
                      {company.companyType === 'mnc' && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/30 text-blue-200 backdrop-blur-sm border border-blue-400/30">
                          🌐 MNC
                        </span>
                      )}
                      {company.companyType === 'product' && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/30 text-green-200 backdrop-blur-sm border border-green-400/30">
                          📦 Product
                        </span>
                      )}
                      {company.fundingStage && company.fundingStage !== 'bootstrapped' && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-200 backdrop-blur-sm border border-yellow-400/20">
                          💰 {company.fundingStage.toUpperCase()}
                        </span>
                      )}
                      {company.sector && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/80 backdrop-blur-sm border border-white/10">
                          {company.sector}
                        </span>
                      )}
                      {company.industry && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/15 text-white/90 backdrop-blur-sm">
                          {company.industry}
                        </span>
                      )}
                      {company.companySize && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/15 text-white/90 backdrop-blur-sm">
                          👥 {company.companySize}
                        </span>
                      )}
                      {company.technologies && company.technologies.length > 0 && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/15 text-white/90 backdrop-blur-sm">
                          {company.technologies[0]}{company.technologies.length > 1 ? ` +${company.technologies.length - 1}` : ''}
                        </span>
                      )}
                    </div>

                    <button
                      className="mt-1 w-full py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg hover:scale-105"
                      style={{
                        background: company.buttonGradientColor1 && company.buttonGradientColor2
                          ? `linear-gradient(${company.buttonGradientAngle || 90}deg, ${company.buttonGradientColor1}, ${company.buttonGradientColor2})`
                          : company.brandColor || 'white',
                        color: (company.buttonGradientColor1 || company.brandColor) ? 'white' : 'hsl(var(--foreground))',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick(company);
                      }}
                    >
                      View Company
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-accent" />
            </div>
            <h3 className="font-semibold text-lg text-foreground mb-2">
              {companies.length === 0 ? 'No companies yet' : 'No results found'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {companies.length === 0
                ? 'Add companies using the admin panel.'
                : 'Try adjusting your search or filters.'}
            </p>
          </div>
        )}

        {companies.length > 0 && (
          <div className="mt-8 text-center text-sm text-muted-foreground">
            Showing {filteredAndSortedCompanies.length} of {companies.length} companies
          </div>
        )}
      </div>
    </PageLayout>
  );
}
