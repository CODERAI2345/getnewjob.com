import { useState, useMemo } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PortalCard } from '@/components/cards/PremiumCards';
import { PortalModal } from '@/components/modals/FormModals';
import { usePortals } from '@/hooks/usePortals';
import { Portal } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const categories = [
  'All',
  'Job Board',
  'Company Career Page',
  'Freelance',
  'Remote Work',
  'Tech',
  'Startup',
  'Enterprise',
  'Government',
  'Non-profit',
  'Other',
];

export default function Portals() {
  const { portals, addPortal, updatePortal, deletePortal, toggleFavorite } = usePortals();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPortal, setEditingPortal] = useState<Portal | undefined>();

  const filteredPortals = useMemo(() => {
    return portals.filter((portal) => {
      const matchesSearch = portal.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || portal.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [portals, searchQuery, selectedCategory]);

  const handleSave = (data: Omit<Portal, 'id' | 'createdAt' | 'updatedAt' | 'isFavorite'>) => {
    if (editingPortal) {
      updatePortal(editingPortal.id, data);
    } else {
      addPortal(data);
    }
    setEditingPortal(undefined);
  };

  const handleEdit = (portal: Portal) => {
    setEditingPortal(portal);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this portal?')) {
      deletePortal(id);
    }
  };

  const handleOpen = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <PageLayout>
      <div className="section-container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Job Portals
          </h1>
          <p className="text-muted-foreground">
            Manage all your job search portals in one place.
          </p>
        </div>

        {/* Actions bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search portals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex gap-3">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

          </div>
        </div>

        {/* Portals grid */}
        {filteredPortals.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPortals.map((portal) => (
              <PortalCard
                key={portal.id}
                name={portal.name}
                category={portal.category}
                icon={portal.icon}
                isFavorite={portal.isFavorite}
                onFavorite={() => toggleFavorite(portal.id)}
                onEdit={() => handleEdit(portal)}
                onDelete={() => handleDelete(portal.id)}
                onOpen={() => handleOpen(portal.url)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="icon-box w-16 h-16 mx-auto mb-4">
              <Search className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg text-foreground mb-2">
              {portals.length === 0 ? 'No portals yet' : 'No results found'}
            </h3>
            <p className="text-muted-foreground">
              {portals.length === 0
                ? 'No job portals available.'
                : 'Try adjusting your search or filters.'}
            </p>
          </div>
        )}
      </div>

      <PortalModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPortal(undefined);
        }}
        onSave={handleSave}
        portal={editingPortal}
      />
    </PageLayout>
  );
}
