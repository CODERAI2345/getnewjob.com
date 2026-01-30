import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Trash2 } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CollectionCard, CompanyCard } from '@/components/cards/PremiumCards';
import { CollectionModal } from '@/components/modals/FormModals';
import { useCollections } from '@/hooks/useCollections';
import { useCompanies } from '@/hooks/useCompanies';

export default function Collections() {
  const navigate = useNavigate();
  const { collections, addCollection, deleteCollection } = useCollections();
  const { companies, toggleFavorite, togglePinned } = useCompanies();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

  const filteredCollections = collections.filter((collection) =>
    collection.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCollectionData = collections.find((c) => c.id === selectedCollection);
  const companiesInCollection = selectedCollectionData
    ? companies.filter((c) => selectedCollectionData.companyIds.includes(c.id))
    : [];

  const handleSave = (data: { name: string; description?: string }) => {
    addCollection(data);
  };

  const handleDeleteCollection = (id: string) => {
    if (confirm('Are you sure you want to delete this collection?')) {
      deleteCollection(id);
      if (selectedCollection === id) {
        setSelectedCollection(null);
      }
    }
  };

  return (
    <PageLayout>
      <div className="section-container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Collections
          </h1>
          <p className="text-muted-foreground">
            Organize companies into custom collections.
          </p>
        </div>

        {!selectedCollection ? (
          <>
            {/* Actions bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search collections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Button onClick={() => setIsModalOpen(true)} className="btn-gradient">
                <Plus className="w-4 h-4 mr-2" />
                Create Collection
              </Button>
            </div>

            {/* Collections grid */}
            {filteredCollections.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCollections.map((collection) => (
                  <div key={collection.id} className="relative group">
                    <CollectionCard
                      name={collection.name}
                      description={collection.description}
                      companyCount={collection.companyIds.length}
                      onClick={() => setSelectedCollection(collection.id)}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCollection(collection.id);
                      }}
                      className="absolute top-4 right-4 p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="icon-box w-16 h-16 mx-auto mb-4">
                  <Search className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  {collections.length === 0 ? 'No collections yet' : 'No results found'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {collections.length === 0
                    ? 'Create your first collection to organize companies.'
                    : 'Try adjusting your search.'}
                </p>
                {collections.length === 0 && (
                  <Button onClick={() => setIsModalOpen(true)} className="btn-gradient">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Collection
                  </Button>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Collection detail view */}
            <div className="mb-8">
              <button
                onClick={() => setSelectedCollection(null)}
                className="text-sm text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1"
              >
                ← Back to Collections
              </button>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground">
                    {selectedCollectionData?.name}
                  </h2>
                  {selectedCollectionData?.description && (
                    <p className="text-muted-foreground mt-1">
                      {selectedCollectionData.description}
                    </p>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {companiesInCollection.length} companies
                </div>
              </div>
            </div>

            {companiesInCollection.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {companiesInCollection.map((company) => (
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
                    onFavorite={() => toggleFavorite(company.id)}
                    onPin={() => togglePinned(company.id)}
                    onClick={() => navigate(`/company/${company.id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="icon-box w-16 h-16 mx-auto mb-4">
                  <Search className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  No companies in this collection
                </h3>
                <p className="text-muted-foreground mb-6">
                  Add companies to this collection from the company detail page.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <CollectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </PageLayout>
  );
}
