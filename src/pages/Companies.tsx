import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Upload, Download, ArrowUpDown, Pin } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImportModal } from '@/components/modals/ImportModal';
import { useCompanies } from '@/hooks/useCompanies';
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
  'All',
  'Technology',
  'Finance',
  'Healthcare',
  'E-commerce',
  'Education',
  'Manufacturing',
  'Consulting',
  'Media',
  'Telecom',
  'Automotive',
  'Energy',
  'Real Estate',
  'Other',
];

const companySizes = [
  'All',
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1000',
  '1001-5000',
  '5000+',
];

export default function Companies() {
  const navigate = useNavigate();
  const { companies, togglePinned, importCompanies, exportCompanies } = useCompanies();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const filteredAndSortedCompanies = useMemo(() => {
    let result = companies.filter((company) => {
      const matchesSearch = 
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.industry?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.technologies?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesIndustry = selectedIndustry === 'All' || company.industry === selectedIndustry;
      const matchesSize = selectedSize === 'All' || company.companySize === selectedSize;
      return matchesSearch && matchesIndustry && matchesSize;
    });

    // Sort
    result.sort((a, b) => {
      // Pinned companies always come first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      switch (sortBy) {
        case 'a-z':
          return a.name.localeCompare(b.name);
        case 'z-a':
          return b.name.localeCompare(a.name);
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'size':
          const sizeOrder = ['5000+', '1001-5000', '501-1000', '201-500', '51-200', '11-50', '1-10'];
          const aIndex = sizeOrder.indexOf(a.companySize || '');
          const bIndex = sizeOrder.indexOf(b.companySize || '');
          return aIndex - bIndex;
        default:
          return 0;
      }
    });

    return result;
  }, [companies, searchQuery, selectedIndustry, selectedSize, sortBy]);

  const handleExport = () => {
    const data = exportCompanies();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `careerhub-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
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

        {/* Actions bar */}
        <div className="flex flex-col gap-4 mb-8">
          {/* Search */}
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

          {/* Filters row */}
          <div className="flex flex-wrap gap-3">
            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger className="w-[160px] rounded-xl">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((ind) => (
                  <SelectItem key={ind} value={ind}>
                    {ind}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger className="w-[140px] rounded-xl">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                {companySizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size === 'All' ? 'All Sizes' : `${size} employees`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-[130px] rounded-xl">
                <ArrowUpDown className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="a-z">A-Z</SelectItem>
                <SelectItem value="z-a">Z-A</SelectItem>
                <SelectItem value="size">Size</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex-1" />

            <Button variant="outline" onClick={() => setIsImportModalOpen(true)} className="rounded-xl">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>

            <Button variant="outline" onClick={handleExport} className="rounded-xl">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Companies grid */}
        {filteredAndSortedCompanies.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-animate">
            {filteredAndSortedCompanies.map((company) => (
              <div
                key={company.id}
                onClick={() => navigate(`/company/${company.id}`)}
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
                  <div
                    className={cn(
                      "logo-fallback absolute inset-0 bg-gradient-to-br from-primary/40 via-accent/30 to-primary/20 items-center justify-center",
                      company.logoUrl ? "hidden" : "flex"
                    )}
                  >
                    <span className="text-8xl font-bold text-white/30 font-display">{company.name.charAt(0)}</span>
                  </div>
                </div>

                {/* Dark gradient overlay from bottom - uses brand color if available */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: company.brandColor
                      ? `linear-gradient(to top, ${company.brandColor}ee, ${company.brandColor}66, transparent)`
                      : 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.4), transparent)',
                  }}
                />

                {/* Pinned badge */}
                {company.isPinned && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <Pin className="w-4 h-4 text-white fill-current" />
                    </div>
                  </div>
                )}

                {/* Content at the bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-3">
                  {/* Company name */}
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

                  {/* Description / Location */}
                  <p className="text-sm text-white/70 line-clamp-2 leading-relaxed">
                    {company.description || company.about || (
                      [company.hqCity, company.hqCountry].filter(Boolean).length > 0
                        ? `Located in ${[company.hqCity, company.hqCountry].filter(Boolean).join(', ')}.`
                        : `Explore career opportunities at ${company.name}.`
                    )}
                  </p>

                  {/* Pill tags */}
                  <div className="flex flex-wrap gap-2">
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

                  {/* CTA Button */}
                  <button
                    className="mt-1 w-full py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-lg"
                    style={{
                      backgroundColor: company.brandColor || 'white',
                      color: company.brandColor ? 'white' : 'hsl(var(--foreground))',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/company/${company.id}`);
                    }}
                  >
                    View Company
                  </button>
                </div>
              </div>
            ))}
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
                ? 'Import companies from CSV using the admin panel.'
                : 'Try adjusting your search or filters.'}
            </p>
            {companies.length === 0 && (
              <Button variant="outline" onClick={() => setIsImportModalOpen(true)} className="rounded-xl border-accent/30 text-accent hover:bg-accent/10">
                <Upload className="w-4 h-4 mr-2" />
                Import from CSV
              </Button>
            )}
          </div>
        )}

        {/* Results count */}
        {companies.length > 0 && (
          <div className="mt-8 text-center text-sm text-muted-foreground">
            Showing {filteredAndSortedCompanies.length} of {companies.length} companies
          </div>
        )}
      </div>

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={importCompanies}
      />
    </PageLayout>
  );
}