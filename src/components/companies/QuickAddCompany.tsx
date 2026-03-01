import { useState } from 'react';
import { Loader2, Sparkles, PenLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Company } from '@/types';
import { toast } from 'sonner';

interface QuickAddCompanyProps {
  onCompanyAdded: (data: Partial<Company>) => void;
}

const industries = [
  'Technology', 'Finance', 'Healthcare', 'E-commerce', 'Education',
  'Manufacturing', 'Consulting', 'Media', 'Telecom', 'Automotive',
  'Energy', 'Real Estate', 'Other',
];

const companySizes = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5000+'];

export function QuickAddCompany({ onCompanyAdded }: QuickAddCompanyProps) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  // Manual form state
  const [form, setForm] = useState({
    name: '', industry: '', hqCity: '', hqCountry: '', foundedYear: '',
    headcount: '', stage: '', description: '', coreStrength: '',
    hiringTechnologies: '', futureDirection: '', organizationStrength: '',
    notableProducts: '', careerBenefits: '', linkedinUrl: '', website: '',
    careerUrl: '', companySize: '',
  });

  const updateForm = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleParse = async () => {
    if (!text.trim()) return;
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('parse-company', {
        body: { text: text.trim() },
      });

      if (error) throw error;
      if (!data || !data.name) {
        toast.error('Could not extract company name from the text');
        return;
      }

      await onCompanyAdded({
        name: data.name,
        website: data.website || undefined,
        careerUrl: data.careerUrl || undefined,
        linkedinUrl: data.linkedinUrl || undefined,
        foundedYear: data.foundedYear || undefined,
        hqCity: data.hqCity || undefined,
        hqCountry: data.hqCountry || undefined,
        industry: data.industry || undefined,
        companySize: data.companySize || undefined,
        technologies: data.technologies || undefined,
        description: data.description || undefined,
        coreStrength: data.coreStrength || undefined,
        hiringTechnologies: data.hiringTechnologies || undefined,
        futureDirection: data.futureDirection || undefined,
        organizationStrength: data.organizationStrength || undefined,
        notableProducts: data.notableProducts || undefined,
        careerBenefits: data.careerBenefits || undefined,
        stage: data.stage || undefined,
        headcount: data.headcount || undefined,
      });

      toast.success(`"${data.name}" added successfully!`);
      setText('');
    } catch (err: any) {
      console.error('Parse error:', err);
      toast.error('Failed to parse text. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = async () => {
    if (!form.name.trim()) {
      toast.error('Company name is required');
      return;
    }
    setLoading(true);
    try {
      await onCompanyAdded({
        name: form.name,
        industry: form.industry || undefined,
        hqCity: form.hqCity || undefined,
        hqCountry: form.hqCountry || undefined,
        foundedYear: form.foundedYear ? parseInt(form.foundedYear) : undefined,
        headcount: form.headcount || undefined,
        stage: form.stage || undefined,
        description: form.description || undefined,
        coreStrength: form.coreStrength || undefined,
        hiringTechnologies: form.hiringTechnologies || undefined,
        futureDirection: form.futureDirection || undefined,
        organizationStrength: form.organizationStrength || undefined,
        notableProducts: form.notableProducts || undefined,
        careerBenefits: form.careerBenefits || undefined,
        linkedinUrl: form.linkedinUrl || undefined,
        website: form.website || undefined,
        careerUrl: form.careerUrl || form.website || '#',
        companySize: form.companySize || undefined,
      });

      toast.success(`"${form.name}" added successfully!`);
      setForm({
        name: '', industry: '', hqCity: '', hqCountry: '', foundedYear: '',
        headcount: '', stage: '', description: '', coreStrength: '',
        hiringTechnologies: '', futureDirection: '', organizationStrength: '',
        notableProducts: '', careerBenefits: '', linkedinUrl: '', website: '',
        careerUrl: '', companySize: '',
      });
    } catch (err) {
      toast.error('Failed to add company.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border/50 p-6 animate-fade-in">
      <div className="mb-5">
        <h3 className="font-display text-lg font-semibold text-foreground mb-1">Quick Add Company</h3>
        <p className="text-sm text-muted-foreground">
          Add a company using AI extraction or fill in the details manually.
        </p>
      </div>

      <Tabs defaultValue="ai" className="space-y-5">
        <TabsList className="rounded-xl">
          <TabsTrigger value="ai" className="rounded-lg flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            AI Fetch
          </TabsTrigger>
          <TabsTrigger value="manual" className="rounded-lg flex items-center gap-1.5">
            <PenLine className="w-3.5 h-3.5" />
            Manual Entry
          </TabsTrigger>
        </TabsList>

        {/* AI Fetch Tab */}
        <TabsContent value="ai" className="space-y-4">
          <div>
            <Label htmlFor="company-text">Paste company information</Label>
            <Textarea
              id="company-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={"Example: Google is a multinational technology company specializing in internet services. Founded in 1998, headquartered in Mountain View, California, USA. 190,000+ employees. Public (NASDAQ: GOOGL). Technologies: Python, Java, C++, Go, Kubernetes, TensorFlow..."}
              className="mt-1.5 rounded-xl min-h-[180px]"
              rows={7}
            />
          </div>

          <Button
            onClick={handleParse}
            disabled={loading || !text.trim()}
            className="btn-gradient rounded-xl w-full sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Extracting with AI...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Extract & Add Company
              </>
            )}
          </Button>
        </TabsContent>

        {/* Manual Entry Tab */}
        <TabsContent value="manual" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="m-name">Name *</Label>
              <Input id="m-name" value={form.name} onChange={(e) => updateForm('name', e.target.value)} placeholder="Google" className="mt-1.5 rounded-xl" />
            </div>
            <div>
              <Label htmlFor="m-industry">Industry</Label>
              <Select value={form.industry} onValueChange={(v) => updateForm('industry', v)}>
                <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue placeholder="Select industry" /></SelectTrigger>
                <SelectContent>
                  {industries.map(ind => <SelectItem key={ind} value={ind}>{ind}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="m-hq">Headquarters</Label>
              <Input id="m-hq" value={form.hqCity} onChange={(e) => updateForm('hqCity', e.target.value)} placeholder="Mountain View, California, USA" className="mt-1.5 rounded-xl" />
            </div>
            <div>
              <Label htmlFor="m-founded">Founded</Label>
              <Input id="m-founded" type="number" value={form.foundedYear} onChange={(e) => updateForm('foundedYear', e.target.value)} placeholder="1998" className="mt-1.5 rounded-xl" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="m-headcount">Headcount</Label>
              <Input id="m-headcount" value={form.headcount} onChange={(e) => updateForm('headcount', e.target.value)} placeholder="190,000+" className="mt-1.5 rounded-xl" />
            </div>
            <div>
              <Label htmlFor="m-stage">Stage</Label>
              <Input id="m-stage" value={form.stage} onChange={(e) => updateForm('stage', e.target.value)} placeholder="Public (NASDAQ: GOOGL)" className="mt-1.5 rounded-xl" />
            </div>
          </div>

          <div>
            <Label htmlFor="m-description">Description</Label>
            <Textarea id="m-description" value={form.description} onChange={(e) => updateForm('description', e.target.value)} placeholder="Brief description of the company..." className="mt-1.5 rounded-xl" rows={3} />
          </div>

          <div>
            <Label htmlFor="m-coreStrength">Core Strength</Label>
            <Textarea id="m-coreStrength" value={form.coreStrength} onChange={(e) => updateForm('coreStrength', e.target.value)} placeholder="Search technology, advertising platforms, AI/ML..." className="mt-1.5 rounded-xl" rows={2} />
          </div>

          <div>
            <Label htmlFor="m-hiringTech">Hiring Technologies</Label>
            <Input id="m-hiringTech" value={form.hiringTechnologies} onChange={(e) => updateForm('hiringTechnologies', e.target.value)} placeholder="Python, Java, C++, Go, Kubernetes, TensorFlow" className="mt-1.5 rounded-xl" />
          </div>

          <div>
            <Label htmlFor="m-futureDirection">Future Direction</Label>
            <Textarea id="m-futureDirection" value={form.futureDirection} onChange={(e) => updateForm('futureDirection', e.target.value)} placeholder="Investing in generative AI, cloud computing..." className="mt-1.5 rounded-xl" rows={3} />
          </div>

          <div>
            <Label htmlFor="m-orgStrength">Organization Strength</Label>
            <Textarea id="m-orgStrength" value={form.organizationStrength} onChange={(e) => updateForm('organizationStrength', e.target.value)} placeholder="Engineering-driven culture, innovation focus..." className="mt-1.5 rounded-xl" rows={2} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="m-products">Notable Products</Label>
              <Input id="m-products" value={form.notableProducts} onChange={(e) => updateForm('notableProducts', e.target.value)} placeholder="Google Search, Cloud Platform, Android" className="mt-1.5 rounded-xl" />
            </div>
            <div>
              <Label htmlFor="m-benefits">Career Benefits</Label>
              <Input id="m-benefits" value={form.careerBenefits} onChange={(e) => updateForm('careerBenefits', e.target.value)} placeholder="Competitive compensation, innovation culture" className="mt-1.5 rounded-xl" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="m-linkedin">LinkedIn URL</Label>
              <Input id="m-linkedin" type="url" value={form.linkedinUrl} onChange={(e) => updateForm('linkedinUrl', e.target.value)} placeholder="https://linkedin.com/company/google" className="mt-1.5 rounded-xl" />
            </div>
            <div>
              <Label htmlFor="m-website">Website URL</Label>
              <Input id="m-website" type="url" value={form.website} onChange={(e) => updateForm('website', e.target.value)} placeholder="https://google.com" className="mt-1.5 rounded-xl" />
            </div>
          </div>

          <Button
            onClick={handleManualSubmit}
            disabled={loading || !form.name.trim()}
            className="btn-gradient rounded-xl w-full sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <PenLine className="w-4 h-4 mr-2" />
                Add Company
              </>
            )}
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
