import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Upload, Download, ArrowUpDown, Edit2 } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CompanyCard } from '@/components/cards/PremiumCards';
import { ImportModal } from '@/components/modals/ImportModal';
import { useCompanies } from '@/hooks/useCompanies';
import { Company, SortOption } from '@/types';
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-animate">
            {filteredAndSortedCompanies.map((company) => (
              <CompanyCard
                key={company.id}
                name={company.name}
                brandTitleHtml={company.brandTitleHtml}
                logoUrl={company.logoUrl}
                industry={company.industry}
                companySize={company.companySize}
                hqCity={company.hqCity}
                hqCountry={company.hqCountry}
                technologies={company.technologies}
                isPinned={company.isPinned}
                onPin={() => togglePinned(company.id)}
                onClick={() => navigate(`/company/${company.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 animate-fade-in">
            <div className="icon-box w-16 h-16 mx-auto mb-4">
              <Search className="w-8 h-8 text-primary" />
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
              <Button variant="outline" onClick={() => setIsImportModalOpen(true)} className="rounded-xl">
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