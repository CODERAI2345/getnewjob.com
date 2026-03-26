import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Search, Edit2, Trash2, Sparkles, PenLine,
  Plus, X, Loader2, Download,
} from 'lucide-react';
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

const SECTORS = ['food', 'health', 'beauty', 'fashion', 'home', 'fintech', 'edtech', 'saas', 'others'];
const SECTOR_LABELS: Record<string, string> = {
  food: 'Food & Beverage', health: 'Health & Wellness', beauty: 'Beauty & Personal Care',
  fashion: 'Fashion & Apparel', home: 'Home & Furnishing', fintech: 'Fintech',
  edtech: 'Edtech', saas: 'SaaS', others: 'Others',
};
const SIZES = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5000+'];

const BLANK_FORM = {
  name: '', tagline: '', description: '', sector: 'others', website: '',
  careerUrl: '', linkedinUrl: '', logoUrl: '', brandColor: '', companySize: '',
  foundedYear: '', hqCity: '', technologies: '', rolesHiring: '',
};

const BLANK_MANUAL = { ...BLANK_FORM };

const CSV_TEMPLATE =
  'name,tagline,description,sector,website,career_url,logo_url,brand_color,company_size,founded_year,hq_city,technologies,roles_hiring\n' +
  '"Eggoz Nutrition","Premium farm-fresh eggs & nutrition","India\'s leading egg brand.","food","https://eggoz.in","https://eggoz.in/careers","","#FF6B35","51-200",2017,"Gurugram","React,Node.js","Software Engineer,Data Analyst"';

function mapIndustryToSector(industry?: string): string {
  if (!industry) return 'others';
  const i = industry.toLowerCase();
  if (i.includes('food') || i.includes('beverage') || i.includes('restaurant')) return 'food';
  if (i.includes('health') || i.includes('wellness') || i.includes('pharma') || i.includes('medical')) return 'health';
  if (i.includes('beauty') || i.includes('cosmetic') || i.includes('personal care')) return 'beauty';
  if (i.includes('fashion') || i.includes('apparel') || i.includes('clothing') || i.includes('footwear')) return 'fashion';
  if (i.includes('home') || i.includes('furnish') || i.includes('decor')) return 'home';
  if (i.includes('fintech') || i.includes('finance') || i.includes('payment') || i.includes('banking')) return 'fintech';
  if (i.includes('edtech') || i.includes('education') || i.includes('learning')) return 'edtech';
  if (i.includes('saas') || i.includes('software') || i.includes('cloud') || i.includes('tech')) return 'saas';
  return 'others';
}

function PreviewRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground truncate">{value}</p>
    </div>
  );
}

function ManualEntryForm({ onSave }: { onSave: (data: Partial<IndianStartup>) => Promise<boolean> }) {
  const [form, setForm] = useState({ ...BLANK_MANUAL });
  const [loading, setLoading] = useState(false);
  const update = (f: string, v: string) => setForm(p => ({ ...p, [f]: v }));

  const handleSubmit = async () => {
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    setLoading(true);
    const ok = await onSave({
      name: form.name, tagline: form.tagline || undefined,
      description: form.description || undefined, sector: form.sector,
      website: form.website || undefined, careerUrl: form.careerUrl || undefined,
      linkedinUrl: form.linkedinUrl || undefined, logoUrl: form.logoUrl || undefined,
      brandColor: form.brandColor || undefined, companySize: form.companySize || undefined,
      foundedYear: form.foundedYear ? parseInt(form.foundedYear) : undefined,
      hqCity: form.hqCity || undefined,
      technologies: form.technologies ? form.technologies.split(',').map(t => t.trim()).filter(Boolean) : undefined,
      rolesHiring: form.rolesHiring ? form.rolesHiring.split(',').map(t => t.trim()).filter(Boolean) : undefined,
    });
    if (ok) { toast.success(`"${form.name}" added!`); setForm({ ...BLANK_MANUAL }); }
    else toast.error('Failed to save');
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><Label>Name *</Label><Input value={form.name} onChange={e => update('name', e.target.value)} placeholder="Eggoz Nutrition" className="mt-1.5 rounded-xl" /></div>
        <div>
          <Label>Sector</Label>
          <Select value={form.sector} onValueChange={v => update('sector', v)}>
            <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>{SECTORS.map(s => <SelectItem key={s} value={s}>{SECTOR_LABELS[s]}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2"><Label>Tagline</Label><Input value={form.tagline} onChange={e => update('tagline', e.target.value)} placeholder="Short one-liner" className="mt-1.5 rounded-xl" /></div>
        <div className="md:col-span-2"><Label>Description</Label><Textarea value={form.description} onChange={e => update('description', e.target.value)} placeholder="Company description..." className="mt-1.5 rounded-xl" rows={3} /></div>
        <div><Label>Website</Label><Input type="url" value={form.website} onChange={e => update('website', e.target.value)} placeholder="https://..." className="mt-1.5 rounded-xl" /></div>
        <div><Label>Career URL</Label><Input type="url" value={form.careerUrl} onChange={e => update('careerUrl', e.target.value)} placeholder="https://.../careers" className="mt-1.5 rounded-xl" /></div>
        <div><Label>HQ City</Label><Input value={form.hqCity} onChange={e => update('hqCity', e.target.value)} placeholder="Bengaluru" className="mt-1.5 rounded-xl" /></div>
        <div>
          <Label>Company Size</Label>
          <Select value={form.companySize} onValueChange={v => update('companySize', v)}>
            <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue placeholder="Select size" /></SelectTrigger>
            <SelectContent>{SIZES.map(s => <SelectItem key={s} value={s}>{s} employees</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2"><Label>Roles Actively Hiring (comma-separated)</Label><Input value={form.rolesHiring} onChange={e => update('rolesHiring', e.target.value)} placeholder="Software Engineer, Product Manager, Data Analyst" className="mt-1.5 rounded-xl" /></div>
        <div className="md:col-span-2"><Label>Technologies (comma-separated)</Label><Input value={form.technologies} onChange={e => update('technologies', e.target.value)} placeholder="React, Node.js, AWS" className="mt-1.5 rounded-xl" /></div>
      </div>
      <Button onClick={handleSubmit} disabled={loading} className="btn-gradient rounded-xl">
        {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Adding...</> : <><PenLine className="w-4 h-4 mr-2" />Add Startup</>}
      </Button>
    </div>
  );
}

export default function AdminIndianStartups() {
  const { startups, addStartup, updateStartup, deleteStartup, importStartups } = useIndianStartups();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...BLANK_FORM });
  const [formLoading, setFormLoading] = useState(false);

  // AI Fetch state
  const [aiText, setAiText] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiParsed, setAiParsed] = useState<Partial<IndianStartup> | null>(null);

  // Bulk CSV state
  const [csvText, setCsvText] = useState('');
  const [csvLoading, setCsvLoading] = useState(false);

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
      linkedinUrl: s.linkedinUrl || '', logoUrl: s.logoUrl || '', brandColor: s.brandColor || '',
      companySize: s.companySize || '', foundedYear: s.foundedYear?.toString() || '',
      hqCity: s.hqCity || '', technologies: s.technologies?.join(', ') || '',
      rolesHiring: s.rolesHiring?.join(', ') || '',
    });
    setEditingId(s.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const ok = await deleteStartup(id);
    ok ? toast.success('Startup deleted') : toast.error('Failed to delete');
  };

  const handleFormSubmit = async () => {
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    setFormLoading(true);
    const data: Partial<IndianStartup> = {
      name: form.name,
      tagline: form.tagline || undefined,
      description: form.description || undefined,
      sector: form.sector,
      website: form.website || undefined,
      careerUrl: form.careerUrl || undefined,
      linkedinUrl: form.linkedinUrl || undefined,
      logoUrl: form.logoUrl || undefined,
      brandColor: form.brandColor || undefined,
      companySize: form.companySize || undefined,
      foundedYear: form.foundedYear ? parseInt(form.foundedYear) : undefined,
      hqCity: form.hqCity || undefined,
      technologies: form.technologies ? form.technologies.split(',').map(t => t.trim()).filter(Boolean) : undefined,
      rolesHiring: form.rolesHiring ? form.rolesHiring.split(',').map(t => t.trim()).filter(Boolean) : undefined,
    };
    const ok = editingId ? await updateStartup(editingId, data) : await addStartup(data);
    if (ok) { toast.success(editingId ? 'Startup updated!' : 'Startup added!'); resetForm(); }
    else toast.error('Failed to save');
    setFormLoading(false);
  };

  // ── Real AI Fetch using same supabase function as companies ──────────────
  const handleAIFetch = async () => {
    if (!aiText.trim()) return;
    setAiLoading(true);
    setAiParsed(null);
    try {
      const { data, error } = await supabase.functions.invoke('parse-company', {
        body: { text: aiText.trim() },
      });
      if (error) throw error;
      if (!data || !data.name) {
        toast.error('Could not extract company name. Try adding more details.');
        return;
      }
      const parsed: Partial<IndianStartup> = {
        name: data.name,
        description: data.description || undefined,
        website: data.website || undefined,
        careerUrl: data.careerUrl || undefined,
        linkedinUrl: data.linkedinUrl || undefined,
        foundedYear: data.foundedYear || undefined,
        hqCity: data.hqCity || undefined,
        companySize: data.companySize || undefined,
        technologies: data.technologies || undefined,
        tagline: data.notableProducts ? `Known for: ${data.notableProducts}` : undefined,
        rolesHiring: data.hiringTechnologies
          ? data.hiringTechnologies.split(',').map((t: string) => t.trim()).filter(Boolean)
          : undefined,
        sector: mapIndustryToSector(data.industry),
      };
      setAiParsed(parsed);
      toast.success(`"${data.name}" extracted — review and confirm below.`);
    } catch (err: any) {
      console.error('AI parse error:', err);
      toast.error('AI extraction failed. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleConfirmAI = async () => {
    if (!aiParsed) return;
    setAiLoading(true);
    const ok = await addStartup(aiParsed);
    if (ok) {
      toast.success(`"${aiParsed.name}" added to Indian Startups!`);
      setAiText('');
      setAiParsed(null);
    } else {
      toast.error('Failed to save startup');
    }
    setAiLoading(false);
  };

  // ── Bulk CSV ──────────────────────────────────────────────────────────────
  const handleCSVImport = async () => {
    if (!csvText.trim()) return;
    setCsvLoading(true);
    try {
      const lines = csvText.trim().split('\n');
      const rawHeaders = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
      const rows = lines.slice(1).map(line => {
        const vals: string[] = [];
        let inQuote = false, cur = '';
        for (let i = 0; i < line.length; i++) {
          if (line[i] === '"') { inQuote = !inQuote; }
          else if (line[i] === ',' && !inQuote) { vals.push(cur.trim()); cur = ''; }
          else { cur += line[i]; }
        }
        vals.push(cur.trim());
        const obj: any = {};
        rawHeaders.forEach((h, i) => { obj[h] = vals[i]?.replace(/^"|"$/g, '') || ''; });
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
          rolesHiring: obj.roles_hiring ? obj.roles_hiring.split(',').map((t: string) => t.trim()).filter(Boolean) : undefined,
        } as Partial<IndianStartup>;
      }).filter(r => r.name);

      const ok = await importStartups(rows);
      if (ok) { toast.success(`${rows.length} startups imported!`); setCsvText(''); }
      else toast.error('Import failed');
    } catch {
      toast.error('Failed to parse CSV');
    } finally {
      setCsvLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="section-container py-8">
        <div className="mb-8 animate-fade-in">
          <Link to="/customize" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Admin
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">Indian Startups Admin</h1>
              <p className="text-muted-foreground">Add, edit or remove D2C startups. Use AI Fetch to auto-extract details.</p>
            </div>
            <span className="admin-badge">Admin</span>
          </div>
        </div>

        <Tabs defaultValue="startups" className="space-y-6">
          <TabsList className="rounded-xl">
            <TabsTrigger value="startups" className="rounded-lg">Startups ({startups.length})</TabsTrigger>
            <TabsTrigger value="quick-add" className="rounded-lg flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Quick Add
            </TabsTrigger>
            <TabsTrigger value="bulk" className="rounded-lg flex items-center gap-1.5">
              <PenLine className="w-3.5 h-3.5" /> Bulk CSV
            </TabsTrigger>
          </TabsList>

          {/* ── LIST TAB ──────────────────────────────────────────────── */}
          <TabsContent value="startups" className="space-y-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search startups..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9 rounded-xl" />
              </div>
              <Button onClick={() => { resetForm(); setShowForm(true); }} className="btn-gradient rounded-xl gap-2">
                <Plus className="w-4 h-4" /> Add Startup
              </Button>
            </div>

            {showForm && (
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4 animate-fade-in">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-foreground text-lg">{editingId ? 'Edit Startup' : 'New Startup'}</h3>
                  <button onClick={resetForm} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label>Name *</Label><Input value={form.name} onChange={e => updateForm('name', e.target.value)} placeholder="Eggoz Nutrition" className="mt-1.5 rounded-xl" /></div>
                  <div>
                    <Label>Sector</Label>
                    <Select value={form.sector} onValueChange={v => updateForm('sector', v)}>
                      <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>{SECTORS.map(s => <SelectItem key={s} value={s}>{SECTOR_LABELS[s]}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2"><Label>Tagline</Label><Input value={form.tagline} onChange={e => updateForm('tagline', e.target.value)} placeholder="Premium farm-fresh eggs & nutrition" className="mt-1.5 rounded-xl" /></div>
                  <div className="md:col-span-2"><Label>Description</Label><Textarea value={form.description} onChange={e => updateForm('description', e.target.value)} placeholder="Short company description..." className="mt-1.5 rounded-xl" rows={3} /></div>
                  <div><Label>Website</Label><Input type="url" value={form.website} onChange={e => updateForm('website', e.target.value)} placeholder="https://eggoz.in" className="mt-1.5 rounded-xl" /></div>
                  <div><Label>Career URL</Label><Input type="url" value={form.careerUrl} onChange={e => updateForm('careerUrl', e.target.value)} placeholder="https://eggoz.in/careers" className="mt-1.5 rounded-xl" /></div>
                  <div><Label>LinkedIn URL</Label><Input type="url" value={form.linkedinUrl} onChange={e => updateForm('linkedinUrl', e.target.value)} placeholder="https://linkedin.com/company/eggoz" className="mt-1.5 rounded-xl" /></div>
                  <div><Label>Logo URL</Label><Input type="url" value={form.logoUrl} onChange={e => updateForm('logoUrl', e.target.value)} placeholder="https://..." className="mt-1.5 rounded-xl" /></div>
                  <div>
                    <Label className="flex items-center gap-2">
                      Brand Color
                      {form.brandColor && <span className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: form.brandColor }} />}
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
                  <div><Label>HQ City</Label><Input value={form.hqCity} onChange={e => updateForm('hqCity', e.target.value)} placeholder="Bengaluru" className="mt-1.5 rounded-xl" /></div>
                  <div><Label>Founded Year</Label><Input type="number" value={form.foundedYear} onChange={e => updateForm('foundedYear', e.target.value)} placeholder="2017" className="mt-1.5 rounded-xl" /></div>
                  <div className="md:col-span-2"><Label>Technologies (comma-separated)</Label><Input value={form.technologies} onChange={e => updateForm('technologies', e.target.value)} placeholder="React, Node.js, AWS" className="mt-1.5 rounded-xl" /></div>
                  <div className="md:col-span-2"><Label>Roles Actively Hiring (comma-separated)</Label><Input value={form.rolesHiring} onChange={e => updateForm('rolesHiring', e.target.value)} placeholder="Software Engineer, Product Manager, Data Analyst" className="mt-1.5 rounded-xl" /></div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={resetForm} className="rounded-xl">Cancel</Button>
                  <Button onClick={handleFormSubmit} disabled={formLoading} className="btn-gradient rounded-xl">
                    {formLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : editingId ? 'Save Changes' : 'Add Startup'}
                  </Button>
                </div>
              </div>
            )}

            {filteredStartups.length > 0 ? (
              <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Startup</th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Sector</th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">City</th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Hiring</th>
                        <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {filteredStartups.map(s => (
                        <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden shrink-0"
                                style={{ background: s.brandColor || 'linear-gradient(135deg,#f97316,#ec4899)' }}>
                                {s.logoUrl
                                  ? <img src={s.logoUrl} alt={s.name} className="w-full h-full object-contain" />
                                  : <span className="text-white font-bold">{s.name.charAt(0)}</span>}
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{s.name}</p>
                                {s.tagline && <p className="text-xs text-muted-foreground truncate max-w-[180px]">{s.tagline}</p>}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                              {SECTOR_LABELS[s.sector] || s.sector}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{s.hqCity || '—'}</td>
                          <td className="px-6 py-4">
                            {s.rolesHiring && s.rolesHiring.length > 0
                              ? <span className="text-xs text-muted-foreground">{s.rolesHiring.slice(0, 2).join(', ')}{s.rolesHiring.length > 2 ? ` +${s.rolesHiring.length - 2}` : ''}</span>
                              : <span className="text-xs text-muted-foreground">—</span>}
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

          {/* ── QUICK ADD TAB ─────────────────────────────────────────── */}
          <TabsContent value="quick-add">
            <div className="bg-card rounded-2xl border border-border/50 p-6 animate-fade-in space-y-5">
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-1">Quick Add Startup</h3>
                <p className="text-sm text-muted-foreground">
