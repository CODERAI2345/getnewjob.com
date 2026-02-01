import { useState, useMemo } from 'react';
import { Search, Globe, MapPin } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Input } from '@/components/ui/input';
import { PortalCard } from '@/components/cards/PremiumCards';
import { usePortals } from '@/hooks/usePortals';
import { Portal } from '@/types';

// Define subtabs with their region/category
const subtabs = [
  { id: 'all', label: 'All Portals', icon: Globe },
  { id: 'remote', label: 'Remote Jobs', icon: Globe },
  { id: 'germany', label: 'Germany', icon: MapPin },
  { id: 'finland', label: 'Finland', icon: MapPin },
  { id: 'sweden', label: 'Sweden', icon: MapPin },
  { id: 'norway', label: 'Norway', icon: MapPin },
];

export default function Portals() {
  const { portals, toggleFavorite, deletePortal } = usePortals();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredPortals = useMemo(() => {
    return portals.filter((portal) => {
      const matchesSearch = portal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        portal.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by region/category based on active tab
      if (activeTab === 'all') return matchesSearch;
      if (activeTab === 'remote') {
        return matchesSearch && (
          portal.category.toLowerCase().includes('remote') ||
          portal.name.toLowerCase().includes('remote')
        );
      }
      // For country tabs, check if portal name or category contains the country
      const countryMatch = portal.name.toLowerCase().includes(activeTab) ||
        portal.category.toLowerCase().includes(activeTab);
      return matchesSearch && countryMatch;
    });
  }, [portals, searchQuery, activeTab]);

  const handleOpen = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <PageLayout>
      <div className="section-container py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Job Portals
          </h1>
          <p className="text-muted-foreground">
            Browse job portals by region or category.
          </p>
        </div>

        {/* Subtabs */}
        <div className="subtab-container mb-6">
          {subtabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`subtab flex items-center gap-2 ${activeTab === tab.id ? 'active' : ''}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search portals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-xl"
          />
        </div>

        {/* Portals grid */}
        {filteredPortals.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-animate">
            {filteredPortals.map((portal) => (
              <PortalCard
                key={portal.id}
                name={portal.name}
                category={portal.category}
                icon={portal.icon}
                onOpen={() => handleOpen(portal.url)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 animate-fade-in">
            <div className="icon-box w-16 h-16 mx-auto mb-4">
              <Search className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg text-foreground mb-2">
              {portals.length === 0 ? 'No portals yet' : 'No results found'}
            </h3>
            <p className="text-muted-foreground">
              {portals.length === 0
                ? 'No job portals available for this region.'
                : 'Try adjusting your search or switch tabs.'}
            </p>
          </div>
        )}

        {/* Results count */}
        {portals.length > 0 && (
          <div className="mt-8 text-center text-sm text-muted-foreground">
            Showing {filteredPortals.length} of {portals.length} portals
          </div>
        )}
      </div>
    </PageLayout>
  );
}