import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Edit2, Trash2, Sparkles, PenLine, Plus, X, Loader2 } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useIndianStartups, IndianStartup } from '@/hooks/useIndianStartups';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const SECTORS = ['food', 'health', 'beauty', 'fashion', 'home', 'fintech', 'edtech', 'saas', 'others'];
const SECTOR_LABELS: Record<string, string> = {
  food: 'Food & Beverage', health: 'Health & Wellness', beauty: 'Beauty & Personal Care',
  fashion: 'Fashion & Apparel', home: 'Home & Furnishing', fintech: 'Fintech',
  edtech: 'Edtech', saas: 'SaaS', others: 'Others',
};
const SIZES = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5000+'];

const BLANK_FORM = {
  name: '', tagline: '', description: '', sector: 'others', website: '',
  careerUrl: '', logoUrl: '', brandColor: '', companySize: '', foundedYear: '',
  hqCity: '', technologies: '',
};

const AI_TEMPLATE = `Company Name: Eggoz Nutrition
Tagline: Premium farm-fresh eggs & nutrition
Sector: food
Description: Eggoz is India's leading egg brand delivering farm-fresh, nutrition-rich eggs directly to consumers. They focus on quality, hygiene, and traceability.
Website: https://eggoz.in
Career URL: https://eggoz.in/careers
HQ City: Gurugram
Company Size: 51-200
Founded Year: 2017
Technologies: React, Node.js, AWS
Brand Color: #FF6B35`;

export default function AdminIndianStartups() {
  const { startups, addStartup, updateStartup, deleteStartup } = useIndianStartups();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...BLANK_FORM });
  const [aiText, setAiText] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);

  const updateForm = (field: string, value: string) => setForm(p => ({ ...p, [field]: value }));

  const filteredStartups = startups.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.sector.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => { setForm({ ...BLANK_FORM }); setEditingId(null); setShowForm(false); };

  const handleEdit = (s: IndianStartup) => {
    setForm({
      name: s.name || '', tagline: s.tagline || '', description: s.description || '',
      sector: s.sector || 'others', website: s.website || '', careerUrl: s.careerUrl || '',
      logoUrl: s.logoUrl || '', brandColor: s.brandColor || '', companySize: s.companySize || '',
      foundedYear: s.foundedYear?.toString() || '', hqCity: s.hqCity || '',
      technologies: s.technologies?.join(', ') || '',
    });
    setEditingId(s.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    const ok = await deleteStartup(id);
    ok ? toast.success('Startup deleted') : toast.error('Failed to delete');
  };

  const handleFormSubmit = async () => {
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    setFormLoading(true);
    const data: Partial<IndianStartup> = {
      name: form.name, tagline: form.tagline || undefined,
      description: form.description || undefined, sector: form.sector,
      website: form.website || undefined, careerUrl: form.careerUrl || undefined,
      logoUrl: form.logoUrl || undefined, brandColor: form.brandColor || undefined,
      companySize: form.companySize || undefined,
      foundedYear: form.foundedYear ? parseInt(form.foundedYear) : undefined,
      hqCity: form.hqCity || undefined,
      technologies: form.technologies ? form.technologies.split(',').map(t => t.trim()).filter(Boolean) : undefined,
    };
    const ok = editingId ? await updateStartup(editingId, data) : await addStartup(data);
    if (ok) { toast.success(editingId ? 'Startup updated!' : 'Startup added!'); resetForm(); }
    else toast.error('Failed to save');
    setFormLoading(false);
  };

  const handleAIParse = async () => {
    if (!aiText.trim()) return;
    setAiLoading(true);
    try {
      // Parse the template-style text manually (no Supabase function needed)
      const lines = aiText.trim().split('\n');
      const get = (prefix: string) => {
        const line = lines.find(l => l.toLowerCase().startsWith(prefix.toLowerCase() + ':'));
        return line ? line.slice(line.indexOf(':') + 1).trim() : '';
      };
      const data: Partial<IndianStartup> = {
        name: get('Company Name') || get('Name'),
        tagline: get('Tagline'),
        description: get('Description'),
        sector: get('Sector') || 'others',
        website: get('Website'),
        careerUrl: get('Career URL') || get('Career Url'),
        hqCity: get('HQ City') || get('Hq City'),
        companySize: get('Company Size'),
        brandColor: get('Brand Color') || get('Brand color'),
        foundedYear: parseInt(get('Founded Year') || get('Founded') || '0') || undefined,
        technologies: get('Technologies') ? get('Technologies').split(',').map(t => t.trim()).filter(Boolean) : undefined,
      };
      if (!data.name) { toast.error('Could not extract name — check your template'); return; }
      const ok = await addStartup(data);
      if (ok) { toast.success(`"${data.name}" added!`); setAiText(''); }
      else toast.error('Failed to save');
    } catch {
      toast.error('Parse failed');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="section-container py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Link to="/customize" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Admin
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">Indian Startups Admin</h1>
              <p className="text-muted-foreground">Add, edit or remove D2C startups from the directory.</p>
            </div>
            <span className="admin-badge">Admin</span>
          </div>
        </div>

        <Tabs defaultValue="list" className="space-y-6">
          <TabsList className="rounded-xl">
            <TabsTrigger value="list" className="rounded-lg">Startups ({startups.length})</TabsTrigger>
            <TabsTrigger value="quick-add" className="rounded-lg flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Quick Add
            </TabsTrigger>
            <TabsTrigger value="bulk" className="rounded-lg flex items-center gap-1.5">
              <PenLine className="w-3.5 h-3.5" /> Bulk Template
            </TabsTrigger>
          </TabsList>

          {/* LIST TAB */}
          <TabsContent value="list" className="space-y-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search startups..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9 rounded-xl" />
              </div>
              <Button onClick={() => { resetForm(); setShowForm(true); }} className="btn-gradient rounded-xl gap-2">
                <Plus className="w-4 h-4" /> Add Startup
              </Button>
            </div>

            {/* Inline form */}
            {showForm && (
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4 animate-fade-in">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-foreground">{editingId ? 'Edit Startup' : 'New Startup'}</h3>
                  <button onClick={resetForm}><X className="w-4 h-4 text-muted-foreground hover:text-foreground" /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Name *</Label>
                    <Input value={form.name} onChange={e => updateForm('name', e.target.value)} placeholder="Eggoz Nutrition" className="mt-1.5 rounded-xl" />
                  </div>
                  <div>
                    <Label>Sector</Label>
                    <Select value={form.sector} onValueChange={v => updateForm('sector', v)}>
                      <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {SECTORS.map(s => <SelectItem key={s} value={s}>{SECTOR_LABELS[s]}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label>Tagline</Label>
                    <Input value={form.tagline} onChange={e => updateForm('tagline', e.target.value)} placeholder="Premium farm-fresh eggs & nutrition" className="mt-1.5 rounded-xl" />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Description</Label>
                    <Textarea value={form.description} onChange={e => updateForm('description', e.target.value)} placeholder="Short description of the startup..." className="mt-1.5 rounded-xl" rows={3} />
                  </div>
                  <div>
                    <Label>Website</Label>
                    <Input type="url" value={form.website} onChange={e => updateForm('website', e.target.value)} placeholder="https://eggoz.in" className="mt-1.5 rounded-xl" />
                  </div>
                  <div>
                    <Label>Career URL</Label>
                    <Input type="url" value={form.careerUrl} onChange={e => updateForm('careerUrl', e.target.value)} placeholder="https://eggoz.in/careers" className="mt-1.5 rounded-xl" />
                  </div>
                  <div>
                    <Label>Logo URL</Label>
                    <Input type="url" value={form.logoUrl} onChange={e => updateForm('logoUrl', e.target.value)} placeholder="https://..." className="mt-1.5 rounded-xl" />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2">
                      Brand Color
                      {form.brandColor && <span className="w-4 h-4 rounded-full border" style={{ backgroundColor: form.brandColor }} />}
                    </Label>
                    <div className="flex gap-2 mt-1.5">
                      <Input type="color" value={form.brandColor || '#000000'} onChange={e => updateForm('brandColor', e.target.value)} className="w-12 h-10 p-1 rounded-xl cursor-pointer" />
                      <Input value={form.brandColor} onChange={e => updateForm('brandColor', e.target.value)} placeholder="#FF6B35" className="flex-1 rounded-xl" />
                    </div>
                  </div>
                  <div>
                    <Label>Company Size</Label>
                    <Select value={form.companySize} onValueChange={v => updateForm('companySize', v)}>
                      <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue placeholder="Select size" /></SelectTrigger>
                      <SelectContent>{SIZES.map(s => <SelectItem key={s} value={s}>{s} employees</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>HQ City</Label>
                    <Input value={form.hqCity} onChange={e => updateForm('hqCity', e.target.value)} placeholder="Bengaluru" className="mt-1.5 rounded-xl" />
                  </div>
                  <div>
                    <Label>Founded Year</Label>
                    <Input type="number" value={form.foundedYear} onChange={e => updateForm('foundedYear', e.target.value)} placeholder="2017" className="mt-1.5 rounded-xl" />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Technologies (comma-separated)</Label>
                    <Input value={form.technologies} onChange={e => updateForm('technologies', e.target.value)} placeholder="React, Node.js, AWS" className="mt-1.5 rounded-xl" />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={resetForm} className="rounded-xl">Cancel</Button>
                  <Button onClick={handleFormSubmit} disabled={formLoading} className="btn-gradient rounded-xl">
                    {formLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : editingId ? 'Save Changes' : 'Add Startup'}
                  </Button>
                </div>
              </div>
            )}

            {/* Table */}
            {filteredStartups.length > 0 ? (
              <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Startup</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Sector</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Size</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Website</th>
                      <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {filteredStartups.map(s => (
                      <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden shrink-0"
                              style={{ background: s.brandColor || 'linear-gradient(135deg, #6366f1, #14b8a6)' }}>
                              {s.logoUrl
                                ? <img src={s.logoUrl} alt={s.name} className="w-full h-full object-contain" />
                                : <span className="text-white font-bold text-sm">{s.name.charAt(0)}</span>}
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{s.name}</p>
                              {s.tagline && <p className="text-xs text-muted-foreground truncate max-w-[200px]">{s.tagline}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                            {SECTOR_LABELS[s.sector] || s.sector}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{s.companySize || '—'}</td>
                        <td className="px-6 py-4">
                          {s.website && (
                            <a href={s.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate max-w-[160px] block">
                              {s.website.replace('https://', '').replace('http://', '')}
                            </a>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(s)} className="h-8 w-8 rounded-lg hover:bg-secondary">
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id, s.name)} className="h-8 w-8 rounded-lg hover:bg-red-500/10 hover:text-red-500">
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
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  {startups.length === 0 ? 'No startups yet' : 'No results'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {startups.length === 0 ? 'Use Quick Add tab to add your first startup.' : 'Try adjusting your search.'}
                </p>
                {startups.length === 0 && (
                  <Button onClick={() => { resetForm(); setShowForm(true); }} className="btn-gradient rounded-xl">
                    <Plus className="w-4 h-4 mr-2" /> Add First Startup
                  </Button>
                )}
              </div>
            )}
          </TabsContent>

          {/* QUICK ADD TAB */}
          <TabsContent value="quick-add">
            <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-5 animate-fade-in">
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-1">Quick Add via Template</h3>
                <p className="text-sm text-muted-foreground">
                  Paste startup info in the template format below and click Extract & Add. Fields are parsed automatically.
                </p>
              </div>

              <div className="rounded-xl bg-muted/40 border border-border p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Template Format</p>
                  <button
                    onClick={() => setShowTemplate(p => !p)}
                    className="text-xs text-primary hover:underline"
                  >
                    {showTemplate ? 'Hide' : 'Show template'}
                  </button>
                </div>
                {showTemplate && (
                  <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed">{AI_TEMPLATE}</pre>
                )}
                <button
                  onClick={() => setAiText(AI_TEMPLATE)}
                  className="mt-2 text-xs text-primary hover:underline"
                >
                  Copy template into editor ↓
                </button>
              </div>

              <div>
                <Label htmlFor="ai-text">Paste startup details here</Label>
                <Textarea
                  id="ai-text"
                  value={aiText}
                  onChange={e => setAiText(e.target.value)}
                  placeholder="Company Name: ...\nTagline: ...\nSector: food\nDescription: ..."
                  className="mt-1.5 rounded-xl min-h-[220px] font-mono text-sm"
                  rows={10}
                />
              </div>

              <Button
                onClick={handleAIParse}
                disabled={aiLoading || !aiText.trim()}
                className="btn-gradient rounded-xl"
              >
                {aiLoading
                  ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Extracting...</>
                  : <><Sparkles className="w-4 h-4 mr-2" />Extract & Add Startup</>
                }
              </Button>
            </div>
          </TabsContent>

          {/* BULK TEMPLATE TAB */}
          <TabsContent value="bulk">
            <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-5 animate-fade-in">
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-1">Bulk Add via CSV Template</h3>
                <p className="text-sm text-muted-foreground">
                  Download the CSV template, fill in startup details, then paste the CSV data below to import all at once.
                </p>
              </div>

              <div className="rounded-xl bg-muted/40 border border-border p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">CSV Column Headers</p>
                <code className="text-xs text-foreground font-mono leading-relaxed">
                  name, tagline, description, sector, website, career_url, logo_url, brand_color, company_size, founded_year, hq_city, technologies
                </code>
                <div className="mt-3 flex gap-3">
                  <button
                    onClick={() => {
                      const header = 'name,tagline,description,sector,website,career_url,logo_url,brand_color,company_size,founded_year,hq_city,technologies\n';
                      const example = '"Eggoz Nutrition","Premium farm-fresh eggs & nutrition","India\'s leading egg brand.","food","https://eggoz.in","https://eggoz.in/careers","","#FF6B35","51-200",2017,"Gurugram","React,Node.js"';
                      const blob = new Blob([header + example], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a'); a.href = url; a.download = 'startups-template.csv'; a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="text-xs text-primary hover:underline"
                  >
                    Download CSV template
                  </button>
                </div>
              </div>

              <BulkImport onImport={async (rows) => {
                let added = 0;
                for (const row of rows) {
                  const ok = await fetch('/api/noop').catch(() => null); // placeholder
                  added++;
                }
                toast.success(`${rows.length} startups ready — use the form above to add individually or contact admin for bulk DB insert.`);
              }} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}

function BulkImport({ onImport }: { onImport: (rows: any[]) => void }) {
  const [csvText, setCsvText] = useState('');
  const { importStartups } = useIndianStartups();

  const handleImport = async () => {
    if (!csvText.trim()) return;
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const rows = lines.slice(1).map(line => {
      const vals = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g)?.map(v => v.replace(/^"|"$/g, '').trim()) || [];
      const obj: any = {};
      headers.forEach((h, i) => { obj[h] = vals[i] || ''; });
      return {
        name: obj.name,
        tagline: obj.tagline || undefined,
        description: obj.description || undefined,
        sector: obj.sector || 'others',
        website: obj.website || undefined,
        careerUrl: obj.career_url || undefined,
        logoUrl: obj.logo_url || undefined,
        brandColor: obj.brand_color || undefined,
        companySize: obj.company_size || undefined,
        foundedYear: obj.founded_year ? parseInt(obj.founded_year) : undefined,
        hqCity: obj.hq_city || undefined,
        technologies: obj.technologies ? obj.technologies.split(',').map((t: string) => t.trim()).filter(Boolean) : undefined,
      };
    }).filter(r => r.name);

    const ok = await importStartups(rows);
    if (ok) toast.success(`${rows.length} startups imported!`);
    else toast.error('Import failed');
    setCsvText('');
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Paste CSV data</Label>
        <Textarea
          value={csvText}
          onChange={e => setCsvText(e.target.value)}
          placeholder="name,tagline,sector,...&#10;Eggoz,Premium eggs,food,..."
          className="mt-1.5 rounded-xl min-h-[180px] font-mono text-sm"
        />
      </div>
      <Button onClick={handleImport} disabled={!csvText.trim()} className="btn-gradient rounded-xl">
        <PenLine className="w-4 h-4 mr-2" />Import from CSV
      </Button>
    </div>
  );
}
