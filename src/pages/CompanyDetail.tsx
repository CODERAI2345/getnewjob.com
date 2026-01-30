import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  Pin, 
  Building2, 
  Calendar, 
  MapPin, 
  Users, 
  Briefcase,
  ExternalLink,
  Linkedin,
  Plus,
  Check,
  Save
} from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LinkCard } from '@/components/cards/PremiumCards';
import { useCompanies } from '@/hooks/useCompanies';
import { useCollections } from '@/hooks/useCollections';
import { ApplicationStatus } from '@/types';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const statusOptions: { value: ApplicationStatus; label: string; className: string }[] = [
  { value: 'not_applied', label: 'Not Applied', className: 'status-not-applied' },
  { value: 'applied', label: 'Applied', className: 'status-applied' },
  { value: 'interview', label: 'Interview', className: 'status-interview' },
  { value: 'offer', label: 'Offer', className: 'status-offer' },
  { value: 'rejected', label: 'Rejected', className: 'status-rejected' },
];

export default function CompanyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCompanyById, updateCompany, toggleFavorite, togglePinned } = useCompanies();
  const { collections, addCompanyToCollection, removeCompanyFromCollection, getCollectionsForCompany } = useCollections();

  const company = getCompanyById(id || '');
  const companyCollections = getCollectionsForCompany(id || '');

  const [notes, setNotes] = useState(company?.notes || '');
  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus>(
    company?.applicationStatus || 'not_applied'
  );
  const [appliedDate, setAppliedDate] = useState(company?.appliedDate || '');
  const [hrContact, setHrContact] = useState(company?.hrContact || '');
  const [hasChanges, setHasChanges] = useState(false);

  if (!company) {
    return (
      <PageLayout>
        <div className="section-container py-8">
          <div className="text-center py-16">
            <h2 className="font-semibold text-lg text-foreground mb-2">
              Company not found
            </h2>
            <p className="text-muted-foreground mb-6">
              The company you're looking for doesn't exist.
            </p>
            <Button onClick={() => navigate('/companies')} className="btn-gradient">
              Back to Companies
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  const handleSaveNotes = () => {
    updateCompany(company.id, {
      notes,
      applicationStatus,
      appliedDate,
      hrContact,
    });
    setHasChanges(false);
  };

  const handleCollectionToggle = (collectionId: string) => {
    const isInCollection = companyCollections.some((c) => c.id === collectionId);
    if (isInCollection) {
      removeCompanyFromCollection(collectionId, company.id);
    } else {
      addCompanyToCollection(collectionId, company.id);
    }
  };

  const location = [company.hqCity, company.hqCountry].filter(Boolean).join(', ');
  const currentStatus = statusOptions.find((s) => s.value === applicationStatus);

  return (
    <PageLayout>
      <div className="section-container py-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Header */}
        <div className="premium-card mb-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="icon-box icon-box-primary w-16 h-16 text-2xl font-bold">
                {company.name.charAt(0)}
              </div>
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  {company.name}
                </h1>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {company.industry && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary text-secondary-foreground">
                      {company.industry}
                    </span>
                  )}
                  {company.companySize && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-muted text-muted-foreground">
                      <Users className="w-3 h-3 mr-1" />
                      {company.companySize}
                    </span>
                  )}
                  <span className={cn(
                    "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
                    currentStatus?.className
                  )}>
                    {currentStatus?.label}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => toggleFavorite(company.id)}
                className={cn(
                  company.isFavorite && "text-amber-500 border-amber-500/50 bg-amber-500/10"
                )}
              >
                <Star className={cn("w-4 h-4", company.isFavorite && "fill-current")} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => togglePinned(company.id)}
                className={cn(
                  company.isPinned && "text-primary border-primary/50 bg-primary/10"
                )}
              >
                <Pin className={cn("w-4 h-4", company.isPinned && "fill-current")} />
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
            <TabsTrigger value="notes">Notes & Tracking</TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 gap-6">
              {/* About */}
              <div className="premium-card">
                <h3 className="font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  About
                </h3>
                <p className="text-muted-foreground">
                  {company.description || 'No description provided.'}
                </p>
              </div>

              {/* Details */}
              <div className="premium-card">
                <h3 className="font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Details
                </h3>
                <div className="space-y-4">
                  {company.foundedYear && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Founded:</span>
                      <span className="text-foreground">{company.foundedYear}</span>
                    </div>
                  )}
                  {location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">HQ:</span>
                      <span className="text-foreground">{location}</span>
                    </div>
                  )}
                  {company.companySize && (
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Size:</span>
                      <span className="text-foreground">{company.companySize} employees</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Technologies */}
              {company.technologies && company.technologies.length > 0 && (
                <div className="premium-card md:col-span-2">
                  <h3 className="font-semibold text-lg text-foreground mb-4">
                    Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {company.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-primary/10 text-primary"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="links">
            <div className="space-y-4 max-w-xl">
              <LinkCard
                title="Career Site"
                url={company.careerUrl}
                icon={<ExternalLink className="w-5 h-5 text-primary" />}
              />
              {company.linkedinUrl && (
                <LinkCard
                  title="LinkedIn"
                  url={company.linkedinUrl}
                  icon={<Linkedin className="w-5 h-5 text-primary" />}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="notes">
            <div className="premium-card max-w-2xl">
              <h3 className="font-semibold text-lg text-foreground mb-6">
                Application Tracking
              </h3>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <Label htmlFor="status">Application Status</Label>
                  <Select
                    value={applicationStatus}
                    onValueChange={(v) => {
                      setApplicationStatus(v as ApplicationStatus);
                      setHasChanges(true);
                    }}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="appliedDate">Applied Date</Label>
                  <Input
                    id="appliedDate"
                    type="date"
                    value={appliedDate}
                    onChange={(e) => {
                      setAppliedDate(e.target.value);
                      setHasChanges(true);
                    }}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div className="mb-6">
                <Label htmlFor="hrContact">HR Contact</Label>
                <Input
                  id="hrContact"
                  value={hrContact}
                  onChange={(e) => {
                    setHrContact(e.target.value);
                    setHasChanges(true);
                  }}
                  placeholder="Name, email, or LinkedIn"
                  className="mt-1.5"
                />
              </div>

              <div className="mb-6">
                <Label htmlFor="notes">Personal Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => {
                    setNotes(e.target.value);
                    setHasChanges(true);
                  }}
                  placeholder="Add your notes about this company, interview experiences, etc."
                  className="mt-1.5"
                  rows={6}
                />
              </div>

              <Button
                onClick={handleSaveNotes}
                disabled={!hasChanges}
                className={cn(hasChanges ? 'btn-gradient' : '')}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="collections">
            <div className="premium-card max-w-xl">
              <h3 className="font-semibold text-lg text-foreground mb-4">
                Add to Collections
              </h3>

              {collections.length > 0 ? (
                <div className="space-y-2">
                  {collections.map((collection) => {
                    const isInCollection = companyCollections.some((c) => c.id === collection.id);
                    return (
                      <button
                        key={collection.id}
                        onClick={() => handleCollectionToggle(collection.id)}
                        className={cn(
                          "w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200",
                          isInCollection
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50 hover:bg-muted"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium",
                            isInCollection
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          )}>
                            {collection.name.charAt(0)}
                          </div>
                          <span className="font-medium text-foreground">{collection.name}</span>
                        </div>
                        {isInCollection ? (
                          <Check className="w-5 h-5 text-primary" />
                        ) : (
                          <Plus className="w-5 h-5 text-muted-foreground" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    No collections yet. Create one to organize your companies.
                  </p>
                  <Button onClick={() => navigate('/collections')} variant="outline">
                    Go to Collections
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
