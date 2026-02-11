import { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { Company } from '@/types';
import { toast } from 'sonner';

interface QuickAddCompanyProps {
  onCompanyAdded: (data: Partial<Company>) => void;
}

export function QuickAddCompany({ onCompanyAdded }: QuickAddCompanyProps) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="bg-card rounded-2xl border border-border/50 p-6 animate-fade-in">
      <div className="mb-4">
        <h3 className="font-display text-lg font-semibold text-foreground mb-1">Quick Add Company</h3>
        <p className="text-sm text-muted-foreground">
          Paste any text about a company — a description, LinkedIn bio, career page blurb — and AI will extract the details automatically.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="company-text">Company Information</Label>
          <Textarea
            id="company-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={"Example: Google is a technology company founded in 1998, headquartered in Mountain View, USA. They have 100,000+ employees and work with technologies like Go, Python, Kubernetes. Their careers page is at careers.google.com..."}
            className="mt-1.5 rounded-xl min-h-[160px]"
            rows={6}
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
              Parsing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Add Company from Text
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
