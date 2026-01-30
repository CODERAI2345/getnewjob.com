import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Star, X } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Input } from '@/components/ui/input';
import { usePortals } from '@/hooks/usePortals';
import { useCompanies } from '@/hooks/useCompanies';
import { PortalCard, CompanyCard } from '@/components/cards/PremiumCards';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Favorites() {
  const navigate = useNavigate();
  const { portals, toggleFavorite: togglePortalFavorite, updatePortal, deletePortal } = usePortals();
  const { companies, toggleFavorite: toggleCompanyFavorite, togglePinned } = useCompanies();
  const [searchQuery, setSearchQuery] = useState('');

  const favoritePortals = useMemo(() => {
    return portals
      .filter((p) => p.isFavorite)
      .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [portals, searchQuery]);

  const favoriteCompanies = useMemo(() => {
    return companies
      .filter((c) => c.isFavorite)
      .filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [companies, searchQuery]);

  const handleOpenPortal = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <PageLayout>
      <div className="section-container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Favorites
          </h1>
          <p className="text-muted-foreground">
            Quick access to your starred portals and companies.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search favorites..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">
              All ({favoritePortals.length + favoriteCompanies.length})
            </TabsTrigger>
            <TabsTrigger value="portals">
              Portals ({favoritePortals.length})
            </TabsTrigger>
            <TabsTrigger value="companies">
              Companies ({favoriteCompanies.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {favoritePortals.length > 0 && (
              <div className="mb-8">
                <h2 className="font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  Favorite Portals
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {favoritePortals.map((portal) => (
                    <PortalCard
                      key={portal.id}
                      name={portal.name}
                      category={portal.category}
                      icon={portal.icon}
                      isFavorite={portal.isFavorite}
                      onFavorite={() => togglePortalFavorite(portal.id)}
                      onEdit={() => {}}
                      onDelete={() => deletePortal(portal.id)}
                      onOpen={() => handleOpenPortal(portal.url)}
                    />
                  ))}
                </div>
              </div>
            )}

            {favoriteCompanies.length > 0 && (
              <div>
                <h2 className="font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  Favorite Companies
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {favoriteCompanies.map((company) => (
                    <CompanyCard
                      key={company.id}
                      name={company.name}
                      industry={company.industry}
                      companySize={company.companySize}
                      hqCity={company.hqCity}
                      hqCountry={company.hqCountry}
                      technologies={company.technologies}
                      isFavorite={company.isFavorite}
                      isPinned={company.isPinned}
                      onFavorite={() => toggleCompanyFavorite(company.id)}
                      onPin={() => togglePinned(company.id)}
                      onClick={() => navigate(`/company/${company.id}`)}
                    />
                  ))}
                </div>
              </div>
            )}

            {favoritePortals.length === 0 && favoriteCompanies.length === 0 && (
              <div className="text-center py-16">
                <div className="icon-box w-16 h-16 mx-auto mb-4">
                  <Star className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  No favorites yet
                </h3>
                <p className="text-muted-foreground">
                  Star portals and companies to see them here.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="portals">
            {favoritePortals.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favoritePortals.map((portal) => (
                  <PortalCard
                    key={portal.id}
                    name={portal.name}
                    category={portal.category}
                    icon={portal.icon}
                    isFavorite={portal.isFavorite}
                    onFavorite={() => togglePortalFavorite(portal.id)}
                    onEdit={() => {}}
                    onDelete={() => deletePortal(portal.id)}
                    onOpen={() => handleOpenPortal(portal.url)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="icon-box w-16 h-16 mx-auto mb-4">
                  <Star className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  No favorite portals
                </h3>
                <p className="text-muted-foreground">
                  Star portals to see them here.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="companies">
            {favoriteCompanies.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favoriteCompanies.map((company) => (
                  <CompanyCard
                    key={company.id}
                    name={company.name}
                    industry={company.industry}
                    companySize={company.companySize}
                    hqCity={company.hqCity}
                    hqCountry={company.hqCountry}
                    technologies={company.technologies}
                    isFavorite={company.isFavorite}
                    isPinned={company.isPinned}
                    onFavorite={() => toggleCompanyFavorite(company.id)}
                    onPin={() => togglePinned(company.id)}
                    onClick={() => navigate(`/company/${company.id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="icon-box w-16 h-16 mx-auto mb-4">
                  <Star className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  No favorite companies
                </h3>
                <p className="text-muted-foreground">
                  Star companies to see them here.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
