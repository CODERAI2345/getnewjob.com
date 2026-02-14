import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Company } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  status?: 'success' | 'error' | 'clarification';
  updates?: Record<string, any>;
}

interface AICustomizeProps {
  companies: Company[];
  onUpdate: (id: string, updates: Partial<Company>) => Promise<void>;
}

const exampleCommands = [
  "Change brand color to deep blue",
  "Update button gradient to purple to cyan",
  "Add AI and DevOps to technologies",
  "Change company size to 201-500",
  "Set industry to Technology",
  "Update HQ to Berlin, Germany",
  "Set description to 'Leading provider of cloud solutions'",
];

export function AICustomize({ companies, onUpdate }: AICustomizeProps) {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedCompany = companies.find(c => c.id === selectedCompanyId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !selectedCompany || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-customize', {
        body: {
          command: userMsg.content,
          companyName: selectedCompany.name,
          currentData: {
            name: selectedCompany.name,
            website: selectedCompany.website,
            logoUrl: selectedCompany.logoUrl,
            brandTitleHtml: selectedCompany.brandTitleHtml,
            careerUrl: selectedCompany.careerUrl,
            linkedinUrl: selectedCompany.linkedinUrl,
            foundedYear: selectedCompany.foundedYear,
            hqCity: selectedCompany.hqCity,
            hqCountry: selectedCompany.hqCountry,
            industry: selectedCompany.industry,
            companySize: selectedCompany.companySize,
            technologies: selectedCompany.technologies,
            description: selectedCompany.description,
            notes: selectedCompany.notes,
            brandColor: selectedCompany.brandColor,
            gradientColor1: selectedCompany.gradientColor1,
            gradientColor2: selectedCompany.gradientColor2,
            gradientAngle: selectedCompany.gradientAngle,
            buttonGradientColor1: selectedCompany.buttonGradientColor1,
            buttonGradientColor2: selectedCompany.buttonGradientColor2,
            buttonGradientAngle: selectedCompany.buttonGradientAngle,
          },
        },
      });

      if (error) throw error;

      if (data.clarification) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: data.clarification,
          status: 'clarification',
        }]);
      } else if (data.error) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: `Error: ${data.error}`,
          status: 'error',
        }]);
      } else {
        // Apply updates
        await onUpdate(selectedCompany.id, data);

        const changedFields = Object.keys(data);
        const summary = changedFields.map(k => `**${k}**: ${JSON.stringify(data[k])}`).join('\n');

        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: `✅ Updated ${changedFields.length} field${changedFields.length > 1 ? 's' : ''}:\n${summary}`,
          status: 'success',
          updates: data,
        }]);
      }
    } catch (err: any) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Something went wrong: ${err.message || 'Unknown error'}`,
        status: 'error',
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Company Selector */}
      <div className="rounded-2xl bg-card border border-border/50 p-6">
        <h3 className="font-display text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          AI Customize
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Select a company and type natural language commands to update its fields.
        </p>
        <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
          <SelectTrigger className="rounded-xl">
            <SelectValue placeholder="Select a company to customize..." />
          </SelectTrigger>
          <SelectContent>
            {companies.map(c => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedCompany && (
        <>
          {/* Example Commands */}
          <div className="rounded-2xl bg-secondary/30 border border-border/50 p-5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Try saying:</p>
            <div className="flex flex-wrap gap-2">
              {exampleCommands.map((cmd, i) => (
                <button
                  key={i}
                  onClick={() => setInput(cmd)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary/8 text-primary border border-primary/15 hover:bg-primary/15 transition-all cursor-pointer"
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="rounded-2xl bg-card border border-border/50 overflow-hidden">
            <div className="h-[400px] overflow-y-auto p-5 space-y-4 scrollbar-thin">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <Bot className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Type a command to customize <strong>{selectedCompany.name}</strong>
                  </p>
                </div>
              )}

              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      {msg.status === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : msg.status === 'error' ? (
                        <AlertCircle className="w-4 h-4 text-destructive" />
                      ) : (
                        <Bot className="w-4 h-4 text-primary" />
                      )}
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : msg.status === 'success'
                          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-foreground'
                          : msg.status === 'error'
                            ? 'bg-destructive/10 border border-destructive/20 text-foreground'
                            : 'bg-secondary text-foreground'
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-4 h-4 text-accent" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  </div>
                  <div className="bg-secondary rounded-2xl px-4 py-3 text-sm text-muted-foreground">
                    Thinking...
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-border/50 p-4">
              <form
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex gap-3"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Tell AI what to change for ${selectedCompany.name}...`}
                  className="flex-1 rounded-xl"
                  disabled={loading}
                />
                <Button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="btn-gradient rounded-xl px-4"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
