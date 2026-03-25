import { useState, useEffect } from 'react';
import { X, Image, Loader2 } from 'lucide-react';
import { uploadImage } from '@/lib/storage';
import { Portal, Company } from '@/types';
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

interface PortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (portal: Omit<Portal, 'id' | 'createdAt' | 'updatedAt' | 'isFavorite'>) => void;
  portal?: Portal;
}

const categories = [
  'Remote Jobs', 'Germany', 'Finland', 'Sweden', 'Norway',
  'Job Board', 'Tech', 'Startup', 'Freelance', 'Other',
];

export function PortalModal({ isOpen, onClose, onSave, portal }: PortalModalProps) {
  const [name, setName] = useState(portal?.name || '');
  const [url, setUrl] = useState(portal?.url || '');
  const [category, setCategory] = useState(portal?.category || '');
  const [icon, setIcon] = useState(portal?.icon || '');
  const [imageUrl, setImageUrl] = useState(portal?.imageUrl || '');

  useEffect(() => {
    if (portal) {
      setName(portal.name);
      setUrl(portal.url);
      setCategory(portal.category);
      setIcon(portal.icon || '');
      setImageUrl(portal.imageUrl || '');
    } else {
      setName('');
      setUrl('');
      setCategory('');
      setIcon('');
      setImageUrl('');
    }
  }, [portal, isOpen]);

  const [uploading, setUploading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url || !category) return;
    onSave({ name, url, category, icon, imageUrl: imageUrl || undefined });
    onClose();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      const url = await uploadImage(file, 'portals');
      if (url) setImageUrl(url);
      setUploading(false);
    }
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
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
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

          <div>
            <Label className="flex items-center gap-2">
              <Image className="w-4 h-4 text-primary" />
              Portal Image
            </Label>
            <div className="mt-1.5 flex items-center gap-4">
              <Input type="file" accept="image/*" onChange={handleImageUpload} className="flex-1 rounded-xl" />
              <span className="text-sm text-muted-foreground">or</span>
              <Input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Image URL" className="flex-1 rounded-xl" />
            </div>
            {imageUrl && (
              <div className="mt-3 flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl border border-border overflow-hidden bg-muted flex items-center justify-center">
                  <img src={imageUrl} alt="Portal preview" className="w-full h-full object-contain" />
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => setImageUrl('')} className="rounded-xl">Remove</Button>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-xl">Cancel</Button>
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
  'Technology', 'Finance', 'Healthcare', 'E-commerce', 'Education',
  'Manufacturing', 'Consulting', 'Media', 'Telecom', 'Automotive',
  'Energy', 'Real Estate', 'Other',
];

const companySizes = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5000+'];

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
    companyType: '',
    fundingStage: '',
    fundingAmount: '',
    sector: '',
    isUnicorn: 'false',
    technologies: '',
    description: '',
    notes: '',
    brandColor: '',
    gradientColor1: '',
    gradientColor2: '',
    gradientAngle: '180',
    buttonGradientColor1: '',
    buttonGradientColor2: '',
    buttonGradientAngle: '90',
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
        companyType: company.companyType || '',
        fundingStage: company.fundingStage || '',
        fundingAmount: company.fundingAmount || '',
        sector: company.sector || '',
        isUnicorn: company.isUnicorn ? 'true' : 'false',
        technologies: company.technologies?.join(', ') || '',
        description: company.description || '',
        notes: company.notes || '',
        brandColor: company.brandColor || '',
        gradientColor1: company.gradientColor1 || '',
        gradientColor2: company.gradientColor2 || '',
        gradientAngle: company.gradientAngle?.toString() || '180',
        buttonGradientColor1: company.buttonGradientColor1 || '',
        buttonGradientColor2: company.buttonGradientColor2 || '',
        buttonGradientAngle: company.buttonGradientAngle?.toString() || '90',
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
        companyType: '',
        fundingStage: '',
        fundingAmount: '',
        sector: '',
        isUnicorn: 'false',
        technologies: '',
        description: '',
        notes: '',
        brandColor: '',
        gradientColor1: '',
        gradientColor2: '',
        gradientAngle: '180',
        buttonGradientColor1: '',
        buttonGradientColor2: '',
        buttonGradientAngle: '90',
      });
    }
  }, [company, isOpen]);

  const [logoUploading, setLogoUploading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    onSave({
      ...formData,
      brandTitleHtml: formData.brandTitleHtml || undefined,
      logoUrl: formData.logoUrl || undefined,
      brandColor: formData.brandColor || undefined,
      gradientColor1: formData.gradientColor1 || undefined,
      gradientColor2: formData.gradientColor2 || undefined,
      gradientAngle: formData.gradientAngle ? parseInt(formData.gradientAngle) : 180,
      buttonGradientColor1: formData.buttonGradientColor1 || undefined,
      buttonGradientColor2: formData.buttonGradientColor2 || undefined,
      buttonGradientAngle: formData.buttonGradientAngle ? parseInt(formData.buttonGradientAngle) : 90,
      careerUrl: formData.careerUrl || formData.website || '#',
      website: formData.website || undefined,
      foundedYear: formData.foundedYear ? parseInt(formData.foundedYear) : undefined,
      technologies: formData.technologies
        ? formData.technologies.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
      companyType: (formData.companyType as Company['companyType']) || undefined,
      fundingStage: (formData.fundingStage as Company['fundingStage']) || undefined,
      fundingAmount: formData.fundingAmount || undefined,
      sector: formData.sector || undefined,
      isUnicorn: formData.isUnicorn === 'true',
    });
    onClose();
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoUploading(true);
      const url = await uploadImage(file, 'logos');
      if (url) updateField('logoUrl', url);
      setLogoUploading(false);
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
              <Input id="name" value={formData.name} onChange={(e) => updateField('name', e.target.value)} placeholder="e.g., Acme Inc." className="mt-1.5 rounded-xl" required />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input id="website" type="url" value={formData.website} onChange={(e) => updateField('website', e.target.value)} placeholder="https://acme.com" className="mt-1.5 rounded-xl" />
            </div>
          </div>

          {/* Logo Upload */}
          <div>
            <Label className="flex items-center gap-2">
              <Image className="w-4 h-4 text-primary" />
              Company Logo
            </Label>
            <div className="mt-1.5 flex items-center gap-4">
              <Input type="file" accept="image/*" onChange={handleLogoUpload} className="flex-1 rounded-xl" />
              <span className="text-sm text-muted-foreground">or</span>
              <Input type="url" value={formData.logoUrl} onChange={(e) => updateField('logoUrl', e.target.value)} placeholder="Logo URL" className="flex-1 rounded-xl" />
            </div>
            {formData.logoUrl && (
              <div className="mt-3 flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl border border-border overflow-hidden bg-muted flex items-center justify-center">
                  <img src={formData.logoUrl} alt="Logo preview" className="w-full h-full object-contain" />
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => updateField('logoUrl', '')} className="rounded-xl">Remove</Button>
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
              <Input id="careerUrl" type="url" value={formData.careerUrl} onChange={(e) => updateField('careerUrl', e.target.value)} placeholder="https://careers.acme.com" className="mt-1.5 rounded-xl" />
            </div>
            <div>
              <Label htmlFor="linkedinUrl">LinkedIn Company Page</Label>
              <Input id="linkedinUrl" type="url" value={formData.linkedinUrl} onChange={(e) => updateField('linkedinUrl', e.target.value)} placeholder="https://linkedin.com/company/acme" className="mt-1.5 rounded-xl" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="foundedYear">Founded Year</Label>
              <Input id="foundedYear" type="number" value={formData.foundedYear} onChange={(e) => updateField('foundedYear', e.target.value)} placeholder="2015" className="mt-1.5 rounded-xl" min="1800" max={new Date().getFullYear()} />
            </div>
            <div>
              <Label htmlFor="hqCity">HQ City</Label>
              <Input id="hqCity" value={formData.hqCity} onChange={(e) => updateField('hqCity', e.target.value)} placeholder="San Francisco" className="mt-1.5 rounded-xl" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hqCountry">HQ Country</Label>
              <Input id="hqCountry" value={formData.hqCountry} onChange={(e) => updateField('hqCountry', e.target.value)} placeholder="USA" className="mt-1.5 rounded-xl" />
            </div>
            <div>
              <Label htmlFor="industry">Industry</Label>
              <Select value={formData.industry} onValueChange={(v) => updateField('industry', v)}>
                <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue placeholder="Select industry" /></SelectTrigger>
                <SelectContent>
                  {industries.map((ind) => (<SelectItem key={ind} value={ind}>{ind}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companySize">Company Size</Label>
              <Select value={formData.companySize} onValueChange={(v) => updateField('companySize', v)}>
                <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue placeholder="Select size" /></SelectTrigger>
                <SelectContent>
                  {companySizes.map((size) => (<SelectItem key={size} value={size}>{size} employees</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="technologies">Technologies (comma-separated)</Label>
            <Input id="technologies" value={formData.technologies} onChange={(e) => updateField('technologies', e.target.value)} placeholder="React, Node.js, AWS, Kubernetes" className="mt-1.5 rounded-xl" />
          </div>

          {/* Company Classification */}
          <div className="bg-muted/30 rounded-xl p-4 space-y-4 border border-border/50">
            <Label className="text-sm font-semibold">Company Classification</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Company Type</Label>
                <Select value={formData.companyType} onValueChange={(v) => updateField('companyType', v)}>
                  <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="product">📦 Product-based</SelectItem>
                    <SelectItem value="service">🛠 Service-based</SelectItem>
                    <SelectItem value="mnc">🌐 MNC</SelectItem>
                    <SelectItem value="startup">🚀 Startup</SelectItem>
                    <SelectItem value="unicorn">🦄 Unicorn</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Funding Stage</Label>
                <Select value={formData.fundingStage} onValueChange={(v) => updateField('fundingStage', v)}>
                  <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue placeholder="Select stage" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bootstrapped">Bootstrapped</SelectItem>
                    <SelectItem value="seed">Seed</SelectItem>
                    <SelectItem value="series-a">Series A</SelectItem>
                    <SelectItem value="series-b">Series B</SelectItem>
                    <SelectItem value="series-c">Series C</SelectItem>
                    <SelectItem value="series-d+">Series D+</SelectItem>
                    <SelectItem value="ipo">IPO / Public</SelectItem>
                    <SelectItem value="acquired">Acquired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Sector</Label>
                <Select value={formData.sector} onValueChange={(v) => updateField('sector', v)}>
                  <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue placeholder="Select sector" /></SelectTrigger>
                  <SelectContent>
                    {['Fintech','Healthtech','Edtech','SaaS','D2C','E-commerce','Logistics','AI/ML','Cybersecurity','Gaming','HR Tech','LegalTech','Proptech','CleanTech','Deeptech','Media & Entertainment','Other'].map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Funding Amount (e.g. $500M)</Label>
                <Input value={formData.fundingAmount} onChange={(e) => updateField('fundingAmount', e.target.value)} placeholder="$500M" className="mt-1.5 rounded-xl" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isUnicorn"
                checked={formData.isUnicorn === 'true'}
                onChange={(e) => updateField('isUnicorn', e.target.checked ? 'true' : 'false')}
                className="w-4 h-4 rounded accent-primary"
              />
              <Label htmlFor="isUnicorn" className="text-sm cursor-pointer">🦄 Mark as Indian Unicorn</Label>
            </div>
          </div>

          <div>
            <Label htmlFor="description">About / Description</Label>
            <Textarea id="description" value={formData.description} onChange={(e) => updateField('description', e.target.value)} placeholder="Brief description of the company..." className="mt-1.5 rounded-xl" rows={3} />
          </div>

          {/* Brand Color */}
          <div>
            <Label htmlFor="brandColor" className="flex items-center gap-2">
              Brand Color (fallback)
              {formData.brandColor && (<span className="w-5 h-5 rounded-full border border-border inline-block" style={{ backgroundColor: formData.brandColor }} />)}
            </Label>
            <div className="mt-1.5 flex items-center gap-3">
              <Input id="brandColor" type="color" value={formData.brandColor || '#000000'} onChange={(e) => updateField('brandColor', e.target.value)} className="w-14 h-10 p-1 rounded-xl cursor-pointer" />
              <Input type="text" value={formData.brandColor} onChange={(e) => updateField('brandColor', e.target.value)} placeholder="#FF5733" className="flex-1 rounded-xl" />
              {formData.brandColor && <Button type="button" variant="outline" size="sm" onClick={() => updateField('brandColor', '')} className="rounded-xl">Clear</Button>}
            </div>
          </div>

          {/* Card Gradient */}
          <div className="bg-muted/30 rounded-xl p-4 space-y-3 border border-border/50">
            <Label className="text-sm font-semibold">Card Overlay Gradient</Label>
            <p className="text-xs text-muted-foreground">Mix two colors with an angle for the card background overlay.</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Color 1</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input type="color" value={formData.gradientColor1 || '#000000'} onChange={(e) => updateField('gradientColor1', e.target.value)} className="w-10 h-8 p-0.5 rounded-lg cursor-pointer" />
                  <Input type="text" value={formData.gradientColor1} onChange={(e) => updateField('gradientColor1', e.target.value)} placeholder="#000000" className="flex-1 rounded-lg text-xs" />
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Color 2</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input type="color" value={formData.gradientColor2 || '#000000'} onChange={(e) => updateField('gradientColor2', e.target.value)} className="w-10 h-8 p-0.5 rounded-lg cursor-pointer" />
                  <Input type="text" value={formData.gradientColor2} onChange={(e) => updateField('gradientColor2', e.target.value)} placeholder="#333333" className="flex-1 rounded-lg text-xs" />
                </div>
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Angle ({formData.gradientAngle}°)</Label>
              <Input type="range" min="0" max="360" value={formData.gradientAngle} onChange={(e) => updateField('gradientAngle', e.target.value)} className="mt-1" />
            </div>
            {formData.gradientColor1 && formData.gradientColor2 && (
              <div className="h-8 rounded-lg border border-border" style={{ background: `linear-gradient(${formData.gradientAngle}deg, ${formData.gradientColor1}, ${formData.gradientColor2})` }} />
            )}
            {(formData.gradientColor1 || formData.gradientColor2) && (
              <Button type="button" variant="outline" size="sm" onClick={() => { updateField('gradientColor1', ''); updateField('gradientColor2', ''); }} className="rounded-lg text-xs">Clear Gradient</Button>
            )}
          </div>

          {/* Button Gradient */}
          <div className="bg-muted/30 rounded-xl p-4 space-y-3 border border-border/50">
            <Label className="text-sm font-semibold">View Button Gradient</Label>
            <p className="text-xs text-muted-foreground">Custom gradient for the "View Company" button.</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Color 1</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input type="color" value={formData.buttonGradientColor1 || '#4F46E5'} onChange={(e) => updateField('buttonGradientColor1', e.target.value)} className="w-10 h-8 p-0.5 rounded-lg cursor-pointer" />
                  <Input type="text" value={formData.buttonGradientColor1} onChange={(e) => updateField('buttonGradientColor1', e.target.value)} placeholder="#4F46E5" className="flex-1 rounded-lg text-xs" />
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Color 2</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input type="color" value={formData.buttonGradientColor2 || '#0EA5E9'} onChange={(e) => updateField('buttonGradientColor2', e.target.value)} className="w-10 h-8 p-0.5 rounded-lg cursor-pointer" />
                  <Input type="text" value={formData.buttonGradientColor2} onChange={(e) => updateField('buttonGradientColor2', e.target.value)} placeholder="#0EA5E9" className="flex-1 rounded-lg text-xs" />
                </div>
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Angle ({formData.buttonGradientAngle}°)</Label>
              <Input type="range" min="0" max="360" value={formData.buttonGradientAngle} onChange={(e) => updateField('buttonGradientAngle', e.target.value)} className="mt-1" />
            </div>
            {formData.buttonGradientColor1 && formData.buttonGradientColor2 && (
              <div className="h-8 rounded-lg border border-border" style={{ background: `linear-gradient(${formData.buttonGradientAngle}deg, ${formData.buttonGradientColor1}, ${formData.buttonGradientColor2})` }} />
            )}
            {(formData.buttonGradientColor1 || formData.buttonGradientColor2) && (
              <Button type="button" variant="outline" size="sm" onClick={() => { updateField('buttonGradientColor1', ''); updateField('buttonGradientColor2', ''); }} className="rounded-lg text-xs">Clear Button Gradient</Button>
            )}
          </div>

          <div>
            <Label htmlFor="notes">Private Notes</Label>
            <Textarea id="notes" value={formData.notes} onChange={(e) => updateField('notes', e.target.value)} placeholder="Your personal notes about this company..." className="mt-1.5 rounded-xl" rows={2} />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-xl">Cancel</Button>
            <Button type="submit" className="flex-1 btn-gradient rounded-xl">
              {company ? 'Save Changes' : 'Add Company'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
