import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Search, Edit2, Trash2, Sparkles, PenLine,
  Plus, X, Loader2, Download, FileText, Check, AlertCircle,
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
  careerUrl: '', linkedinUrl: '', logoUrl: '', brandColor: '', companySize: '',
  foundedYear: '', hqCity: '', technologies: '', rolesHiring: '',
};

const CSV_TEMPLATE =
  'name,sector,website,hq_city,company_size,roles_hiring\n' +
  '"Eggoz Nutrition","food","https://eggoz.in","Gurugram","51-200","Software Engineer,Data Analyst"\n' +
  '"Zepto","food","https://zepto.com","Mumbai","1001-5000","Product Manager,SDE-2,Data Scientist"';

// ── AI lookup by company name ─────────────────────────────────────────────
async function lookupStartupByName(name: string): Promise<Partial<IndianStartup>> {
  const { data, error } = await supabase.functions.invoke('lookup-startup', {
    body: { companyName: name.trim() },
  });
  if (error) throw new Error(error.message || 'Lookup failed');
  if (!data || !data.name) throw new Error('AI could not find details for this company');

  return {
    name: data.name,
    tagline: data.tagline || undefined,
    description: data.description || undefined,
    website: data.website || undefined,
    careerUrl: data.careerUrl || undefined,
    linkedinUrl: data.linkedinUrl || undefined,
    foundedYear: data.foundedYear || undefined,
    hqCity: data.hqCity || undefined,
    companySize: data.companySize || undefined,
    technologies: Array.isArray(data.technologies) ? data.technologies : undefined,
    rolesHiring: Array.isArray(data.rolesHiring) ? data.rolesHiring : undefined,
    sector: data.sector || 'others',
    brandColor: data.brandColor || undefined,
  };
}

// ── Sub-components ────────────────────────────────────────────────────────
function PreviewRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

function ManualEntryForm({ onSave }: { onSave: (data: Partial<IndianStartup>) => Promise<boolean> }) {
  const [form, setForm] = useState({ ...BLANK_FORM });
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
    if (ok) { toast.success(`"${form.name}" added!`); setForm({ ...BLANK_FORM }); }
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
        <div className="md:col-span-2"><Label>Roles Actively Hiring (comma-separated)</Label><Input value={form.rolesHiring} onChange={e => update('rolesHiring', e.target.value)} placeholder="Software Engineer, Product Manager" className="mt-1.5 rounded-xl" /></div>
        <div className="md:col-span-2"><Label>Technologies (comma-separated)</Label><Input value={form.technologies} onChange={e => update('technologies', e.target.value)} placeholder="React, Node.js, AWS" className="mt-1.5 rounded-xl" /></div>
      </div>
      <Button onClick={handleSubmit} disabled={loading} className="btn-gradient rounded-xl">
        {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Adding...</> : <><PenLine className="w-4 h-4 mr-2" />Add Startup</>}
      </Button>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────
export default function AdminIndianStartups() {
  const { startups, addStartup, updateStartup, deleteStartup, importStartups } = useIndianStartups();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...BLANK_FORM });
  const [formLoading, setFormLoading] = useState(false);

  // Single name AI lookup
  const [singleName, setSingleName] = useState('');
  const [singleLoading, setSingleLoading] = useState(false);
  const [singlePreview, setSinglePreview] = useState<Partial<IndianStartup> | null>(null);

  // Batch AI lookup
  const [queueNames, setQueueNames] = useState('');
  const [queueLoading, setQueueLoading] = useState(false);
  const [queueResults, setQueueResults] = useState<{ name: string; status: 'pending' | 'done' | 'error'; message?: string }[]>([]);

  // Bulk names only
  const [namesText, setNamesText] = useState('');
  const [namesLoading, setNamesLoading] = useState(false);

  // CSV
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
    if (!window.confirm(`Delete "${name}"?`)) return;
    const ok = await deleteStartup(id);
    ok ? toast.success('Startup deleted') : toast.error('Failed to delete');
  };

  const handleFormSubmit = async () => {
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    setFormLoading(true);
    const data: Partial<IndianStartup> = {
      name: form.name, tagline: form.tagline || undefined, description: form.description || undefined,
      sector: form.sector, website: form.website || undefined, careerUrl: form.careerUrl || undefined,
      linkedinUrl: form.linkedinUrl || undefined, logoUrl: form.logoUrl || undefined,
      brandColor: form.brandColor || undefined, companySize: form.companySize || undefined,
      foundedYear: form.foundedYear ? parseInt(form.foundedYear) : undefined,
      hqCity: form.hqCity || undefined,
      technologies: form.technologies ? form.technologies.split(',').map(t => t.trim()).filter(Boolean) : undefined,
      rolesHiring: form.rolesHiring ? form.rolesHiring.split(',').map(t => t.trim()).filter(Boolean) : undefined,
    };
    const ok = editingId ? await updateStartup(editingId, data) : await addStartup(data);
    if (ok) { toast.success(editingId ? 'Updated!' : 'Added!'); resetForm(); }
    else toast.error('Failed to save');
    setFormLoading(false);
  };

  // ── Single lookup ────────────────────────────────────────────────────
  const handleSingleLookup = async () => {
    if (!singleName.trim()) return;
    setSingleLoading(true);
    setSinglePreview(null);
    try {
      const result = await lookupStartupByName(singleName);
      setSinglePreview(result);
    } catch (err: any) {
      toast.error(err.message || 'Lookup failed. Try again.');
    } finally {
      setSingleLoading(false);
    }
  };

  const handleSingleSave = async (captured: Partial<IndianStartup>) => {
    if (!captured?.name) return;
    setSingleLoading(true);
    const ok = await addStartup(captured);
    if (ok) { toast.success(`✓ "${captured.name}" saved!`); setSingleName(''); setSinglePreview(null); }
    else toast.error('Save failed. Try again.');
    setSingleLoading(false);
  };

  // ── Batch lookup ─────────────────────────────────────────────────────
  const handleQueueLookup = async () => {
    const names = queueNames.trim().split('\n').map(n => n.trim()).filter(Boolean);
    if (!names.length) { toast.error('Add at least one company name'); return; }
    setQueueLoading(true);
    setQueueResults(names.map(n => ({ name: n, status: 'pending' as const })));

    for (let i = 0; i < names.length; i++) {
      try {
        const result = await lookupStartupByName(names[i]);
        const ok = await addStartup(result);
        setQueueResults(prev => prev.map((r, idx) =>
          idx === i ? { ...r, status: ok ? 'done' : 'error', message: ok ? `Saved as "${result.name}"` : 'Save failed' } : r
        ));
      } catch (err: any) {
        setQueueResults(prev => prev.map((r, idx) =>
          idx === i ? { ...r, status: 'error', message: err.message || 'Lookup failed' } : r
        ));
      }
      if (i < names.length - 1) await new Promise(res => setTimeout(res, 800));
    }
    setQueueLoading(false);
    toast.success(`Batch complete — ${names.length} companies processed.`);
  };

  // ── Names only ───────────────────────────────────────────────────────
  const handleNamesImport = async () => {
    const names = namesText.trim().split('\n').map(n => n.trim()).filter(Boolean);
    if (!names.length) { toast.error('No names found'); return; }
    setNamesLoading(true);
    const ok = await importStartups(names.map(name => ({ name, sector: 'others' })));
    if (ok) { toast.success(`${names.length} stubs created — edit each to fill details.`); setNamesText(''); }
    else toast.error('Import failed');
    setNamesLoading(false);
  };

  // ── CSV import ───────────────────────────────────────────────────────
  const handleCSVImport = async () => {
    if (!csvText.trim()) return;
    setCsvLoading(true);
    try {
      const lines = csvText.trim().split('\n').filter(l => l.trim());
      if (lines.length < 2) { toast.error('Need header row + at least one data row'); setCsvLoading(false); return; }
      const rawHeaders = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase().replace(/ /g, '_'));
      const rows: Partial<IndianStartup>[] = [];

      for (let li = 1; li < lines.length; li++) {
        const line = lines[li].trim();
        if (!line) continue;
        const vals: string[] = [];
        let inQuote = false, cur = '';
        for (const ch of line) {
          if (ch === '"') inQuote = !inQuote;
          else if (ch === ',' && !inQuote) { vals.push(cur.trim().replace(/^"|"$/g, '')); cur = ''; }
          else cur += ch;
        }
        vals.push(cur.trim().replace(/^"|"$/g, ''));
        const obj: any = {};
        rawHeaders.forEach((h, i) => { obj[h] = (vals[i] || '').trim(); });
        if (!obj.name) continue;
        rows.push({
          name: obj.name, tagline: obj.tagline || undefined,
          sector: obj.sector || 'others', website: obj.website || undefined,
          careerUrl: obj.career_url || undefined, hqCity: obj.hq_city || obj.city || undefined,
          companySize: obj.company_size || undefined,
          rolesHiring: obj.roles_hiring ? obj.roles_hiring.split(',').map((t: string) => t.trim()).filter(Boolean) : undefined,
          technologies: obj.technologies ? obj.technologies.split(',').map((t: string) => t.trim()).filter(Boolean) : undefined,
        });
      }
      if (!rows.length) { toast.error('No valid rows found'); setCsvLoading(false); return; }
      const ok = await importStartups(rows);
      if (ok) { toast.success(`${rows.length} startups imported!`); setCsvText(''); }
      else toast.error('Import failed');
    } catch { toast.error('Failed to parse CSV'); }
    finally { setCsvLoading(false); }
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
              <p className="text-muted-foreground">Type a company name — AI looks up all details and saves automatically.</p>
            </div>
            <span className="admin-badge">Admin</span>
          </div>
        </div>

        <Tabs defaultValue="startups" className="space-y-6">
          <TabsList className="rounded-xl">
            <TabsTrigger value="startups" className="rounded-lg">Startups ({startups.length})</TabsTrigger>
            <TabsTrigger value="quick-add" className="rounded-lg flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> AI Add
            </TabsTrigger>
            <TabsTrigger value="bulk" className="rounded-lg flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Bulk Import
            </TabsTrigger>
          </TabsList>

          {/* ── LIST ────────────────────────────────────────────── */}
          <TabsContent value="startups" className="space-y-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search startups..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9 rounded-xl" />
              </div>
              <Button onClick={() => { resetForm(); setShowForm(true); }} className="btn-gradient rounded-xl gap-2">
                <Plus className="w-4 h-4" /> Add Manually
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
                  <div className="md:col-span-2"><Label>Tagline</Label><Input value={form.tagline} onChange={e => updateForm('tagline', e.target.value)} placeholder="Short one-liner" className="mt-1.5 rounded-xl" /></div>
                  <div className="md:col-span-2"><Label>Description</Label><Textarea value={form.description} onChange={e => updateForm('description', e.target.value)} placeholder="Company description..." className="mt-1.5 rounded-xl" rows={3} /></div>
                  <div><Label>Website</Label><Input type="url" value={form.website} onChange={e => updateForm('website', e.target.value)} placeholder="https://..." className="mt-1.5 rounded-xl" /></div>
                  <div><Label>Career URL</Label><Input type="url" value={form.careerUrl} onChange={e => updateForm('careerUrl', e.target.value)} placeholder="https://.../careers" className="mt-1.5 rounded-xl" /></div>
                  <div><Label>LinkedIn URL</Label><Input type="url" value={form.linkedinUrl} onChange={e => updateForm('linkedinUrl', e.target.value)} placeholder="https://linkedin.com/company/..." className="mt-1.5 rounded-xl" /></div>
                  <div><Label>Logo URL</Label><Input type="url" value={form.logoUrl} onChange={e => updateForm('logoUrl', e.target.value)} placeholder="https://..." className="mt-1.5 rounded-xl" /></div>
                  <div>
                    <Label className="flex items-center gap-2">Brand Color {form.brandColor && <span className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: form.brandColor }} />}</Label>
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
                  <div className="md:col-span-2"><Label>Roles Actively Hiring (comma-separated)</Label><Input value={form.rolesHiring} onChange={e => updateForm('rolesHiring', e.target.value)} placeholder="Software Engineer, Product Manager" className="mt-1.5 rounded-xl" /></div>
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
                                {s.logoUrl ? <img src={s.logoUrl} alt={s.name} className="w-full h-full object-contain" /> : <span className="text-white font-bold">{s.name.charAt(0)}</span>}
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
                          <td className="px-6 py-4 text-sm text-muted-foreground">{s.hqCity || '—'}</td>
                          <td className="px-6 py-4">
                            {s.rolesHiring?.length
                              ? <span className="text-xs text-muted-foreground">{s.rolesHiring.slice(0, 2).join(', ')}{s.rolesHiring.length > 2 ? ` +${s.rolesHiring.length - 2}` : ''}</span>
                              : <span className="text-xs text-muted-foreground">—</span>}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" onClick={() => handleEdit(s)} className="h-8 w-8 rounded-lg hover:bg-secondary"><Edit2 className="w-4 h-4" /></Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id, s.name)} className="h-8 w-8 rounded-lg hover:bg-red-500/10 hover:text-red-500"><Trash2 className="w-4 h-4" /></Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4"><Search className="w-8 h-8 text-muted-foreground" /></div>
                <h3 className="font-semibold text-lg text-foreground mb-2">{startups.length === 0 ? 'No startups yet' : 'No results'}</h3>
                <p className="text-muted-foreground mb-4">{startups.length === 0 ? 'Use AI Add tab to get started.' : 'Try adjusting your search.'}</p>
              </div>
            )}
          </TabsContent>

          {/* ── AI ADD ──────────────────────────────────────────── */}
          <TabsContent value="quick-add">
            <div className="bg-card rounded-2xl border border-border/50 p-6 animate-fade-in space-y-5">
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-1">AI Add Startup</h3>
                <p className="text-sm text-muted-foreground">Type just the startup name — AI looks up all details from its knowledge base.</p>
              </div>

              <Tabs defaultValue="single" className="space-y-5">
                <TabsList className="rounded-xl">
                  <TabsTrigger value="single" className="rounded-lg flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" />Single</TabsTrigger>
                  <TabsTrigger value="batch" className="rounded-lg flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" />Batch</TabsTrigger>
                  <TabsTrigger value="manual" className="rounded-lg flex items-center gap-1.5"><PenLine className="w-3.5 h-3.5" />Manual</TabsTrigger>
                </TabsList>

                {/* SINGLE */}
                <TabsContent value="single" className="space-y-4">
                  <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
                    <p className="text-sm font-medium text-foreground mb-1">✨ How it works</p>
                    <p className="text-sm text-muted-foreground">Type a startup name → AI looks up its description, city, sector, hiring roles, tech stack → Preview → Save. Works for all known Indian startups.</p>
                  </div>

                  <div>
                    <Label htmlFor="single-name">Startup Name</Label>
                    <div className="flex gap-2 mt-1.5">
                      <Input
                        id="single-name"
                        value={singleName}
                        onChange={e => { setSingleName(e.target.value); setSinglePreview(null); }}
                        onKeyDown={e => { if (e.key === 'Enter' && singleName.trim() && !singleLoading) handleSingleLookup(); }}
                        placeholder="e.g.  Zepto  •  Mamaearth  •  Toothsi  •  CRED  •  Razorpay"
                        className="flex-1 rounded-xl text-base"
                        disabled={singleLoading}
                      />
                      <Button onClick={handleSingleLookup} disabled={singleLoading || !singleName.trim()} className="btn-gradient rounded-xl px-5 shrink-0">
                        {singleLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Looking up...</> : <><Sparkles className="w-4 h-4 mr-2" />Look Up</>}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">Press Enter or click Look Up</p>
                  </div>

                  {singlePreview && (
                    <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 space-y-4 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-primary">✓ Found — review and save</p>
                        <button onClick={() => setSinglePreview(null)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <PreviewRow label="Name" value={singlePreview.name} />
                        <PreviewRow label="Sector" value={SECTOR_LABELS[singlePreview.sector || 'others'] || singlePreview.sector} />
                        <PreviewRow label="City" value={singlePreview.hqCity} />
                        <PreviewRow label="Size" value={singlePreview.companySize} />
                        <PreviewRow label="Founded" value={singlePreview.foundedYear?.toString()} />
                        <PreviewRow label="Website" value={singlePreview.website} />
                        <div className="col-span-2"><PreviewRow label="Description" value={singlePreview.description} /></div>
                        {singlePreview.rolesHiring && singlePreview.rolesHiring.length > 0 && (
                          <div className="col-span-2">
                            <p className="text-xs text-muted-foreground mb-1.5">Actively Hiring</p>
                            <div className="flex flex-wrap gap-1.5">
                              {singlePreview.rolesHiring.map((r, i) => <span key={i} className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">{r}</span>)}
                            </div>
                          </div>
                        )}
                        {singlePreview.technologies && singlePreview.technologies.length > 0 && (
                          <div className="col-span-2">
                            <p className="text-xs text-muted-foreground mb-1.5">Tech Stack</p>
                            <div className="flex flex-wrap gap-1.5">
                              {singlePreview.technologies.map((t, i) => <span key={i} className="px-2.5 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">{t}</span>)}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-3 pt-2">
                        <Button variant="outline" onClick={() => setSinglePreview(null)} className="rounded-xl">Dismiss</Button>
                        <Button
                          onClick={() => { const c = { ...singlePreview }; setSinglePreview(null); handleSingleSave(c); }}
                          disabled={singleLoading}
                          className="btn-gradient rounded-xl"
                        >
                          {singleLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : '✓ Save to Directory'}
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>

                {/* BATCH */}
                <TabsContent value="batch" className="space-y-4">
                  <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4">
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-1">⚡ Batch AI Lookup</p>
                    <p className="text-sm text-amber-700 dark:text-amber-400">One company name per line. AI looks up each and saves automatically. Good for 5–20 startups at once.</p>
                  </div>
                  <div>
                    <Label>Company names — one per line</Label>
                    <Textarea
                      value={queueNames}
                      onChange={e => { setQueueNames(e.target.value); setQueueResults([]); }}
                      placeholder={"Zepto\nMamaearth\nToothsi\nNykaa\nboat\nMeesho"}
                      className="mt-1.5 rounded-xl min-h-[160px] font-mono text-sm"
                      disabled={queueLoading}
                    />
                    {queueNames.trim() && (
                      <p className="text-xs text-muted-foreground mt-1.5">
                        {queueNames.trim().split('\n').filter(n => n.trim()).length} companies queued
                      </p>
                    )}
                  </div>
                  <Button onClick={handleQueueLookup} disabled={queueLoading || !queueNames.trim()} className="btn-gradient rounded-xl">
                    {queueLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</> : <><Sparkles className="w-4 h-4 mr-2" />Look Up & Save All</>}
                  </Button>

                  {queueResults.length > 0 && (
                    <div className="rounded-xl border border-border bg-muted/30 overflow-hidden">
                      <div className="px-4 py-3 border-b border-border bg-muted/50">
                        <p className="text-sm font-medium text-foreground">
                          Progress — {queueResults.filter(r => r.status === 'done').length} / {queueResults.length} saved
                        </p>
                      </div>
                      <div className="divide-y divide-border/50 max-h-64 overflow-y-auto">
                        {queueResults.map((r, i) => (
                          <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                            <div className="shrink-0">
                              {r.status === 'pending' && <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />}
                              {r.status === 'done' && <Check className="w-4 h-4 text-green-500" />}
                              {r.status === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground">{r.name}</p>
                              {r.message && <p className="text-xs text-muted-foreground">{r.message}</p>}
                            </div>
                            <span className={cn(
                              'text-xs px-2 py-0.5 rounded-full font-medium shrink-0',
                              r.status === 'done' ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' :
                              r.status === 'error' ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300' :
                              'bg-muted text-muted-foreground'
                            )}>
                              {r.status === 'done' ? 'Saved' : r.status === 'error' ? 'Failed' : 'Processing'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="manual">
                  <ManualEntryForm onSave={addStartup} />
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>

          {/* ── BULK IMPORT ─────────────────────────────────────── */}
          <TabsContent value="bulk">
            <div className="bg-card rounded-2xl border border-border/50 p-6 animate-fade-in space-y-6">
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-1">Bulk Import</h3>
                <p className="text-sm text-muted-foreground">Add many startups at once — names only (quick) or full CSV (detailed).</p>
              </div>

              <Tabs defaultValue="names" className="space-y-5">
                <TabsList className="rounded-xl">
                  <TabsTrigger value="names" className="rounded-lg">📋 Names Only (Quick)</TabsTrigger>
                  <TabsTrigger value="csv" className="rounded-lg">📊 CSV (Full Details)</TabsTrigger>
                </TabsList>

                <TabsContent value="names" className="space-y-4">
                  <div className="rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4">
                    <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">Fastest way — no AI, no CSV</p>
                    <p className="text-sm text-green-700 dark:text-green-400">Creates empty entries. Then use AI Add → Batch tab to auto-fill details for all of them.</p>
                  </div>
                  <div>
                    <Label>Startup names — one per line</Label>
                    <Textarea
                      value={namesText}
                      onChange={e => setNamesText(e.target.value)}
                      placeholder={"Eggoz Nutrition\nZepto\nMamaearth\nNykaa\nboat\nMeesho\nRazorpay\nCRED"}
                      className="mt-1.5 rounded-xl min-h-[180px] font-mono text-sm"
                    />
                    {namesText.trim() && (
                      <p className="text-xs text-muted-foreground mt-1.5">
                        {namesText.trim().split('\n').filter(n => n.trim()).length} names ready
                      </p>
                    )}
                  </div>
                  <Button onClick={handleNamesImport} disabled={namesLoading || !namesText.trim()} className="btn-gradient rounded-xl">
                    {namesLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Adding...</> : <><Plus className="w-4 h-4 mr-2" />Create All Stubs</>}
                  </Button>
                </TabsContent>

                <TabsContent value="csv" className="space-y-4">
                  <div className="rounded-xl bg-muted/40 border border-border p-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Columns (only name required)</p>
                    <code className="text-xs text-foreground font-mono">name, sector, website, hq_city, company_size, roles_hiring</code>
                    <p className="text-xs text-muted-foreground mt-2">Sector values: food, health, beauty, fashion, home, fintech, edtech, saas, others</p>
                    <button
                      onClick={() => {
                        const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a'); a.href = url; a.download = 'startups-template.csv'; a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="mt-3 flex items-center gap-1.5 text-xs text-primary hover:underline"
                    >
                      <Download className="w-3.5 h-3.5" /> Download template with examples
                    </button>
                  </div>
                  <div>
                    <Label>Paste CSV data</Label>
                    <Textarea
                      value={csvText}
                      onChange={e => setCsvText(e.target.value)}
                      placeholder={'name,sector,hq_city\n"Eggoz Nutrition","food","Gurugram"\n"Zepto","food","Mumbai"'}
                      className="mt-1.5 rounded-xl min-h-[180px] font-mono text-sm"
                    />
                    {csvText.trim() && (() => {
                      const count = csvText.trim().split('\n').filter(l => l.trim()).length - 1;
                      return count > 0 ? <p className="text-xs text-muted-foreground mt-1.5">{count} data row{count > 1 ? 's' : ''} detected</p> : null;
                    })()}
                  </div>
                  <Button onClick={handleCSVImport} disabled={csvLoading || !csvText.trim()} className="btn-gradient rounded-xl">
                    {csvLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Importing...</> : <><PenLine className="w-4 h-4 mr-2" />Import from CSV</>}
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
