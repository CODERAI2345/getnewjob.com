import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PortalModal } from '@/components/modals/FormModals';
import { usePortals } from '@/hooks/usePortals';
import { Portal } from '@/types';

export default function AdminPortals() {
  const { portals, addPortal, updatePortal, deletePortal } = usePortals();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPortal, setEditingPortal] = useState<Portal | undefined>();

  const filteredPortals = portals.filter((portal) =>
    portal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    portal.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  return (
    <PageLayout>
      <div className="section-container py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Link 
            to="/customize" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Admin
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                Manage Portals
              </h1>
              <p className="text-muted-foreground">
                Add, edit, or remove job portals from your directory.
              </p>
            </div>
            <span className="admin-badge">Admin</span>
          </div>
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
              className="pl-9 rounded-xl"
            />
          </div>

          <Button 
            onClick={() => {
              setEditingPortal(undefined);
              setIsModalOpen(true);
            }} 
            className="btn-gradient rounded-xl"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Portal
          </Button>
        </div>

        {/* Portals table */}
        {filteredPortals.length > 0 ? (
          <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Portal</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Category</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">URL</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredPortals.map((portal) => (
                  <tr key={portal.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                          {portal.icon ? (
                            <span className="text-xl">{portal.icon}</span>
                          ) : (
                            <span className="text-primary font-bold">{portal.name.charAt(0)}</span>
                          )}
                        </div>
                        <span className="font-medium text-foreground">{portal.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                        {portal.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <a 
                        href={portal.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-primary truncate max-w-[200px] block"
                      >
                        {portal.url}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(portal)}
                          className="h-8 w-8 rounded-lg hover:bg-secondary"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(portal.id)}
                          className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 animate-fade-in">
            <div className="icon-box w-16 h-16 mx-auto mb-4">
              <Search className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg text-foreground mb-2">
              {portals.length === 0 ? 'No portals yet' : 'No results found'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {portals.length === 0
                ? 'Add your first job portal to get started.'
                : 'Try adjusting your search.'}
            </p>
            {portals.length === 0 && (
              <Button 
                onClick={() => setIsModalOpen(true)} 
                className="btn-gradient rounded-xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Portal
              </Button>
            )}
          </div>
        )}

        {/* Count */}
        {portals.length > 0 && (
          <div className="mt-6 text-center text-sm text-muted-foreground">
            {filteredPortals.length} of {portals.length} portals
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