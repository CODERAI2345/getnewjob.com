import { useState, useEffect } from 'react';
import { X, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RichTextPaste } from '@/components/inputs/RichTextPaste';
import { Portal, Company } from '@/types';

interface PortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (portal: Omit<Portal, 'id' | 'createdAt' | 'updatedAt' | 'isFavorite'>) => void;
  portal?: Portal;
}

const categories = [
  'Job Board',
  'Company Career Page',
  'Freelance',
  'Remote Work',
  'Tech',
  'Startup',
  'Enterprise',
  'Government',
  'Non-profit',
  'Germany',
  'Finland',
  'Sweden',
  'Norway',
  'Other',
];

export function PortalModal({ isOpen, onClose, onSave, portal }: PortalModalProps) {
  const [name, setName] = useState(portal?.name || '');
  const [url, setUrl] = useState(portal?.url || '');
  const [category, setCategory] = useState(portal?.category || '');
  const [icon, setIcon] = useState(portal?.icon || '');

  useEffect(() => {
    if (portal) {
      setName(portal.name);
      setUrl(portal.url);
      setCategory(portal.category);
      setIcon(portal.icon || '');
    } else {
      setName('');
      setUrl('');
      setCategory('');
      setIcon('');
    }
  }, [portal, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url || !category) return;

    onSave({ name, url, category, icon });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-2xl shadow-xl p-6 w-full max-w-md mx-4 animate-scale-in border border-border">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="font-display text-2xl font-semibold mb-6">
          {portal ? 'Edit Portal' : 'Add Portal'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Portal Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., LinkedIn Jobs"
              className="mt-1.5 rounded-xl"
              required
            />
          </div>

          <div>
            <Label htmlFor="url">URL *</Label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="mt-1.5 rounded-xl"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="mt-1.5 rounded-xl">
                <SelectValue placeholder="Select a category" />
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

          <div>
            <Label htmlFor="icon">Icon (emoji)</Label>
            <Input
              id="icon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="💼"
              className="mt-1.5 rounded-xl"
              maxLength={2}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-xl">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 btn-gradient rounded-xl">
              {portal ? 'Save Changes' : 'Add Portal'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (company: any) => void;
  company?: Company;
}

const industries = [
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
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1000',
  '1001-5000',
  '5000+',
];

export function CompanyModal({ isOpen, onClose, onSave, company }: CompanyModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    brandTitleHtml: '',
    logoUrl: '',
    careerUrl: '',
    website: '',
    linkedinUrl: '',
    foundedYear: '',
    hqCity: '',
    hqCountry: '',
    industry: '',
    companySize: '',
    technologies: '',
    description: '',
    notes: '',
  });

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || '',
        brandTitleHtml: company.brandTitleHtml || '',
        logoUrl: company.logoUrl || '',
        careerUrl: company.careerUrl || '',
        website: company.website || '',
        linkedinUrl: company.linkedinUrl || '',
        foundedYear: company.foundedYear?.toString() || '',
        hqCity: company.hqCity || '',
        hqCountry: company.hqCountry || '',
        industry: company.industry || '',
        companySize: company.companySize || '',
        technologies: company.technologies?.join(', ') || '',
        description: company.description || '',
        notes: company.notes || '',
      });
    } else {
      setFormData({
        name: '',
        brandTitleHtml: '',
        logoUrl: '',
        careerUrl: '',
        website: '',
        linkedinUrl: '',
        foundedYear: '',
        hqCity: '',
        hqCountry: '',
        industry: '',
        companySize: '',
        technologies: '',
        description: '',
        notes: '',
      });
    }
  }, [company, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    onSave({
      ...formData,
      brandTitleHtml: formData.brandTitleHtml || undefined,
      logoUrl: formData.logoUrl || undefined,
      careerUrl: formData.careerUrl || formData.website || '#',
      website: formData.website || undefined,
      foundedYear: formData.foundedYear ? parseInt(formData.foundedYear) : undefined,
      technologies: formData.technologies
        ? formData.technologies.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
    });
    onClose();
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField('logoUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-2xl shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto animate-scale-in border border-border scrollbar-thin">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="font-display text-2xl font-semibold mb-6">
          {company ? 'Edit Company' : 'Add Company'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Company Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="e.g., Acme Inc."
                className="mt-1.5 rounded-xl"
                required
              />
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => updateField('website', e.target.value)}
                placeholder="https://acme.com"
                className="mt-1.5 rounded-xl"
              />
            </div>
          </div>

          {/* Logo Upload */}
          <div>
            <Label className="flex items-center gap-2">
              <Image className="w-4 h-4 text-primary" />
              Company Logo
            </Label>
            <div className="mt-1.5 flex items-center gap-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="flex-1 rounded-xl"
              />
              <span className="text-sm text-muted-foreground">or</span>
              <Input
                type="url"
                value={formData.logoUrl}
                onChange={(e) => updateField('logoUrl', e.target.value)}
                placeholder="Logo URL"
                className="flex-1 rounded-xl"
              />
            </div>
            {formData.logoUrl && (
              <div className="mt-3 flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl border border-border overflow-hidden bg-muted flex items-center justify-center">
                  <img 
                    src={formData.logoUrl} 
                    alt="Logo preview" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <Button 
                  type="button"
                  variant="outline" 
                  size="sm"
                  onClick={() => updateField('logoUrl', '')}
                  className="rounded-xl"
                >
                  Remove
                </Button>
              </div>
            )}
          </div>

          <RichTextPaste
            label="Company Brand Title (paste styled text)"
            value={formData.brandTitleHtml}
            onChange={(html) => updateField('brandTitleHtml', html)}
            placeholder="Paste the company title with styling from their website..."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="careerUrl">Career Site URL</Label>
              <Input
                id="careerUrl"
                type="url"
                value={formData.careerUrl}
                onChange={(e) => updateField('careerUrl', e.target.value)}
                placeholder="https://careers.acme.com"
                className="mt-1.5 rounded-xl"
              />
            </div>

            <div>
              <Label htmlFor="linkedinUrl">LinkedIn Company Page</Label>
              <Input
                id="linkedinUrl"
                type="url"
                value={formData.linkedinUrl}
                onChange={(e) => updateField('linkedinUrl', e.target.value)}
                placeholder="https://linkedin.com/company/acme"
                className="mt-1.5 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="foundedYear">Founded Year</Label>
              <Input
                id="foundedYear"
                type="number"
                value={formData.foundedYear}
                onChange={(e) => updateField('foundedYear', e.target.value)}
                placeholder="2015"
                className="mt-1.5 rounded-xl"
                min="1800"
                max={new Date().getFullYear()}
              />
            </div>

            <div>
              <Label htmlFor="hqCity">HQ City</Label>
              <Input
                id="hqCity"
                value={formData.hqCity}
                onChange={(e) => updateField('hqCity', e.target.value)}
                placeholder="San Francisco"
                className="mt-1.5 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hqCountry">HQ Country</Label>
              <Input
                id="hqCountry"
                value={formData.hqCountry}
                onChange={(e) => updateField('hqCountry', e.target.value)}
                placeholder="USA"
                className="mt-1.5 rounded-xl"
              />
            </div>

            <div>
              <Label htmlFor="industry">Industry</Label>
              <Select value={formData.industry} onValueChange={(v) => updateField('industry', v)}>
                <SelectTrigger className="mt-1.5 rounded-xl">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((ind) => (
                    <SelectItem key={ind} value={ind}>
                      {ind}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companySize">Company Size</Label>
              <Select value={formData.companySize} onValueChange={(v) => updateField('companySize', v)}>
                <SelectTrigger className="mt-1.5 rounded-xl">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {companySizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size} employees
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="technologies">Technologies (comma-separated)</Label>
            <Input
              id="technologies"
              value={formData.technologies}
              onChange={(e) => updateField('technologies', e.target.value)}
              placeholder="React, Node.js, AWS, Kubernetes"
              className="mt-1.5 rounded-xl"
            />
          </div>

          <div>
            <Label htmlFor="description">About / Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Brief description of the company..."
              className="mt-1.5 rounded-xl"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="notes">Private Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              placeholder="Your personal notes about this company..."
              className="mt-1.5 rounded-xl"
              rows={2}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-xl">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 btn-gradient rounded-xl">
              {company ? 'Save Changes' : 'Add Company'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}