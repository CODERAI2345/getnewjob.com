import { useState, useMemo } from 'react';
import { Globe, MapPin, ExternalLink } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { PortalCard } from '@/components/cards/PremiumCards';
import { usePortals } from '@/hooks/usePortals';

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
  const { portals } = usePortals();
  const [activeTab, setActiveTab] = useState('all');

  const filteredPortals = useMemo(() => {
    return portals.filter((portal) => {
      // Filter by region/category based on active tab
      if (activeTab === 'all') return true;
      if (activeTab === 'remote') {
        return portal.category.toLowerCase().includes('remote') ||
          portal.name.toLowerCase().includes('remote');
      }
      // For country tabs, check if portal category contains the country
      return portal.category.toLowerCase().includes(activeTab);
    });
  }, [portals, activeTab]);

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
        <div className="flex flex-wrap gap-2 mb-6">
          {subtabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-indigo-50 dark:bg-secondary text-primary hover:bg-indigo-100 dark:hover:bg-secondary/80'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
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
                imageUrl={portal.imageUrl}
                onOpen={() => handleOpen(portal.url)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 animate-fade-in">
            <div className="icon-box w-16 h-16 mx-auto mb-4">
              <ExternalLink className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg text-foreground mb-2">
              No portals in this category
            </h3>
            <p className="text-muted-foreground">
              Add portals via the Settings to see them here.
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