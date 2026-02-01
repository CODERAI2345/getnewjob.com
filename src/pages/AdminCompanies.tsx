import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, ArrowLeft, Edit2, Trash2, Upload } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CompanyModal } from '@/components/modals/FormModals';
import { ImportModal } from '@/components/modals/ImportModal';
import { useCompanies } from '@/hooks/useCompanies';
import { Company } from '@/types';

export default function AdminCompanies() {
  const { companies, addCompany, updateCompany, deleteCompany, importCompanies } = useCompanies();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | undefined>();

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.industry?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = (data: Partial<Company>) => {
    if (editingCompany) {
      updateCompany(editingCompany.id, data);
    } else {
      addCompany(data as Omit<Company, 'id' | 'createdAt' | 'updatedAt' | 'isFavorite' | 'isPinned'>);
    }
    setEditingCompany(undefined);
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this company?')) {
      deleteCompany(id);
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
                Manage Companies
              </h1>
              <p className="text-muted-foreground">
                Add, edit, or remove companies from your directory.
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
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-xl"
            />
          </div>

          <Button 
            variant="outline" 
            onClick={() => setIsImportModalOpen(true)}
            className="rounded-xl"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import CSV
          </Button>

          <Button 
            onClick={() => {
              setEditingCompany(undefined);
              setIsModalOpen(true);
            }} 
            className="btn-gradient rounded-xl"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Company
          </Button>
        </div>

        {/* Companies table */}
        {filteredCompanies.length > 0 ? (
          <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Company</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Industry</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Size</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Location</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredCompanies.map((company) => (
                    <tr key={company.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center overflow-hidden">
                            {company.logoUrl ? (
                              <img src={company.logoUrl} alt={company.name} className="w-full h-full object-contain" />
                            ) : (
                              <span className="text-primary-foreground font-bold">{company.name.charAt(0)}</span>
                            )}
                          </div>
                          <span className="font-medium text-foreground">{company.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {company.industry && (
                          <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                            {company.industry}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-muted-foreground">
                          {company.companySize || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-muted-foreground">
                          {[company.hqCity, company.hqCountry].filter(Boolean).join(', ') || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(company)}
                            className="h-8 w-8 rounded-lg hover:bg-secondary"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(company.id)}
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
                ? 'Add your first company or import from CSV.'
                : 'Try adjusting your search.'}
            </p>
            {companies.length === 0 && (
              <div className="flex justify-center gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsImportModalOpen(true)}
                  className="rounded-xl"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import CSV
                </Button>
                <Button 
                  onClick={() => setIsModalOpen(true)} 
                  className="btn-gradient rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Company
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Count */}
        {companies.length > 0 && (
          <div className="mt-6 text-center text-sm text-muted-foreground">
            {filteredCompanies.length} of {companies.length} companies
          </div>
        )}
      </div>

      <CompanyModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCompany(undefined);
        }}
        onSave={handleSave}
        company={editingCompany}
      />

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={importCompanies}
      />
    </PageLayout>
  );
}